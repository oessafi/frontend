import { Component, OnInit } from '@angular/core';
import { InscriptionService } from '../../services/inscription.service';
import { Inscription } from '../../models/app.models';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-validate-dossiers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './validate-dossiers.component.html',
  styleUrls: ['./validate-dossiers.component.css']
})
export class ValidateDossiersComponent implements OnInit {
  inscriptions: Inscription[] = [];
  loading = false;
  error: string | null = null;
  showRejectFormId: string | null = null;
  rejectForm: FormGroup;
  title = 'Validation des dossiers';

  constructor(
    private inscriptionService: InscriptionService,
    private fb: FormBuilder
  ) {
    this.rejectForm = this.fb.group({
      commentaireAdmin: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadInscriptions();
  }

  loadInscriptions(): void {
    this.loading = true;
    this.inscriptionService.getAll().subscribe({
      next: (data) => {
        const list = data.data || [];
        this.inscriptions = list.filter((i: any) => i.status === 'EN_ATTENTE_ADMIN');
        this.loading = false;
      },
      error: () => {
        this.error = 'Erreur lors du chargement des inscriptions';
        this.loading = false;
      }
    });
  }

  validateInscription(inscription: Inscription): void {
    this.inscriptionService.validateByAdmin(inscription.id, { approuve: true, commentaire: '' }).subscribe({
      next: () => {
        this.loadInscriptions();
      },
      error: () => {
        this.error = 'Erreur lors de la validation';
      }
    });
  }

  showRejectForm(inscriptionId: string): void {
    this.showRejectFormId = inscriptionId;
    this.rejectForm.reset();
  }

  rejectInscription(inscription: Inscription): void {
    if (this.rejectForm.invalid) return;
    const commentaire = this.rejectForm.value.commentaireAdmin;
    this.inscriptionService.validateByAdmin(inscription.id, { approuve: false, commentaire }).subscribe({
      next: () => {
        this.showRejectFormId = null;
        this.loadInscriptions();
      },
      error: () => {
        this.error = 'Erreur lors du rejet';
      }
    });
  }
}
