import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; // Pour le bouton "Créer"
import { QuizService, Quiz } from '../../../core/services/quiz'; // On importe le service et l'interface

@Component({
  selector: 'app-quiz-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './quiz-list.html',
  styleUrl: './quiz-list.scss'
})
export class QuizList implements OnInit {
  private quizService = inject(QuizService);
  
  public quizzes: Quiz[] = []; // Variable pour stocker la liste
  public isLoading = true; // Variable pour gérer l'état de chargement

  ngOnInit(): void {
    this.loadQuizzes();
  }

  loadQuizzes(): void {
    this.isLoading = true;
    this.quizService.getQuizzes().subscribe({
      next: (data) => {
        this.quizzes = data;
        this.isLoading = false;
        console.log('Quiz chargés :', data);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des quiz :', err);
        this.isLoading = false;
      }
    });
  }

  onDeleteQuiz(quizId: string, quizTitle: string): void {
  // On utilise la fonction `confirm` native du navigateur.
  // C'est simple et efficace pour commencer. On pourra la remplacer
  // par une belle modale plus tard si on le souhaite.
  const confirmation = confirm(`Êtes-vous sûr de vouloir supprimer le quiz "${quizTitle}" ?\nCette action est irréversible.`);

  // Si l'utilisateur clique sur "OK" (true)
  if (confirmation) {
    this.quizService.deleteQuiz(quizId).subscribe({
      next: () => {
        console.log('Quiz supprimé avec succès !');
        // On rafraîchit la liste en retirant le quiz supprimé
        // C'est plus efficace que de tout recharger depuis le serveur.
        this.quizzes = this.quizzes.filter(quiz => quiz.id !== quizId);
        alert(`Le quiz "${quizTitle}" a été supprimé.`);
      },
      error: (err) => {
        console.error('Erreur lors de la suppression du quiz :', err);
        alert('Une erreur est survenue lors de la suppression.');
      }
    });
  }
}
}