import { Router } from 'express';
import { createQuiz, getAllQuizzes, getQuizById, updateQuiz, deleteQuiz } from '../core/quiz.controller';
import { isAuthenticated } from '../middlewares/auth.middleware';
const router = Router();

// On protège toutes les routes de ce fichier avec notre garde.
// Chaque requête passera d'abord par isAuthenticated.
router.use(isAuthenticated); 

// Définition de la route GET /api/quizzes/
router.get('/', getAllQuizzes);
router.post('/', createQuiz);
router.get('/:id', getQuizById);
router.put('/:id', updateQuiz);
router.delete('/:id', deleteQuiz);
export default router;