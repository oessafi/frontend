import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { InscriptionService } from '../../services/inscription.service';
import { SoutenanceService } from '../../services/soutenance.service';
import { User, Inscription, InscriptionStatus, PropositionJuryRequest } from '../../models/app.models';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-encadrant-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './encadrant-dashboard.component.html',
  styleUrls: ['./encadrant-dashboard.component.css']
})
export class EncadrantDashboardComponent implements OnInit {
  title = 'Tableau de bord - Encadrant';
  inscriptions: Inscription[] = [];
  inscriptionsToValidate: Inscription[] = [];
  validatedDoctorants: Inscription[] = [];
  user: User | null = null;
  loading = true;
  errorMessage: string | null = null;
  activeTab: 'validation' | 'doctorants' = 'validation';

  // Jury modale
  showJuryModal = false;
  selectedDoctorant: Inscription | null = null;
  juryForm: FormGroup;
  juryError: string | null = null;
  jurySuccess: string | null = null;

  constructor(
    private authService: AuthService,
    private inscriptionService: InscriptionService,
    private soutenanceService: SoutenanceService,
    private fb: FormBuilder
  ) {
    this.juryForm = this.fb.group({
      membres: this.fb.array([
        this.fb.group({ nom: ['', Validators.required], role: ['', Validators.required] })
      ])
    });
  }

  get membresArray(): FormArray {
    return this.juryForm.get('membres') as FormArray;
  }

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    if (!this.user) {
      this.errorMessage = 'Utilisateur non connecté.';
      this.loading = false;
      return;
    }
    this.inscriptionService.getAll().subscribe({
      next: (data) => {
        const all = data.data || [];
        this.inscriptions = all.filter(i => i.directeurId === this.user!.id);
        this.inscriptionsToValidate = this.inscriptions.filter(i => i.status === InscriptionStatus.EN_ATTENTE_DIRECTEUR);
        this.validatedDoctorants = this.inscriptions.filter(i => i.status === InscriptionStatus.VALIDE);
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Erreur lors du chargement.';
        this.loading = false;
      }
    });
  }

  setTab(tab: 'validation' | 'doctorants') {
    this.activeTab = tab;
  }

  validerDossier(inscriptionId: string, approuve: boolean, commentaire?: string) {
    this.loading = true;
    const req = { approuve, commentaire };
    this.inscriptionService.validateByDirecteur(inscriptionId, req).subscribe({
      next: () => {
        this.successReload('Validation enregistrée.');
      },
      error: () => {
        this.errorMessage = 'Erreur lors de la validation.';
        this.loading = false;
      }
    });
  }

  openJuryModal(inscription: Inscription) {
    this.selectedDoctorant = inscription;
    this.showJuryModal = true;
    this.juryForm.reset();
    (this.juryForm.get('membres') as FormArray).clear();
    (this.juryForm.get('membres') as FormArray).push(this.fb.group({ nom: '', role: '' }));
  }

  addJuryMember() {
    (this.juryForm.get('membres') as FormArray).push(this.fb.group({ nom: '', role: '' }));
  }

  removeJuryMember(index: number) {
    (this.juryForm.get('membres') as FormArray).removeAt(index);
  }

  submitJury() {
    if (!this.selectedDoctorant || this.juryForm.invalid) return;
    this.juryError = null;
    this.jurySuccess = null;
    const req: PropositionJuryRequest = {
      doctorantId: this.selectedDoctorant.doctorantId,
      membres: this.juryForm.value.membres
    };
    this.soutenanceService.proposerJury(this.selectedDoctorant.id, req).subscribe({
      next: () => {
        this.jurySuccess = 'Proposition envoyée.';
        this.showJuryModal = false;
        this.successReload('Jury proposé.');
      },
      error: () => {
        this.juryError = 'Erreur lors de l’envoi.';
      }
    });
  }

  successReload(msg: string) {
    this.errorMessage = null;
    this.loading = true;
    this.inscriptionService.getAll().subscribe({
      next: (data) => {
        const all = data.data || [];
        this.inscriptions = all.filter(i => i.directeurId === this.user!.id);
        this.inscriptionsToValidate = this.inscriptions.filter(i => i.status === InscriptionStatus.EN_ATTENTE_DIRECTEUR);
        this.validatedDoctorants = this.inscriptions.filter(i => i.status === InscriptionStatus.VALIDE);
        this.loading = false;
        this.successMessage = msg;
      },
      error: () => {
        this.errorMessage = 'Erreur lors du rechargement.';
        this.loading = false;
      }
    });
  }
  successMessage: string | null = null;
}
