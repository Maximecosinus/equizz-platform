import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // On importe CommonModule pour *ngIf
import { Auth } from '../../core/services/auth'; // On importe notre service Auth

// On définit une interface pour typer les données de l'utilisateur
interface UserProfile {
  id: string;
  email: string;
  matricule: string;
  fullName: string | null;
  role: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  private authService = inject(Auth);
  
  // On prépare une variable pour stocker le profil de l'utilisateur
  userProfile: UserProfile | null = null;
  
  // ngOnInit est une méthode de cycle de vie d'Angular.
  // Elle est appelée une seule fois, après que le composant ait été initialisé.
  // C'est l'endroit parfait pour charger des données initiales.
  ngOnInit(): void {
    this.authService.getProfile().subscribe({
      next: (profile) => {
        console.log('Profil reçu :', profile);
        this.userProfile = profile;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération du profil :', err);
        // Si le token est invalide, on pourrait déconnecter l'utilisateur
        // this.authService.logout();
      }
    });
  }
}