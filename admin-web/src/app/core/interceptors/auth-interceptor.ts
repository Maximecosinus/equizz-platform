import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from '../services/auth'; // On importe notre service d'authentification

/**
 * Intercepteur pour ajouter le token JWT à chaque requête sortante.
 * C'est notre "agent de douane".
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // On injecte notre service d'authentification pour accéder au token.
  const authService = inject(Auth);
  const token = authService.getToken();

  // Étape 1: Vérifier si un token existe.
  if (token) {
    // Étape 2: Si un token existe, on clone la requête originale.
    // On ne modifie jamais la requête originale directement.
    const clonedRequest = req.clone({
      setHeaders: {
        // Étape 3: On ajoute le header 'Authorization' avec le token.
        // Le format "Bearer <token>" est un standard.
        Authorization: `Bearer ${token}`
      }
    });

    // Étape 4: On laisse le colis modifié (la requête clonée) continuer son chemin.
    return next(clonedRequest);
  }
  
  // Si pas de token, on laisse le colis original continuer son chemin sans modification.
  return next(req);
};