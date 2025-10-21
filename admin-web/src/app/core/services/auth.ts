import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs'; // On importe 'tap' pour les effets de bord

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private apiUrl = 'http://localhost:3000/api/auth';
  private readonly TOKEN_KEY = 'equizz_admin_token'; // Clé pour le localStorage

  constructor(private http: HttpClient) { }

  login(credentials: { email: string, password: string }): Observable<any> {
    const loginUrl = `${this.apiUrl}/login`;
    
    return this.http.post(loginUrl, credentials).pipe(
      // On utilise l'opérateur 'tap' de RxJS.
      // 'tap' nous permet d'exécuter une action avec la réponse (l'effet de bord)
      // sans modifier la réponse elle-même.
      tap((response: any) => {
        if (response && response.token) {
          this.setToken(response.token);
        }
      })
    );
  }
  
  // --- NOUVELLES MÉTHODES ---

  /**
   * Stocke le token dans le localStorage.
   * @param token Le JWT à stocker.
   */
  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Récupère le token depuis le localStorage.
   * @returns Le token ou null s'il n'existe pas.
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Vérifie si l'utilisateur est authentifié (s'il y a un token).
   * (On pourra améliorer ça plus tard en vérifiant l'expiration du token).
   * @returns true si un token est présent, sinon false.
   */
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  /**
   * Déconnecte l'utilisateur en supprimant le token.
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    // On pourra aussi rediriger l'utilisateur ici.
  }
}