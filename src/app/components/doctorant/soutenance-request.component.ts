
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SoutenanceService } from '../../services/soutenance.service';

export interface DemandeSoutenancePayload {
  dateSoutenance: string;
  lieuSoutenance: string;
  sujetThese?: string;
}


@Component({
  selector: 'app-soutenance-request',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './soutenance-request.component.html',
  styleUrls: ['./soutenance-request.component.css']
})
export class SoutenanceRequestComponent {
  title = 'Demande de soutenance';
  requestForm: FormGroup;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private soutenanceService: SoutenanceService) {
    this.requestForm = this.fb.group({
      dateSoutenance: ['', Validators.required],
      lieuSoutenance: ['', Validators.required],
      sujetThese: ['']
    });
  }

  onSubmit(doctorantId: string) {
    if (this.requestForm.invalid) {
      this.errorMessage = 'Veuillez remplir tous les champs requis.';
      return;
    }
    const payload: DemandeSoutenancePayload = this.requestForm.value;
    this.soutenanceService.initier({ ...payload, doctorantId }).subscribe({
      next: () => {
        this.errorMessage = null;
        // Ajoutez une logique de succès si besoin
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Erreur lors de la demande.';
      }
    });
  }
}
