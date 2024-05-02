import { createAction, props } from '@ngrx/store';
import { Task } from '../../models/task.model';

export const loadTasks = createAction(
  '[Task] Load Task',
);

export const loadTasksSuccess = createAction(
  '[Task] Load Task Success', props<{ tasks: Task[] }>()
);

export const loadTasksFailure = createAction(
  '[Task] Load Tasks Failure', props<{ error: unknown }>()
);

export const addTask = createAction(
  '[Task] Add Task', props<{ task: Task }>()
);

export const updateTask = createAction(
  '[Task] Update Task', props<{ task: Task }>()
);

export const deleteTask = createAction(
  '[Task] Delete Task', props<{ id: string }>()
);
