import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Task } from '../../../models/task.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app-state';
import { selectAllTasks } from '../../../store/tasks/tasks.selector';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from '../../../services/user/user.service';
import { User } from '../../../models/user.model';
import { TaskFilterForm } from '../../../models/task-filter.model';

@Component({
  selector: 'app-task-filter',
  templateUrl: './task-filter.component.html',
  styleUrls: ['./task-filter.component.scss']
})
export class TaskFilterComponent implements OnInit {
  filterForm: FormGroup;
  allUsers: User[] = [];
  @Output() filtered = new EventEmitter<Task[]>();

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private _userService: UserService
  ) {
    this.filterForm = this.fb.group({
      completed: [''],
      executor: [''],
      priority: [''],
      deadline: this.fb.group({
        start: new FormControl<Date | null>(null),
        end: new FormControl<Date | null>(null),
      })
    });
  }

  ngOnInit() {
    this._userService.getUsers().subscribe(users => {
      this.allUsers = users;
    });

    this.filterForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(formValues => {
          return this.store.select(selectAllTasks).pipe(
            map(tasks => this.applyFilter(tasks, formValues))
          );
        })
      ).subscribe(filteredTasks => this.filtered.emit(filteredTasks));
  }

  resetDates() {
    this.filterForm.get('deadline')?.reset();
  }

  private applyFilter(tasks: Task[], formValues: TaskFilterForm): Task[] {
    const {deadline, executor, completed, priority} = formValues;
    const startDate = deadline?.start ? new Date(deadline.start) : null;
    const endDate = deadline?.end ? new Date(deadline.end) : null;
    const executorName = executor.trim().toLowerCase();

    const matchingUserIDs = executorName ? this.allUsers.filter(user => {
      user.username.toLowerCase().includes(executorName);
    }).map(user => user.id) : [];

    return tasks.filter(task => {
      const taskStartDate = task.date?.start ? new Date(task.date.start) : null;
      const taskEndDate = task.date?.end ? new Date(task.date.end) : null;

      return (
        (completed === '' || task.completed === (completed === true)) &&
        (executorName === '' || task.collaboration.some(id => matchingUserIDs.includes(id))) &&
        (!startDate || (taskStartDate && taskStartDate >= startDate)) &&
        (!endDate || (taskEndDate && taskEndDate <= endDate)) &&
        (!priority || task.priority.toLowerCase() === priority.toLowerCase())
      );
    });
  }
}
