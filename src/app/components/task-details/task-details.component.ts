import { Component, EventEmitter, inject, Input, OnChanges, OnDestroy, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Task } from '../../models/task.model';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { updateTask } from '../../store/tasks/tasks.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss']
})
export class TaskDetailsComponent implements OnChanges, OnDestroy {
  @Input() selectedTask: Task | null = null;
  @Output() taskUpdated = new EventEmitter<Task>();

  editing = false;
  taskForm: FormGroup;
  range: FormGroup;
  allUsers: User[] = [];

  private readonly destroy$ = new Subject<void>();
  private readonly userService = inject(UserService);

  constructor(
    private readonly store: Store,
    private readonly snackBar: MatSnackBar,
  ) {
    this.taskForm = new FormGroup({
      title: new FormControl(''),
      description: new FormControl(''),
      project: new FormControl(''),
      priority: new FormControl(''),
      collaboration: new FormControl([])
    });

    this.range = new FormGroup({
      start: new FormControl<Date | null>(null),
      end: new FormControl<Date | null>(null)
    });

    this.userService.getUsers().pipe(
      takeUntil(this.destroy$)
    ).subscribe(users => {
      this.allUsers = users;
    });
  }

  ngOnChanges(): void {
    if (this.selectedTask) {
      this.taskForm.patchValue({
        title: this.selectedTask.title,
        description: this.selectedTask.description,
        project: this.selectedTask.project,
        priority: this.selectedTask.priority,
        collaboration: this.selectedTask.collaboration
      });
      this.range.patchValue({
        start: this.selectedTask.date?.start ? new Date(this.selectedTask.date?.start) : null,
        end: this.selectedTask.date?.end ? new Date(this.selectedTask.date?.end) : null,
      });
    }
  }

  getUserById(userId: string): User | undefined {
    return this.allUsers.find(user => user.id === userId);
  }

  getInitials(fullName: string): string {
    const parts = fullName.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`;
    } else {
      return fullName.substring(0, 2);
    }
  }

  onEditTask(): void {
    this.editing = true;
  }

  saveTaskChanges(): void {
    if (this.taskForm.valid && this.selectedTask) {
      const updatedTask = {
        ...this.selectedTask,
        ...this.taskForm.value,
        date: {
          start: this.range.value.start,
          end: this.range.value.end
        }
      };

      this.store.dispatch(updateTask({task: updatedTask}));
      this.taskUpdated.emit(updatedTask);
      this.snackBar.open('Задача обновлена успешно', 'OK', { duration: 3000 });
      this.editing = false;
    } else {
      this.snackBar.open('Ошибка: форма невалидна. Проверьте введенные данные.', 'Закрыть', { duration: 3000 });
    }
  }

  cancelEditing(): void {
    this.editing = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
