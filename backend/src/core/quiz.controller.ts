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

// On ajoutera ici les fonctions createQuiz, getQuizById, updateQuiz, deleteQuiz...