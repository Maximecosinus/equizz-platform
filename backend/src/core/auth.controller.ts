import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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

//fonction login pour la connexion de l'utilisateur
export const loginUser = async (req: Request, res: Response) => {
  //récupérer les données entrée par l'utilisateur
  const { email, password } = req.body;
  if(!email || !password) {
    return res.status(400).json({ message: 'Email et mot de passe sont requis.'});
  }

  try {
    //chercher le client dans la BD
    const user = await prisma.user.findUnique({ where: { email }});

    // si le client n'existe pas, on renvoie une erreur
    if(!user){
      return res.status(401).json({message: 'Identifiants invalides.'});
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if(!isPasswordCorrect){
      return res.status(401).json({message: 'Identifiants invalides.'});
    }

    //le client est authentifié et on crée son laissez-passer JWT
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET as string,

      { expiresIn: '24h'}
    );

    //On envoie le plat final au client: un message de succès et son laissez-passer.
    res.status(200).json({
      message: 'Connexion réussie !',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error){
    res.status(500).json({message: 'Erreur du serveur lors de ;a connexion.', error})
  }
};