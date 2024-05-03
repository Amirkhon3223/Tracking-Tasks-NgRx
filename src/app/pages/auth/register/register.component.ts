import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnDestroy {
  registerForm: FormGroup;

  private readonly destroy$ = new Subject<void>();

  private readonly authService = inject(AuthService);

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  onRegister(): void {
    if (this.registerForm.valid) {
      const newUser = {
        id: '',
        ...this.registerForm.value,
      };

      this.authService.register(newUser).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: () => {
          this.router.navigate(['/login']);
          this.snackBar.open('Регистрация успешно пройдена', 'OK', { duration: 3000 });
        },
        error: (error) => {
          console.error('Registration failed:', error);
          this.snackBar.open('Ошибка регистрации: заполните все поля правильно', 'Закрыть', { duration: 3000 });
        }
      });
    } else {
      this.snackBar.open('Пожалуйста, заполните все поля правильно', 'Закрыть', { duration: 3000 });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
