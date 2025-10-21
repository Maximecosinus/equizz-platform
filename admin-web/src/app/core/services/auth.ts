import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'; // On importe Observable pour gérer les réponses asynchrones

@Injectable({
  providedIn: 'root'
})
export class Auth {
  // On définit l'URL de base de notre API backend.
  private apiUrl = 'http://localhost:3000/api/auth';

  // Le constructeur "injecte" le HttpClient.
  // Angular va automatiquement nous fournir l'instance configurée à l'étape 31.
  constructor(private http: HttpClient) { }

  login(credentials: { email: string, password: string }): Observable<any> {
    // On construit l'URL complète pour l'endpoint de connexion.
    const loginUrl = `${this.apiUrl}/login`;
    
    return this.http.post(loginUrl, credentials);
  }

}