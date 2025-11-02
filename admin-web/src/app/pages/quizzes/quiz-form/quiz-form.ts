import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
// On importe les outils pour les formulaires réactifs
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AdminService, AcademicYear, Classroom } from '../../../core/services/admin';
import { Observable, switchMap, of } from 'rxjs';
import { QuizService } from '../../../core/services/quiz';

@Component({
  selector: 'app-quiz-form',
  standalone: true,
  // On ajoute ReactiveFormsModule et RouterLink à la boîte à outils
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './quiz-form.html',
  styleUrl: './quiz-form.scss'
})
export class QuizForm implements OnInit {
  // On injecte le FormBuilder, un outil pratique pour créer des formulaires complexes
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private adminService = inject(AdminService);
  private route = inject(ActivatedRoute);
  private quizService = inject(QuizService);

  editMode = false;
  currentQuizId: string | null = null;
  pageTitle = 'Créer un Modèle d\'Évaluation';
  //Observables pour stocker les données des listes déroulantes
  academicYears$!: Observable<AcademicYear[]>;
  classrooms$!: Observable<Classroom[]>;
  quizForm!: FormGroup;

  ngOnInit(): void {
  this.initForm(); // On déplace l'initialisation dans une méthode séparée

  // On écoute les changements dans les paramètres de l'URL
  this.route.paramMap.pipe(
    switchMap(params => {
      this.currentQuizId = params.get('id');
      if (this.currentQuizId) {
        // --- MODE ÉDITION ---
        this.editMode = true;
        this.pageTitle = 'Modifier le Modèle d\'Évaluation';
        // On retourne l'observable qui charge les données du quiz
        return this.quizService.getQuiz(this.currentQuizId);
      } else {
        // --- MODE CRÉATION ---
        this.editMode = false;
        this.pageTitle = 'Créer un Modèle d\'Évaluation';
        // On retourne un observable vide pour continuer la chaîne
        return of(null); 
      }
    })
  ).subscribe(quizData => {
    if (quizData) {
      // Si on a reçu des données (mode édition), on remplit le formulaire
      this.patchForm(quizData);
    }
  });
  
  this.academicYears$ = this.adminService.getAcademicYears();
  this.classrooms$ = this.adminService.getClassrooms();
}

// Méthode pour initialiser le formulaire
initForm(): void {
  this.quizForm = this.fb.group({
    title: ['', Validators.required],
    academicYearId: [null, Validators.required],
    semester: [null, Validators.required],
    type: [null, Validators.required],
    classroomIds: [[], Validators.required],
    questions: this.fb.array([])
  });
}

// Méthode pour pré-remplir le formulaire
patchForm(quiz: any): void {
  this.quizForm.patchValue({
    title: quiz.title,
    academicYearId: quiz.academicYearId,
    semester: quiz.semester,
    type: quiz.type,
    // On extrait juste les IDs des classes
    classroomIds: quiz.classrooms.map((c: any) => c.classroomId)
  });
  
  // On vide les questions existantes et on remplit avec celles du quiz
  this.questions.clear();
  quiz.questions.forEach((q: any) => {
    this.questions.push(this.fb.group({
      content: [q.content, Validators.required],
      type: [q.type, Validators.required]
    }));
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
  if (!this.quizForm.valid) return;

  const formValue = this.quizForm.value;

  if (this.editMode && this.currentQuizId) {
    // --- Logique de MISE À JOUR ---
    this.quizService.updateQuiz(this.currentQuizId, formValue).subscribe({
      next: () => {
        alert('Quiz mis à jour avec succès !');
        this.router.navigate(['/quizzes']);
      },
      error: (err) => console.error('Erreur mise à jour quiz', err)
    });
  } else {
    // --- Logique de CRÉATION (inchangée) ---
    this.quizService.createQuiz(formValue).subscribe({
      next: () => {
        alert('Quiz créé avec succès !');
        this.router.navigate(['/quizzes']);
      },
      error: (err) => console.error('Erreur création quiz', err)
    });
  }
}
}