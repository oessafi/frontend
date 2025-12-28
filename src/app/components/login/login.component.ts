import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onLogin(): void {
    if (!this.loginForm.valid) {
      this.errorMessage = 'Formulaire invalide';
      return;
    }

    this.errorMessage = '';
    const credentials = this.loginForm.value;

    this.auth.login(credentials).subscribe({
      next: (res) => {
        const role = res?.user?.role;
        if (role) {
          this.redirectToRoleDashboard(role);
        } else {
          this.errorMessage = 'Réponse invalide du serveur (rôle manquant).';
        }
      },
      error: (err) => {
        console.error('Login failed', err);
        // Fix for TS2532: Use optional chaining and nullish coalescing
        this.errorMessage = err?.error?.message ?? 'Échec de la connexion';
      }
    });
  } // End of onLogin

  private redirectToRoleDashboard(role: string | null): void {
    console.log('🎯 Tentative de redirection pour le rôle:', role);
    
    // Normalize role: Remove 'ROLE_' prefix if it exists and make uppercase
    const normalizedRole = role ? String(role).replace('ROLE_', '').toUpperCase() : '';
    console.log('📝 Rôle normalisé:', normalizedRole);

    const roleRoutes: Record<string, string> = {
      'CANDIDAT': '/doctorant/dashboard',
      'DOCTORANT': '/doctorant/dashboard',
      'DIRECTEUR_THESE': '/encadrant/dashboard',
      'ENCADRANT': '/encadrant/dashboard',
      'PERSONNEL_ADMIN': '/admin/dashboard',
      'ADMINISTRATIF': '/admin/dashboard'
    };

    const targetRoute = roleRoutes[normalizedRole];

    if (targetRoute) {
      this.router.navigate([targetRoute]).then(
        (success) => console.log('Navigation réussie:', success),
        (error) => console.error('Erreur navigation:', error)
      );
    } else {
      console.error('❌ Rôle inconnu:', normalizedRole);
      this.errorMessage = `Rôle non reconnu : ${normalizedRole}`;
    }
  }
} // End of class