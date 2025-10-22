import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// On pourrait créer une interface/modèle plus tard pour typer le Quiz
export interface Quiz {
  id: string;
  title: string;
  status: 'DRAFT' | 'PUBLISHED' | 'CLOSED';
  type: 'MID_SEMESTER' | 'END_SEMESTER';
  course: {
    name: string;
  };
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class QuizService { // Renommez la classe si votre CLI l'a nommée Quiz
  private apiUrl = 'http://localhost:3000/api/quizzes';

  constructor(private http: HttpClient) { }

  /**
   * Récupère la liste de tous les quiz depuis le backend.
   * Grâce à l'intercepteur, le token sera automatiquement ajouté.
   */
  getQuizzes(): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(this.apiUrl);
  }
}