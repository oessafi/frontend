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

  loginForm!: FormGroup;
  errorMessage = '';

  // Constantes correspondant aux rôles définis dans app.routes.ts
  private readonly ROLE_ENCADRANT = 'ROLE_ENCADRANT';
  private readonly ROLE_ADMIN = 'ROLE_ADMINISTRATIF'; // Attention: doit matcher le route data
  private readonly ROLE_DOCTORANT = 'ROLE_DOCTORANT';

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
        const backendUserRole = res?.user?.role;

        if (backendUserRole) {
          // 1. Normaliser le rôle (transformer "DOCTORANT" en "ROLE_DOCTORANT")
          const normalized = this.normalizeRole(backendUserRole);
          // 2. Rediriger
          this.redirectByRole(normalized);
        } else {
          this.errorMessage = 'Réponse invalide du serveur (rôle manquant).';
          this.auth.logout();
        }
      },
      error: (err) => {
        console.error('Login failed', err);
        const backendMessage = err?.error?.message || err?.error || null;
        if (backendMessage) {
          this.errorMessage = String(backendMessage);
        } else if (err?.status) {
          this.errorMessage = `Erreur ${err.status} - ${err.statusText || 'Connexion refusée'}`;
        } else {
          this.errorMessage = 'Échec de la connexion';
        }
      }
    });
  }

  /**
   * Convertit les rôles du Backend en rôles du Frontend
   */
  private normalizeRole(role: string): string {
    if (!role) return '';
    const r = role.toUpperCase();

    // Cas DOCTORANT (Le cas qui manquait)
    if (r === 'DOCTORANT' || r === 'ROLE_DOCTORANT' || r === 'CANDIDAT' || r === 'ROLE_CANDIDAT') {
      return this.ROLE_DOCTORANT;
    }

    // Cas ENCADRANT / DIRECTEUR
    if (r === 'ENCADRANT' || r === 'DIRECTEUR_THESE' || r === 'ROLE_ENCADRANT') {
      return this.ROLE_ENCADRANT;
    }

    // Cas ADMIN
    if (r === 'ADMIN' || r === 'PERSONNEL_ADMIN' || r === 'ROLE_ADMIN' || r === 'ROLE_ADMINISTRATIF') {
      return this.ROLE_ADMIN;
    }

    // Fallback
    if (r.startsWith('ROLE_')) return r;
    return `ROLE_${r}`;
  }

  private redirectByRole(role: string): void {
    switch (role) {
      case this.ROLE_ENCADRANT:
        this.router.navigate(['/encadrant/dashboard']);
        break;
      case this.ROLE_ADMIN:
        this.router.navigate(['/admin/dashboard']);
        break;
      case this.ROLE_DOCTORANT:
        this.router.navigate(['/doctorant/dashboard']);
        break;
      default:
        // Si le rôle n'est pas reconnu, on reste sur le login avec un message
        console.warn('Rôle inconnu pour redirection:', role);
        this.errorMessage = `Rôle non géré : ${role}`;
        break;
    }
  }
}