import express, { Request, Response } from 'express'; // On importe les types Request et Response
import dotenv from 'dotenv';
import authRoutes from './api/auth.route';
import userRoutes from './api/user.routes'; 
import cors from 'cors'; // ÉTAPE 1: Importer le middleware


// Charger les variables d'environnement depuis le fichier .env
dotenv.config();

// Initialiser l'application Express
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:4200' // On autorise uniquement cette origine
}));

// Middleware pour permettre à Express de lire le JSON dans les corps de requête
app.use(express.json());

// Notre première route de test
app.get('/', (req, res) => {
  res.send('<h1>Bienvenue sur l\'API EQuizz !</h1><p>Le serveur fonctionne correctement.</p>');
});


app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Le serveur est lancé sur http://localhost:${PORT}`);
});