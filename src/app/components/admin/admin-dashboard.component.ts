import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InscriptionService } from '../../services/inscription.service';
import { CampagneService } from '../../services/campagne.service';
import { SoutenanceService } from '../../services/soutenance.service';
import { Inscription, InscriptionStatus, Campagne, DemandeSoutenance } from '../../models/app.models';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  title = 'Tableau de bord - Administratif';
  inscriptions: Inscription[] = [];
  inscriptionsToValidate: Inscription[] = [];
  campagnes: Campagne[] = [];
  demandesSoutenance: DemandeSoutenance[] = [];
  loading = true;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  activeTab: 'inscriptions' | 'soutenances' | 'campagnes' = 'inscriptions';

  campagneForm: FormGroup;
  planifForm: FormGroup;

  constructor(
    private inscriptionService: InscriptionService,
    private campagneService: CampagneService,
    private soutenanceService: SoutenanceService,
    private fb: FormBuilder
  ) {
    this.campagneForm = this.fb.group({
      nom: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required]
    });
    this.planifForm = this.fb.group({
      date: ['', Validators.required],
      lieu: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.reloadAll();
  }

  setTab(tab: 'inscriptions' | 'soutenances' | 'campagnes') {
    this.activeTab = tab;
  }

  reloadAll() {
    this.loading = true;
    this.inscriptionService.getAll().subscribe({
      next: (data) => {
        this.inscriptions = data.data || [];
        this.inscriptionsToValidate = this.inscriptions.filter(i => i.status === InscriptionStatus.EN_ATTENTE_ADMIN);
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Erreur chargement inscriptions.';
        this.loading = false;
      }
    });
    this.campagneService.getAll().subscribe({
      next: (data) => {
        this.campagnes = data || [];
      },
      error: () => {
        this.errorMessage = 'Erreur chargement campagnes.';
      }
    });
    // TODO: charger demandes soutenance via service si dispo
  }

  validerDossier(id: string, approuve: boolean) {
    this.loading = true;
    this.inscriptionService.validateByAdmin(id, { approuve }).subscribe({
      next: () => {
        this.successMessage = 'Validation enregistrée.';
        this.reloadAll();
      },
      error: () => {
        this.errorMessage = 'Erreur validation.';
        this.loading = false;
      }
    });
  }

  creerCampagne() {
    if (this.campagneForm.invalid) return;
    this.campagneService.create(this.campagneForm.value).subscribe({
      next: () => {
        this.successMessage = 'Campagne créée.';
        this.reloadAll();
      },
      error: () => {
        this.errorMessage = 'Erreur création.';
      }
    });
  }

  toggleCampagne(id: string, status: boolean) {
    const action = status ? this.campagneService.close(id) : this.campagneService.open(id);
    action.subscribe({
      next: () => {
        this.successMessage = status ? 'Campagne fermée.' : 'Campagne ouverte.';
        this.reloadAll();
      },
      error: () => {
        this.errorMessage = 'Erreur action campagne.';
      }
    });
  }

  planifierSoutenance(id: string) {
    if (this.planifForm.invalid) return;
    this.soutenanceService.planifier(id, this.planifForm.value).subscribe({
      next: () => {
        this.successMessage = 'Soutenance planifiée.';
        this.reloadAll();
      },
      error: () => {
        this.errorMessage = 'Erreur planification.';
      }
    });
  }
}
