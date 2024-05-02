import { User } from '../../models/user.model';
import { createReducer, on } from '@ngrx/store';
import * as UserActions from './users.actions';

export interface UserState {
  users: User[];
  currentUser: User | null;
  error: unknown;
  loading: boolean;
}

export const initialState: UserState = {
  users: [],
  currentUser: null,
  error: null,
  loading: false,
};

export const usersReducer = createReducer(
  initialState,
  on(UserActions.loadUsers, (state) => ({
    ...state,
    loading: true,
  })),
  on(UserActions.loadUsersSuccess, (state, {users}) => ({
    ...state,
    loading: false,
    users,
  })),
  on(UserActions.loadUsersFailure, (state, {error}) => ({
    ...state,
    loading: false,
    error,
  })),
  on(UserActions.addUser, (state, {user}) => ({
    ...state,
    users: [...state.users, user],
  })),
  on(UserActions.updateUser, (state, {user}) => ({
    ...state,
    users: state.users.map((u) =>
      u.id === user.id ? user : u
    ),
  })),
);
