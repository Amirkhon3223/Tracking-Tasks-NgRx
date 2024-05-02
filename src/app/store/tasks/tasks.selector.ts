import { createSelector } from '@ngrx/store';
import { TaskState } from './tasks.reducer';
import { AppState } from '../app-state';

export const selectTaskState = (state: AppState) => state.tasks;

export const selectAllTasks = createSelector(
  selectTaskState,
  (state: TaskState) => state.tasks
);
