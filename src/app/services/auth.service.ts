import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
// CORRECTION ICI : Import nommé requis pour la v4+ de jwt-decode
import { jwtDecode } from 'jwt-decode';
import { AuthResponse, User } from '../models/app.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080';
  private tokenKey = 'token';
  private userKey = 'user';

  /**
   * Getter pour l'utilisateur courant (compatible avec le composant)
   */
  get user$(): User | null {
    return this.getCurrentUserFromStorage();
  }

  constructor(private http: HttpClient, private router: Router) {}

  getCurrentUser(): User | null {
    // Correction : appel direct à la méthode interne
    return this.getCurrentUserFromStorage();
  }

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/users/login`, credentials).pipe(
      tap((response: AuthResponse) => {
        if (response && response.token && response.user) {
          localStorage.setItem(this.tokenKey, response.token);
          localStorage.setItem(this.userKey, JSON.stringify(response.user));
        }
      })
    );
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/register`, data);
  }

  /**
   * Récupère l'utilisateur depuis le localStorage
   */
  getCurrentUserFromStorage(): User | null {
    const userString = localStorage.getItem(this.userKey);
    if (!userString) return null;
    try {
      return JSON.parse(userString) as User;
    } catch (e) {
      console.error('Erreur parsing utilisateur localStorage', e);
      return null;
    }
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey); 
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    // TODO: vérifiez aussi l'expiration du token ici
    return !!token;
  }

  getRole(): string | null {
    const user = this.getCurrentUserFromStorage();
    if (user && user.role) {
      return user.role;
    }
    
    const token = this.getToken();
    if (!token) return null;

    try {
      // CORRECTION ICI : Utilisation correcte de la fonction jwtDecode sans casting 'any'
      const decoded: any = jwtDecode(token);
      const role = decoded.role; 

      return typeof role === 'string' ? role : null;
    } catch (e) {
      console.error('Erreur décodage token', e);
      return null;
    }
  }
}