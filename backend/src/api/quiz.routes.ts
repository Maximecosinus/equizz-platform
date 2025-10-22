import { Router } from 'express';
import { getAllQuizzes } from '../core/quiz.controller';
import { isAuthenticated } from '../middlewares/auth.middleware';

const router = Router();

// On protège toutes les routes de ce fichier avec notre garde.
// Chaque requête passera d'abord par isAuthenticated.
router.use(isAuthenticated); 

// Définition de la route GET /api/quizzes/
router.get('/', getAllQuizzes);

// On ajoutera ici les routes POST /, GET /:id, PUT /:id, DELETE /:id...

export default router;