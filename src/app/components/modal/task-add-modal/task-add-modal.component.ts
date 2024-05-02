import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { addTask } from '../../../store/tasks/tasks.actions';
import { Task } from '../../../models/task.model';
import { AuthService } from '../../../services/user/auth.service';
import { UserService } from '../../../services/user/user.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-task-add-modal',
  templateUrl: './task-add-modal.component.html',
  styleUrls: ['./task-add-modal.component.scss']
})
export class TaskAddModalComponent implements OnInit {
  taskForm: FormGroup;
  range: FormGroup;
  allUsers: User[] = [];

  constructor(
    public dialogRef: MatDialogRef<TaskAddModalComponent>,
    private fb: FormBuilder,
    private store: Store,
    private _authService: AuthService,
    private _userService: UserService
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
    this._userService.getUsers().subscribe(users => {
      console.log('Полученные юзеры:', users);
      this.allUsers = users;
    });
  }

  onSubmit() {
    if (this.taskForm.valid && this.range.valid) {
      const currentUser = this._authService.getCurrentUser();
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
      this.dialogRef.close();
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
