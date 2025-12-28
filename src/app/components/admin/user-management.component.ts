
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../models/app.models';

export interface UserManagementUser extends User {
  isActive: boolean;
  createdAt: string;
}


@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent {
  title = 'Gestion des comptes utilisateurs';
  users: UserManagementUser[] = [];
}
