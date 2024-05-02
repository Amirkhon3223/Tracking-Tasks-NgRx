import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TaskAddModalComponent } from '../modal/task-add-modal/task-add-modal.component';
import { AuthService } from '../../services/user/auth.service';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  currentUser: User | null;

  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private rote: Router
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  logout(): void {
    this.authService.logout();
    this.rote.navigate(['login']);
  }

  openAddTaskDialog(): void {
    this.dialog.open(TaskAddModalComponent, {
      width: '600px'
    });
  }
}
