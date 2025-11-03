import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// On pourrait créer une interface/modèle plus tard pour typer le Quiz
export interface Quiz {
  id: string;
  title: string;
  status: 'DRAFT' | 'PUBLISHED' | 'CLOSED';
  type: 'MID_SEMESTER' | 'END_SEMESTER';
  academicYear: { name: string; };
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

  // dans quiz.service.ts
  createQuiz(quizData: any): Observable<any> {
    return this.http.post(this.apiUrl, quizData);
  }

  getQuiz(id: string): Observable<Quiz> { // On peut réutiliser l'interface Quiz
    return this.http.get<Quiz>(`${this.apiUrl}/${id}`);
  }

  updateQuiz(id: string, quizData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, quizData);
  }

}