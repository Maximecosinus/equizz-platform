import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
// On importe les outils pour les formulaires réactifs
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService, AcademicYear, Classroom } from '../../../core/services/admin';
import { Observable } from 'rxjs';
import { QuizService } from '../../../core/services/quiz';

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
  private adminService = inject(AdminService);

  //Observables pour stocker les données des listes déroulantes
  academicYears$!: Observable<AcademicYear[]>;
  classrooms$!: Observable<Classroom[]>;
  quizForm!: FormGroup;

  ngOnInit(): void {

    // On charge les données pour les selects au démarrage du composant
    this.academicYears$ = this.adminService.getAcademicYears();
    this.classrooms$ = this.adminService.getClassrooms();
    // On initialise le formulaire principal
    this.quizForm = this.fb.group({
      title: ['', Validators.required], // Titre de l'évaluation, ex: "Évaluation S2 24/25"
      academicYearId: [null, Validators.required],
      semester: [null, Validators.required],
      type: [null, Validators.required],
      classroomIds: [[], Validators.required], // Pour une sélection multiple
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

  private quizService= inject(QuizService);
  /**
   * Méthode appelée à la soumission du formulaire principal.
   */
  onSubmit(): void {
  if (this.quizForm.valid) {
    console.log('Données envoyées:', this.quizForm.value);
    this.quizService.createQuiz(this.quizForm.value).subscribe({
      next: () => {
        alert('Quiz créé avec succès !');
        this.router.navigate(['/quizzes']);
      },
      error: (err) => {
        console.error('Erreur lors de la création du quiz', err);
        alert('Une erreur est survenue.');
      }
    });
  } else {
      console.error('Le formulaire est invalide.');
    }
  }
}