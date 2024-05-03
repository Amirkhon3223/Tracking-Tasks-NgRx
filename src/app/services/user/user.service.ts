import { inject, Injectable } from '@angular/core';
import { User } from '../../models/user.model';
import { delay, Observable, of } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = [];

  private _authService = inject(AuthService);

  constructor() {
  }

  getUsers(): Observable<User[]> {
    return of(this.getUsersFromLocalStorage())
      .pipe(
        map((users) => {
          const currentUser = this._authService.getCurrentUser();
          return users.filter((user) => user.id !== currentUser?.id);
        }), delay(100)
      );
  }

  private getUsersFromLocalStorage(): User[] {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  }
}
