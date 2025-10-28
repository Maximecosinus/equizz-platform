import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
// On importe les outils pour les formulaires réactifs
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quiz-form',
  standalone: true,
  // On ajoute ReactiveFormsModule à la boîte à outils
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './quiz-form.html',
  styleUrl: './quiz-form.scss'
})
export class QuizForm implements OnInit {
  // On injecte le FormBuilder, un outil pratique pour créer des formulaires complexes
  private fb = inject(FormBuilder);
  private router = inject(Router);

  quizForm!: FormGroup;

  ngOnInit(): void {
    // On initialise le formulaire principal
    this.quizForm = this.fb.group({
      title: ['', Validators.required], // Titre de l'évaluation, ex: "Évaluation S2 24/25"
      // On ajoutera plus tard les listes déroulantes pour l'année et le semestre
      
      // On crée un "FormArray" pour gérer une liste dynamique de questions
      questions: this.fb.array([]) // Commence avec un tableau de questions vide
    });
  }

  /**
   * Getter pratique pour accéder facilement au FormArray des questions depuis le template.
   */
  get questions(): FormArray {
    return this.quizForm.get('questions') as FormArray;
  }

  /**
   * Crée un nouveau FormGroup pour une question.
   * C'est le "plan" de ce à quoi ressemble une question.
   */
  newQuestion(): FormGroup {
    return this.fb.group({
      content: ['', Validators.required], // Le texte de la question
      type: ['MULTIPLE_CHOICE', Validators.required], // Type de question
      // On pourrait ajouter un FormArray pour les choix de réponse ici aussi
    });
  }

  /**
   * Ajoute une nouvelle question (vide) au FormArray des questions.
   */
  addQuestion(): void {
    this.questions.push(this.newQuestion());
  }

  /**
   * Supprime une question du FormArray à un index spécifique.
   */
  removeQuestion(index: number): void {
    this.questions.removeAt(index);
  }

  /**
   * Méthode appelée à la soumission du formulaire principal.
   */
  onSubmit(): void {
    if (this.quizForm.valid) {
      console.log('Formulaire de Quiz soumis :', this.quizForm.value);
      // TODO: Appeler un service pour sauvegarder ces données.
    } else {
      console.error('Le formulaire est invalide.');
    }
  }
}