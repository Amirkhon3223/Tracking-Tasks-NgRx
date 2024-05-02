import { Task } from '../../models/task.model';
import { createReducer, on } from '@ngrx/store';
import * as TaskActions from './tasks.actions';

export interface TaskState {
  tasks: Task[];
  error: unknown;
  loading: boolean;
}

export const initialState: TaskState = {
  tasks: [],
  error: null,
  loading: false
};

export const tasksReducer = createReducer(
  initialState,
  on(TaskActions.loadTasks, state => ({
    ...state,
    loading: true
  })),
  on(TaskActions.loadTasksSuccess, (state, {tasks}) => ({
    ...state,
    loading: false,
    tasks
  })),
  on(TaskActions.loadTasksFailure, (state, {error}) => ({
    ...state,
    loading: false,
    error
  })),
  on(TaskActions.deleteTask, (state, {id}) => ({
    ...state,
    tasks: state.tasks.filter(task => task.id !== id)
  })),
);
