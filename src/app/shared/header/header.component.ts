import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TaskAddModalComponent } from '../../ui/modal/task-add/task-add-modal.component';
import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  currentUser: User | null;

  private readonly authService = inject(AuthService);

  constructor(
    public readonly dialog: MatDialog,
    private readonly rote: Router,
    private readonly snackBar: MatSnackBar,
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  logout(): void {
    this.authService.logout();
    this.rote.navigate(['login']);
    this.snackBar.open('Вы вышли из системы', 'ok', {duration: 3000})
  }

  openAddTaskDialog(): void {
    this.dialog.open(TaskAddModalComponent, {
      width: '600px'
    });
  }
}
