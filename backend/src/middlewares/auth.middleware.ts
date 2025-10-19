import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// On étend l'interface Request d'Express pour y ajouter notre propre propriété `user`
// Cela permet à TypeScript de savoir que req.user existera après ce middleware.
export interface AuthRequest extends Request {
  user?: { userId: string; email: string; role: string };
}

/**
 * Middleware pour vérifier l'authentification via JWT.
 * C'est notre "garde du corps".
 */
export const isAuthenticated = (req: AuthRequest, res: Response, next: NextFunction) => {
  // Étape 1 : Récupérer le token depuis les en-têtes (headers) de la requête.
  // La convention est d'envoyer le token dans l'en-tête "Authorization"
  // sous la forme "Bearer <token>".
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // On extrait juste le token

  // Étape 2 : Vérifier si le token existe.
  // Si le client n'a même pas présenté de laissez-passer...
  if (!token) {
    // ... on arrête la chaîne et on le refuse. 401 = Non autorisé.
    return res.status(401).json({ message: 'Accès refusé. Token manquant.' });
  }

  // Étape 3 : Vérifier la validité du token.
  // On utilise jwt.verify qui va décoder le token en utilisant notre clé secrète.
  jwt.verify(token, process.env.JWT_SECRET as string, (err, decodedPayload) => {
    // Si la vérification échoue (token expiré, signature invalide)...
    if (err) {
      // ... on arrête la chaîne et on le refuse. 403 = Interdit (le token est invalide).
      return res.status(403).json({ message: 'Token invalide ou expiré.' });
    }

    // Étape 4 : Le token est valide ! Le laissez-passer est bon.
    // On attache les informations de l'utilisateur (le "payload" du token)
    // à l'objet `req` pour que les prochains "ouvriers" (les contrôleurs) puissent l'utiliser.
    req.user = decodedPayload as { userId: string; email: string; role: string };

    // Étape 5 : Tout est en ordre. On passe au suivant sur la chaîne de montage.
    next();
  });
};