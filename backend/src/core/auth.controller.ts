import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const registerUser = async (req: Request, res: Response) => {
  const { email, password, matricule, fullName } = req.body;

  // 1. Validation simple des données
  if (!email || !password || !matricule) {
    return res.status(400).json({ message: 'Email, mot de passe et matricule sont requis.' });
  }

  try {
    // 2. Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Cet email est déjà utilisé.' });
    }

    // 3. Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // 4. Créer l'utilisateur dans la base de données
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        matricule,
        fullName, // Ce champ peut être nul
      },
    });
    
    // 5. Renvoyer une réponse de succès (sans le mot de passe !)
    res.status(201).json({
      message: 'Utilisateur créé avec succès !',
      user: {
        id: newUser.id,
        email: newUser.email,
        matricule: newUser.matricule,
      },
    });

  } catch (error) {
    res.status(500).json({ message: 'Erreur du serveur lors de la création de l\'utilisateur.', error });
  }
};