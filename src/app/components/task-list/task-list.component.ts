import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Task } from '../../models/task.model';
import { User } from '../../models/user.model';
import { TaskService } from '../../services/task/task.service';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/user/user.service';
//NgRx
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app-state';
import { selectAllTasks } from '../../store/tasks/tasks.selector';
import { loadTasks, updateTask } from '../../store/tasks/tasks.actions';

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

  private allUsers: User[] = [];

  private readonly destroy$ = new Subject<void>();

  private readonly taskService = inject(TaskService);
  private authService = inject(AuthService);
  private readonly userService = inject(UserService);

  constructor(
    private readonly store: Store<AppState>,
  ) {
    const userId = this.authService.getCurrentUser()?.id;
    if (userId) {
      this.tasks$ = this.store.select(selectAllTasks, { userId });
    }
  }

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();

    if (currentUser) {
      this.store.dispatch(loadTasks());
    }

    this.userService.getUsers().pipe(takeUntil(this.destroy$)).subscribe(users => {
      this.allUsers = users;
    });

    this.tasks$.pipe(takeUntil(this.destroy$)).subscribe(tasks => {
      this.filteredTasks = tasks;
    });

    document.addEventListener('keydown', this.onKeyDown);
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
    const userId = this.authService.getCurrentUser()?.id ?? '';
    this.taskService.deleteTask(taskId, userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.store.dispatch(loadTasks()));
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

  private onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.drawer && this.drawer.opened) {
      this.drawer.close();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    document.removeEventListener('keydown', this.onKeyDown);
  }
}
