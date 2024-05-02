import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as UserActions from './users.actions';
import { UserService } from '../../services/user/user.service';

@Injectable()
export class UsersEffects {
  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUsers),
      switchMap(() =>
        this._userService.getUsers().pipe(
          map(users => UserActions.loadUsersSuccess({users})),
          catchError(error => of(UserActions.loadUsersFailure({error})))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private _userService: UserService
  ) {
  }
}
