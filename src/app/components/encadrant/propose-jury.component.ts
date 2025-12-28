import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SoutenanceService } from '../../services/soutenance.service';
import { PropositionJuryRequest } from '../../models/app.models';
import { CommonModule } from '@angular/common';

export enum JuryRole {
  PRESIDENT = 'PRESIDENT',
  RAPPORTEUR = 'RAPPORTEUR',
  EXAMINATEUR = 'EXAMINATEUR'
}

export interface JuryMember {
  nom: string;
  email: string;
  etablissement: string;
  role: JuryRole;
}

// use shared `PropositionJuryRequest` from models

@Component({
  selector: 'app-propose-jury',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './propose-jury.component.html',
  styleUrls: ['./propose-jury.component.css']
})
export class ProposeJuryComponent implements OnInit {
  demandeId!: string;
  juryForm: FormGroup;
  juryRoles = Object.values(JuryRole);
  successMessage: string | null = null;
  errorMessage: string | null = null;
  title = 'Proposer un jury';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private soutenanceService: SoutenanceService
  ) {
    this.juryForm = this.fb.group({
      membres: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.demandeId = this.route.snapshot.paramMap.get('id') || '';
    this.addMember();
  }

  get membres(): FormArray {
    return this.juryForm.get('membres') as FormArray;
  }

  addMember(): void {
    this.membres.push(this.fb.group({
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      etablissement: ['', Validators.required],
      role: ['', Validators.required]
    }));
  }

  removeMember(index: number): void {
    this.membres.removeAt(index);
  }

  onSubmit(): void {
    if (this.juryForm.invalid) return;
    const request: PropositionJuryRequest = {
      doctorantId: this.demandeId,
      membres: this.juryForm.value.membres
    };
    this.soutenanceService.proposerJury(this.demandeId, request).subscribe({
      next: () => {
        this.successMessage = 'Proposition envoyée avec succès !';
        this.errorMessage = null;
        this.juryForm.reset();
        while (this.membres.length) this.membres.removeAt(0);
        this.addMember();
      },
      error: () => {
        this.errorMessage = 'Erreur lors de l\'envoi de la proposition.';
        this.successMessage = null;
      }
    });
  }
}
