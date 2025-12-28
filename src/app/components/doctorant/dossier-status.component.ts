
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Inscription } from '../../models/app.models';

export interface DossierStatus {
  id: string;
  doctorantId: string;
  status: string;
  anneeAcademique: string;
  sujetThese: string;
  laboratoire: string;
}


@Component({
  selector: 'app-dossier-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dossier-status.component.html',
  styleUrls: ['./dossier-status.component.css']
})
export class DossierStatusComponent {
  title = "Suivi de l'état du dossier";
  dossier: DossierStatus | null = null;
}
