import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Récupère tous les quiz de la base de données.
 */
export const getAllQuizzes = async (req: Request, res: Response) => {
  try {
    const quizzes = await prisma.quiz.findMany({
      // On inclut les informations du cours associé à chaque quiz
      include: {
        course: true, 
      },
      // On ordonne les quiz du plus récent au plus ancien
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ message: 'Erreur du serveur lors de la récupération des quiz.', error });
  }
};

// ... dans backend/src/core/quiz.controller.ts

export const createQuiz = async (req: Request, res: Response) => {
  // On extrait maintenant les questions du corps de la requête
  const { title, type, semester, academicYearId, classroomIds, questions, courseId } = req.body;

  // Validation de base
  if (!title || !type || !semester || !academicYearId || !classroomIds || !questions || !courseId) {
    return res.status(400).json({ message: "Données manquantes pour créer le quiz." });
  }
  if (!Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ message: "Le quiz doit contenir au moins une question." });
  }

  try {
    // On utilise une transaction Prisma pour assurer l'intégrité des données
    const newQuiz = await prisma.quiz.create({
      data: {
        title,
        type,
        semester,
        academicYearId,
        courseId,
        status: 'DRAFT',
        // --- Logique d'écriture imbriquée ---
        // 1. On crée les questions en même temps que le quiz
        questions: {
          create: questions.map((q: any) => ({
            content: q.content,
            type: q.type || 'MULTIPLE_CHOICE', // Valeur par défaut si non fourni
            order: q.order || 0,
          }))
        },
        // 2. On connecte le quiz aux classes via la table de liaison
        classrooms: {
          create: classroomIds.map((id: string) => ({
            classroomId: id
          }))
        }
      },
      // On inclut les questions créées dans la réponse pour confirmation
      include: {
        questions: true,
        classrooms: true
      }
    });

    res.status(201).json(newQuiz);
  } catch (error) {
    console.error("Erreur lors de la création du quiz:", error);
    res.status(500).json({ message: 'Erreur serveur lors de la création du quiz.', error });
  }
};