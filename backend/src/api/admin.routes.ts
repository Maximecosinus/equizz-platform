// backend/src/api/admin.routes.ts
import { Router } from 'express';
import { isAuthenticated } from '../middlewares/auth.middleware';
import { createAcademicYear, createCourse, getAcademicYears, getClassrooms} from '../core/admin.controller';

const router = Router();
router.use(isAuthenticated); // Protégé !

router.post('/academic-years', createAcademicYear);
router.post('/courses', createCourse);
router.get('/academic-years', getAcademicYears); // <-- AJOUTER
router.get('/classrooms', getClassrooms);      // <-- AJOUTER

export default router;