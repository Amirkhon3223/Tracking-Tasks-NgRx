import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnDestroy {
  loginForm: FormGroup;

  private readonly destroy$ = new Subject<void>();
  private readonly authService = inject(AuthService);

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      const {username, password} = this.loginForm.value;

      this.authService.login(username, password).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (user) => {
          if (user) {
            this.router.navigate(['/']);
            this.snackBar.open('Добро пожаловать!', 'OK', {duration: 3000});
          } else {
            this.snackBar.open('Неверный логин или пароль', 'Закрыть', {duration: 3000});
          }
        },
        error: (error) => {
          console.error('Invalid login credentials', error);
          this.snackBar.open('Ошибка аутентификации: неверный логин или пароль', 'Закрыть', {duration: 5000});
        }
      });
    } else {
      this.snackBar.open('Пожалуйста, заполните все поля', 'Закрыть', {duration: 3000});
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
