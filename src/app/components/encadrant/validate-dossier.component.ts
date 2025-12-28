import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InscriptionService } from '../../services/inscription.service';
import { AuthService } from '../../services/auth.service';
import { Inscription, User } from '../../models/app.models';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-validate-dossier',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './validate-dossier.component.html',
  styleUrls: ['./validate-dossier.component.css']
})
export class ValidateDossierComponent implements OnInit {
  inscriptions: Inscription[] = [];
  user: User | null = null;
  loading = false;
  error: string | null = null;
  selectedInscription: Inscription | null = null;
  showRejectForm = false;
  rejectForm: FormGroup;
  title = 'Validation du dossier';

  constructor(
    private inscriptionService: InscriptionService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.rejectForm = this.fb.group({
      commentaire: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.user = this.authService.user$;
    if (this.user?.id) {
      this.loadInscriptions();
    }
  }

  loadInscriptions(): void {
    this.loading = true;
    this.inscriptionService.getAll().subscribe({
      next: (data) => {
        const list = data.data || [];
        this.inscriptions = list.filter((i: any) =>
          i.directeurId === this.user?.id &&
          (i.status === 'SOUMISE' || i.status === 'EN_ATTENTE_DIRECTEUR')
        );
        this.loading = false;
      },
      error: () => {
        this.error = 'Erreur lors du chargement des dossiers';
        this.loading = false;
      }
    });
  }

  validateInscription(inscription: Inscription): void {
    this.inscriptionService.validateByDirecteur(inscription.id, { approuve: true, commentaire: '' }).subscribe({
      next: () => {
        this.loadInscriptions();
        this.selectedInscription = null;
        this.showRejectForm = false;
      },
      error: () => {
        this.error = 'Erreur lors de la validation';
      }
    });
  }

  showReject(inscription: Inscription): void {
    this.selectedInscription = inscription;
    this.showRejectForm = true;
    this.rejectForm.reset();
  }

  rejectInscription(): void {
    if (!this.selectedInscription || this.rejectForm.invalid) return;
    const commentaire = this.rejectForm.value.commentaire;
    this.inscriptionService.validateByDirecteur(this.selectedInscription.id, { approuve: false, commentaire }).subscribe({
      next: () => {
        this.loadInscriptions();
        this.selectedInscription = null;
        this.showRejectForm = false;
      },
      error: () => {
        this.error = 'Erreur lors du rejet';
      }
    });
  }
}
