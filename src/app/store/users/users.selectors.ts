import { createSelector } from '@ngrx/store';
import { UserState } from './users.reducer';
import { AppState } from '../app-state';

export const selectUserState = (state: AppState) => state.users;

export const selectAllUsers = createSelector(
  selectUserState,
  (state: UserState) => state.users
);

export const selectCurrentUser = createSelector(
  selectUserState,
  (state: UserState) => state.currentUser
);
