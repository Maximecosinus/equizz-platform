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

export const createQuiz = async (req: Request, res: Response) => {
  const {title, type, semester, courseId, academicYearId } = req.body;
  try {
    const quiz = await prisma.quiz.create({
      data: {
        title,
        type,
        semester,
        courseId,
        academicYearId,
        status: 'DRAFT', //Un nouveau quiz est toujours un brouillon
      },
    });
    res.status(201).json(quiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur création quiz', error });
  }
};