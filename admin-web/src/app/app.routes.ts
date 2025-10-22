import { Routes } from '@angular/router';

// On importe les composants que nous venons de créer
import { Login } from './pages/login/login';
import { Admin } from './layouts/admin/admin';
import { Dashboard } from './pages/dashboard/dashboard';
import { authGuard } from './core/guards/auth-guard';
import { QuizList } from './pages/quizzes/quiz-list/quiz-list';
import { QuizForm } from './pages/quizzes/quiz-form/quiz-form';


export const routes: Routes = [
  // --- Routes Publiques (accessibles sans connexion) ---
  {
    path: 'login', // Si l'URL est /login...
    component: Login, // ...afficher le composant de connexion.
  },

  // --- Routes Privées (qui nécessiteront une connexion plus tard) ---
  {
    path: '', // Pour toutes les autres routes à la racine
    component: Admin,
    canActivate: [authGuard], // On charge d'abord la "coquille" de l'admin
    children: [
      // Ensuite, on définit les "enfants" qui s'afficheront à l'intérieur de la coquille
      {
        path: 'dashboard', // Si l'URL est /dashboard...
        component: Dashboard, // ...afficher le tableau de bord.
      },
      // On pourra ajouter d'autres pages ici plus tard (ex: /users, /quizzes)
      { 
        path: 'quizzes', // URL: /quizzes
        component: QuizList 
      },
      { 
        path: 'quizzes/new', // URL: /quizzes/new
        component: QuizForm 
      },
      { 
        path: 'quizzes/edit/:id', // URL: /quizzes/edit/un-certain-id
        component: QuizForm 
      },
      // Redirection par défaut pour la partie privée
      {
        path: '', // Si l'URL est vide (juste le nom de domaine)
        redirectTo: 'dashboard', // On redirige automatiquement vers /dashboard
        pathMatch: 'full', // Condition stricte pour la redirection
      },
    ],
  },
  
  // --- Redirection pour les URL inconnues ---
  // Si l'utilisateur tape une URL qui n'existe pas, on le redirige vers le login.
  { path: '**', redirectTo: 'login' },
];