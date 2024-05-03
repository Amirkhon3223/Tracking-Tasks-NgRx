import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as TaskActions from './tasks.actions';
import { TaskService } from '../../services/task/task.service';
import { of } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';

@Injectable()
export class TasksEffects {
  loadTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.loadTasks),
      switchMap(() => {
        const userId = this.authService.getCurrentUser()?.id ?? '';
        return this.taskService.getTasks(userId).pipe(
          map(tasks => TaskActions.loadTasksSuccess({tasks})),
          catchError(error => of(TaskActions.loadTasksFailure({error})))
        );
      })
    )
  );

  addTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.addTask),
      switchMap((action) => {
        const userId = this.authService.getCurrentUser()?.id ?? '';
        return this.taskService.addTask(action.task, userId).pipe(
          switchMap(() => this.taskService.getTasks(userId)),
          map((tasks) => TaskActions.loadTasksSuccess({tasks})),
          catchError((error) => of(TaskActions.loadTasksFailure({error})))
        );
      })
    )
  );

  deleteTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.deleteTask),
      switchMap((action) => {
        const userId = this.authService.getCurrentUser()?.id ?? '';
        return this.taskService.deleteTask(action.id, userId).pipe(
          switchMap(() => this.taskService.getTasks(userId)),
          map((tasks) => TaskActions.loadTasksSuccess({tasks})),
          catchError((error) => of(TaskActions.loadTasksFailure({error})))
        );
      })
    )
  );

  updateTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.updateTask),
      switchMap(action =>
        this.taskService.updateTask(action.task,
          this.authService.getCurrentUser()?.id ?? '').pipe(
          map(() => TaskActions.loadTasks()),
          catchError((error) => of(TaskActions.loadTasksFailure({error})))
        )
      )
    )
  );

  private taskService = inject(TaskService);
  private authService = inject(AuthService);

  constructor(
    private actions$: Actions,
  ) {
  }
}
