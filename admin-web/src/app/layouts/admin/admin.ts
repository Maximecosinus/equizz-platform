import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AsyncPipe, CommonModule } from '@angular/common'; // On importe AsyncPipe et CommonModule
import { Observable } from 'rxjs';
import { Auth } from '../../core/services/auth'; // On importe notre service

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe, CommonModule], // On ajoute AsyncPipe et CommonModule
  templateUrl: './admin.html',
  styleUrl: './admin.scss'
})
export class Admin {
  // On injecte le service d'authentification
  private authService = inject(Auth);

  // On crée une propriété qui est un Observable de l'état de connexion.
  // Le template pourra s'y abonner.
  isLoggedIn$: Observable<boolean>;

  constructor() {
    this.isLoggedIn$ = this.authService.isLoggedIn();
  }

  // Méthode pour appeler la déconnexion depuis le template
  logout(): void {
    this.authService.logout();
  }
}