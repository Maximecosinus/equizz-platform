// backend/src/core/admin.controller.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Crée une année académique
export const createAcademicYear = async (req: Request, res: Response) => {
  const { name, startDate, endDate } = req.body;
  try {
    const year = await prisma.academicYear.create({
      data: { name, startDate: new Date(startDate), endDate: new Date(endDate) },
    });
    res.status(201).json(year);
  } catch (error) {
    res.status(500).json({ message: 'Erreur création année académique', error });
  }
};

// Crée un cours
export const createCourse = async (req: Request, res: Response) => {
  const { name, code } = req.body;
  try {
    const course = await prisma.course.create({ data: { name, code } });
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Erreur création cours', error });
  }
};

// Récupère toutes les années académiques
export const getAcademicYears = async (req: Request, res: Response) => {
  try {
    const years = await prisma.academicYear.findMany({ orderBy: { name: 'desc' } });
    res.status(200).json(years);
  } catch (error) {
    res.status(500).json({ message: 'Erreur récupération années', error });
  }
};

// Récupère toutes les classes
export const getClassrooms = async (req: Request, res: Response) => {
  try {
    const classrooms = await prisma.classroom.findMany({ orderBy: { name: 'asc' } });
    res.status(200).json(classrooms);
  } catch (error) {
    res.status(500).json({ message: 'Erreur récupération classes', error });
  }
};