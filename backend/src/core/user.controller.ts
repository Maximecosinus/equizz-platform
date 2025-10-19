import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Contrôleur pour récupérer le profil de l'utilisateur actuellement connecté.
 */
export const getMyProfile = async (req: AuthRequest, res: Response) => {
  // Grâce au middleware, nous sommes sûrs que req.user existe et contient les infos du token.
  const userId = req.user?.userId;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      // On sélectionne les champs à renvoyer pour ne pas exposer le mot de passe
      select: {
        id: true,
        email: true,
        matricule: true,
        fullName: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur du serveur.', error });
  }
};