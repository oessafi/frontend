import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CampagneService } from '../../services/campagne.service';
import { Campagne } from '../../models/app.models';

@Component({
  selector: 'app-campaigns',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.css']
})
export class CampaignsComponent implements OnInit {
  campagnes: Campagne[] = [];
  loading = false;
  error: string | null = null;
  createForm: FormGroup;
  successMessage: string | null = null;
  title = 'Gestion des campagnes';

  constructor(
    private campagneService: CampagneService,
    private fb: FormBuilder
  ) {
    this.createForm = this.fb.group({
      anneeAcademique: ['', Validators.required],
      type: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCampagnes();
  }

  loadCampagnes(): void {
    this.loading = true;
    this.campagneService.getAll().subscribe({
      next: (data) => {
        this.campagnes = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Erreur lors du chargement des campagnes';
        this.loading = false;
      }
    });
  }

  open(id: string): void {
    this.campagneService.open(id).subscribe({
      next: () => {
        this.successMessage = 'Campagne ouverte avec succès';
        this.loadCampagnes();
      },
      error: () => {
        this.error = 'Erreur lors de l\'ouverture de la campagne';
      }
    });
  }

  close(id: string): void {
    this.campagneService.close(id).subscribe({
      next: () => {
        this.successMessage = 'Campagne fermée avec succès';
        this.loadCampagnes();
      },
      error: () => {
        this.error = 'Erreur lors de la fermeture de la campagne';
      }
    });
  }

  onCreate(): void {
    if (this.createForm.invalid) return;
    this.campagneService.create(this.createForm.value).subscribe({
      next: () => {
        this.successMessage = 'Campagne créée avec succès';
        this.createForm.reset();
        this.loadCampagnes();
      },
      error: () => {
        this.error = 'Erreur lors de la création de la campagne';
      }
    });
  }
}
