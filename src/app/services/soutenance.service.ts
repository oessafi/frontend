import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import {
  DemandeSoutenance,
  DocumentType,
  PropositionJuryRequest,
  PlanificationRequest,
  DemandeSoutenanceRequest,
  ValidationAdminRequest
} from '../models/app.models';

@Injectable({ providedIn: 'root' })
export class SoutenanceService {
  private readonly API_URL = 'http://localhost:8080/api/v1';
  constructor(private http: HttpClient) {}

  initier(request: DemandeSoutenanceRequest): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/soutenances`, request);
  }

  proposerJury(id: string, request: PropositionJuryRequest): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/soutenances/${id}/jury`, request);
  }

  validerAdmin(id: string, request: ValidationAdminRequest): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/soutenances/${id}/valider`, request);
  }

  planifier(id: string, request: PlanificationRequest): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/soutenances/${id}/planifier`, request);
  }

  uploadDocument(id: string, type: DocumentType, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    return this.http.post<any>(`${this.API_URL}/soutenances/${id}/documents`, formData);
  }
}
