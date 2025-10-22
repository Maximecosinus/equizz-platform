import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject ,tap } from 'rxjs'; 
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private apiUrl = 'http://localhost:3000/api/auth';
  private readonly TOKEN_KEY = 'equizz_admin_token'; // Clé pour le localStorage

  //ÉTAPE 1: Créer le BehaviorSubject
  private isAuthenticated$ = new BehaviorSubject<boolean>(this.hasToken());

  private router = inject(Router);


  constructor(private http: HttpClient) { }

  isLoggedIn(): Observable<boolean> {
    return this.isAuthenticated$.asObservable();
  }

  login(credentials: { email: string, password: string }): Observable<any> {
    const loginUrl = `${this.apiUrl}/login`;
    
    return this.http.post(loginUrl, credentials).pipe(
      // On utilise l'opérateur 'tap' de RxJS.
      // 'tap' nous permet d'exécuter une action avec la réponse (l'effet de bord)
      // sans modifier la réponse elle-même.
      tap((response: any) => {
        if (response && response.token) {
          this.setToken(response.token);
          this.isAuthenticated$.next(true);
        }
      })
    );
  }

  /**
 * Récupère les informations du profil de l'utilisateur connecté.
 * Grâce à l'intercepteur, le token sera ajouté automatiquement à cette requête.
 */
  getProfile(): Observable<any> {
    const profileUrl = 'http://localhost:3000/api/users/me';
    return this.http.get(profileUrl);
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

  hasToken(): boolean {
    return this.getToken() !== null;
  }

  /**
   * Déconnecte l'utilisateur en supprimant le token.
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.isAuthenticated$.next(false); // ÉTAPE 3: On notifie tout le monde de la déconnexion
    this.router.navigate(['/login']); // On redirige vers la page de connexion
  }
}