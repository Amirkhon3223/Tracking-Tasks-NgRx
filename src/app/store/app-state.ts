import { TaskState } from './tasks/tasks.reducer';
import { UserState } from './users/users.reducer';

export interface AppState {
  tasks: TaskState;
  users: UserState;
}
