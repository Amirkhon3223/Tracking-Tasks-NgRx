import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { addTask } from '../../../store/tasks/tasks.actions';
import { Task } from '../../../models/task.model';
import { AuthService } from '../../../services/auth/auth.service';
import { UserService } from '../../../services/user/user.service';
import { User } from '../../../models/user.model';
import { Subject, takeUntil } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-task-add',
  templateUrl: './task-add-modal.component.html',
  styleUrls: ['./task-add-modal.component.scss']
})
export class TaskAddModalComponent implements OnInit, OnDestroy {
  taskForm: FormGroup;
  range: FormGroup;
  allUsers: User[] = [];

  private readonly destroy$: Subject<void> = new Subject<void>();

  private authService = inject(AuthService);
  private userService = inject(UserService);

  constructor(
    public readonly dialogRef: MatDialogRef<TaskAddModalComponent>,
    private readonly fb: FormBuilder,
    private readonly store: Store,
    private readonly snackBar: MatSnackBar,
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      project: [''],
      priority: [''],
      collaboration: [[]],
    });

    this.range = this.fb.group({
      start: null,
      end: null,
    });
  }

  ngOnInit(): void {
    this.userService.getUsers().pipe(takeUntil(this.destroy$)).subscribe(users => {
      this.allUsers = users;
    });
  }

  onSubmit() {
    if (this.taskForm.valid && this.range.valid) {
      const currentUser = this.authService.getCurrentUser();
      const userId = currentUser?.id ?? '';

      const newTask: Task = {
        id: '',
        ...this.taskForm.value,
        date: {
          start: this.range.value.start,
          end: this.range.value.end,
        },
        completed: false,
        userId,
      };
      this.store.dispatch(addTask({task: newTask}));
      this.snackBar.open('Новая задача успешно добавлена!', 'Закрыть', {duration: 3000});
      this.dialogRef.close();
    } else {
      this.snackBar.open('Ошибка при создании новой задачи. Проверьте все поля!', 'Закрыть', {duration: 3000});
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
