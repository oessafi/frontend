import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { InscriptionService } from '../../services/inscription.service';
import { SoutenanceService } from '../../services/soutenance.service';
import { User, Inscription, InscriptionStatus, DocumentType } from '../../models/app.models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-doctorant-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './doctorant-dashboard.component.html',
  styleUrls: ['./doctorant-dashboard.component.css']
})
export class DoctorantDashboardComponent implements OnInit {
  title = 'Tableau de bord';
  user: User | null = null;
  inscriptions: Inscription[] = [];
  latestInscription: Inscription | null = null;
  loading = true;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  form: FormGroup;
  directors: User[] = [];
  uploading = false;
  fileError: string | null = null;

  constructor(
    private authService: AuthService,
    private inscriptionService: InscriptionService,
    private soutenanceService: SoutenanceService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      sujetThese: ['', Validators.required],
      directeurId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    if (this.user?.id) {
      this.inscriptionService.getByDoctorant(this.user.id).subscribe({
        next: (data) => {
          this.inscriptions = data.data || [];
          this.latestInscription = this.inscriptions.length > 0
            ? this.inscriptions[this.inscriptions.length - 1]
            : null;
          this.loading = false;
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors du chargement des inscriptions';
          this.loading = false;
        }
      });
      // Récupération des directeurs (mock, à remplacer par UserService si dispo)
      // this.userService.getUsersByRole('DIRECTEUR_THESE').subscribe(...)
      // Pour l'exemple, tableau vide
      this.directors = [];
    } else {
      this.loading = false;
      this.errorMessage = 'Utilisateur non connecté';
    }
  }

  hasActiveInscription(): boolean {
    return !!this.latestInscription && this.latestInscription.status !== InscriptionStatus.REFUSEE;
  }

  onNewInscription(): void {
    // Affiche le formulaire
    this.latestInscription = null;
  }

  submitInscription(): void {
    if (this.form.invalid || !this.user) return;
    this.loading = true;
    const request = {
      doctorantId: this.user.id,
      sujetThese: this.form.value.sujetThese,
      directeurId: this.form.value.directeurId
    };
    this.inscriptionService.create(request).subscribe({
      next: (res) => {
        this.successMessage = 'Inscription créée avec succès.';
        this.latestInscription = res.data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors de la création.';
        this.loading = false;
      }
    });
  }

  canRequestSoutenance(): boolean {
    return this.latestInscription?.status === InscriptionStatus.VALIDE;
  }

  requestSoutenance(): void {
    if (!this.latestInscription || !this.user) return;
    this.loading = true;
    const request = {
      doctorantId: this.user.id,
      inscriptionId: this.latestInscription.id
    };
    // `DemandeSoutenanceRequest` requiert `dateSoutenance` et `lieuSoutenance`.
    const demandeRequest = {
      ...request,
      dateSoutenance: new Date().toISOString(),
      lieuSoutenance: 'À définir'
    };
    this.soutenanceService.initier(demandeRequest).subscribe({
      next: () => {
        this.successMessage = 'Demande de soutenance initiée.';
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Erreur lors de la demande.';
        this.loading = false;
      }
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (!file || file.type !== 'application/pdf') {
      this.fileError = 'Seuls les fichiers PDF sont acceptés.';
      return;
    }
    this.fileError = null;
    this.uploading = true;
    if (this.latestInscription) {
      this.soutenanceService.uploadDocument(this.latestInscription.id, DocumentType.SOUTENANCE, file).subscribe({
        next: () => {
          this.successMessage = 'Document envoyé.';
          this.uploading = false;
        },
        error: () => {
          this.fileError = 'Erreur lors de l’envoi.';
          this.uploading = false;
        }
      });
    }
  }
}
