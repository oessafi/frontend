import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InscriptionService } from '../../services/inscription.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/app.models';

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css']
})
export class InscriptionComponent implements OnInit {
  inscriptionForm: FormGroup;
  errorMessage: string | null = null;
  user: User | null = null;
  loading = false;
  title = "Formulaire d'inscription / réinscription";

  constructor(
    private fb: FormBuilder,
    private inscriptionService: InscriptionService,
    private authService: AuthService,
    private router: Router
  ) {
    this.inscriptionForm = this.fb.group({
      sujetThese: ['', Validators.required],
      laboratoire: ['', Validators.required],
      specialite: [''],
      anneeAcademique: [''],
      directeurId: ['']
    });
  }

  ngOnInit(): void {
    this.user = this.authService.user$;
  }

  onSubmit(): void {
    if (this.inscriptionForm.invalid || !this.user) {
      return;
    }
    this.loading = true;
    const formData = {
      ...this.inscriptionForm.value,
      doctorantId: this.user.id
    };
    this.inscriptionService.create(formData).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/doctorant/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message || "Erreur lors de la création de l'inscription";
      }
    });
  }
}
