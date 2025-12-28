import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import {
  Inscription,
  InscriptionListResponse,
  InscriptionResponse,
  CreateInscriptionRequest,
  ValidateInscriptionRequest
} from '../models/app.models';

@Injectable({ providedIn: 'root' })
export class InscriptionService {
  public readonly API_URL = 'http://localhost:8080/api/v1';
  constructor(private http: HttpClient) {}

  create(request: CreateInscriptionRequest): Observable<InscriptionResponse> {
    return this.http.post<InscriptionResponse>(`${this.API_URL}/inscriptions`, request);
  }

  getAll(): Observable<InscriptionListResponse> {
    return this.http.get<InscriptionListResponse>(`${this.API_URL}/inscriptions`);
  }

  getByDoctorant(id: string): Observable<InscriptionListResponse> {
    return this.http.get<InscriptionListResponse>(`${this.API_URL}/inscriptions/doctorant/${id}`);
  }

  validateByDirecteur(id: string, req: ValidateInscriptionRequest): Observable<InscriptionResponse> {
    return this.http.put<InscriptionResponse>(`${this.API_URL}/inscriptions/${id}/validate/directeur`, req);
  }

  validateByAdmin(id: string, req: ValidateInscriptionRequest): Observable<InscriptionResponse> {
    return this.http.put<InscriptionResponse>(`${this.API_URL}/inscriptions/${id}/validate/admin`, req);
  }

  uploadDocument(id: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(`${this.API_URL}/inscriptions/${id}/documents`, formData);
  }
}
