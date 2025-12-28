import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Campagne,
  CreateCampagneRequest
} from '../models/app.models';

@Injectable({ providedIn: 'root' })
export class CampagneService {
  private readonly API_URL = 'http://localhost:8080/api/v1';
  constructor(private http: HttpClient) {}

  getAll(): Observable<Campagne[]> {
    return this.http.get<Campagne[]>(`${this.API_URL}/campagnes`);
  }

  create(request: CreateCampagneRequest): Observable<Campagne> {
    return this.http.post<Campagne>(`${this.API_URL}/campagnes`, request);
  }

  open(id: string): Observable<Campagne> {
    return this.http.put<Campagne>(`${this.API_URL}/campagnes/${id}/open`, {});
  }

  close(id: string): Observable<Campagne> {
    return this.http.put<Campagne>(`${this.API_URL}/campagnes/${id}/close`, {});
  }
}
