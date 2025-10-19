import { Router } from 'express';
import { getMyProfile } from '../core/user.controller';
import { isAuthenticated, AuthRequest } from '../middlewares/auth.middleware';

const router = Router();

// On place notre garde du corps "isAuthenticated" juste avant le contrôleur.
// La requête passera d'abord par isAuthenticated. Si le token est bon,
// isAuthenticated appellera next() et la requête continuera jusqu'à getMyProfile.
// Si le token est mauvais, isAuthenticated enverra une erreur et getMyProfile ne sera JAMAIS appelé.
router.get('/me', isAuthenticated, getMyProfile);

export default router;