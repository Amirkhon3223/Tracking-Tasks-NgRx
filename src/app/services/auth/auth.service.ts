import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../../models/user.model';
import { v4 as uuid } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: User | null = null;

  constructor() {
    this.loadCurrentUser();
  }

  register(user: User): Observable<User> {
    const users = this.getUsers();
    const newUser = {...user, id: uuid()};
    users.push(newUser);
    this.setUsers(users);
    return of(newUser);
  }

  login(username: string, password: string): Observable<User | null> {
    const users = this.getUsers();
    const user = users.find(
      (u) => u.username === username && u.password === password
    );
    if (user) {
      this.currentUser = user;
      this.setCurrentUser(user);
      return of(user);
    } else {
      return of(null);
    }
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  private getUsers(): User[] {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  }

  private setUsers(users: User[]): void {
    localStorage.setItem('users', JSON.stringify(users));
  }

  private setCurrentUser(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  private loadCurrentUser(): void {
    const user = localStorage.getItem('currentUser');
    this.currentUser = user ? JSON.parse(user) : null;
  }
}
