import { Router } from 'express';
import { createQuiz, getAllQuizzes } from '../core/quiz.controller';
import { isAuthenticated } from '../middlewares/auth.middleware';
const router = Router();

// On protège toutes les routes de ce fichier avec notre garde.
// Chaque requête passera d'abord par isAuthenticated.
router.use(isAuthenticated); 

// Définition de la route GET /api/quizzes/
router.get('/', getAllQuizzes);
router.post('/', createQuiz);
export default router;