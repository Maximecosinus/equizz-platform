import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth'; // Assurez-vous que le chemin est correct

/**
 * Garde de route pour vérifier si un utilisateur est authentifié.
 */
export const authGuard: CanActivateFn = (route, state) => {
  // On "injecte" nos services de manière moderne (sans constructeur)
  const authService = inject(Auth);
  const router = inject(Router);

  // On utilise la méthode de notre service pour vérifier l'authentification
  if (authService.hasToken()) {
    return true; // L'utilisateur est connecté, on autorise l'accès à la route.
  } else {
    // L'utilisateur n'est pas connecté, on le redirige vers la page de connexion.
    router.navigate(['/login']);
    return false; // On bloque l'accès à la route demandée.
  }
};