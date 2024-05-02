import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';

import { Task } from '../../../models/task.model';
//NgRx
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app-state';
import { selectAllTasks } from '../../../store/tasks/tasks.selector';
import { loadTasks, updateTask } from '../../../store/tasks/tasks.actions';
import { TaskService } from '../../../services/task/task.service';
import { MatDrawer } from '@angular/material/sidenav';
import { AuthService } from '../../../services/user/auth.service';
import { User } from '../../../models/user.model';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})

export class TaskListComponent implements OnInit, OnDestroy {
  tasks$!: Observable<Task[]>;
  selectedTask: Task | null = null;
  filteredTasks: Task[] = [];

  @ViewChild('drawer') drawer: MatDrawer | undefined;

  private destroy$ = new Subject<void>();
  private allUsers: User[] = [];

  constructor(
    private store: Store<AppState>,
    private _taskService: TaskService,
    private _authService: AuthService,
    private _userService: UserService
  ) {
    this.tasks$ = this.store.select(selectAllTasks);
  }

  ngOnInit(): void {
    const currentUser = this._authService.getCurrentUser();

    if (currentUser) {
      this.store.dispatch(loadTasks());
    }

    this._userService.getUsers().subscribe(users => {
      this.allUsers = users;
    });

    this.tasks$.pipe(takeUntil(this.destroy$)).subscribe(tasks => {
      this.filteredTasks = tasks;
    });

    document.addEventListener('keydown', this.onKeyDown.bind(this));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    document.removeEventListener('keydown', this.onKeyDown.bind(this));
  }

  getInitials(fullName: string): string {
    const nameParts = fullName.split(' ');

    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`;
    } else {
      return fullName.substring(0, 2);
    }
  }

  getUserById(userId: string): User | undefined {
    return this.allUsers.find(user => user.id === userId);
  }

  handleFilteredTasks(tasks: Task[]): void {
    this.filteredTasks = tasks;
  }

  toggleCompleted(task: Task): void {
    const updatedTask = {...task, completed: !task.completed};
    this.store.dispatch(updateTask({task: updatedTask}));
  }

  deleteTask(taskId: string): void {
    const userId = this._authService.getCurrentUser()?.id ?? '';
    this._taskService.deleteTask(taskId, userId).subscribe(() => {
      this.store.dispatch(loadTasks());
    });
  }

  openDrawer(task: Task): void {
    this.selectedTask = task;
    if (this.drawer) {
      this.drawer.open();
    }
  }

  closeDrawer(): void {
    if (this.drawer) {
      this.drawer.close();
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.drawer && this.drawer.opened) {
      this.drawer.close();
    }
  }
}
