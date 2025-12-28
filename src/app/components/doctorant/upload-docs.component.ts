import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InscriptionService } from '../../services/inscription.service';
import { HttpEventType } from '@angular/common/http';

export enum DocumentType {
  DEMANDE_MANUSCRITE = 'DEMANDE_MANUSCRITE',
  RAPPORT_THESE = 'RAPPORT_THESE',
  // Ajoutez d'autres types selon le backend
}



@Component({
  selector: 'app-upload-docs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upload-docs.component.html',
  styleUrls: ['./upload-docs.component.css']
})
export class UploadDocsComponent {
  @Input() inscriptionId!: string;

  title = 'Téléversement de pièces justificatives';
  selectedFile: File | null = null;
  uploadProgress: number = 0;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  documentTypes = Object.values(DocumentType);
  selectedType: DocumentType | null = null;

  constructor(private inscriptionService: InscriptionService) {}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.selectedFile = file;
      this.errorMessage = null;
    } else {
      this.selectedFile = null;
      this.errorMessage = 'Veuillez sélectionner un fichier PDF.';
    }
  }

  upload(): void {
    if (!this.selectedFile || !this.selectedType) {
      this.errorMessage = 'Veuillez choisir un type de document et un fichier PDF.';
      return;
    }
    this.uploadProgress = 0;
    this.successMessage = null;
    this.errorMessage = null;

    const fileToSend = new File([this.selectedFile], this.selectedType + '.pdf', { type: 'application/pdf' });

    this.inscriptionService.uploadDocument(this.inscriptionId, fileToSend).subscribe({
      next: (event: any) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round((event.loaded / event.total) * 100);
        } else if (event.type === HttpEventType.Response) {
          this.successMessage = 'Document envoyé avec succès !';
          this.uploadProgress = 100;
        }
      },
      error: () => {
        this.errorMessage = 'Erreur lors de l\'upload du document.';
        this.uploadProgress = 0;
      }
    });
  }
}
