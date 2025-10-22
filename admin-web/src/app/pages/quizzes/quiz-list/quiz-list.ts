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
}