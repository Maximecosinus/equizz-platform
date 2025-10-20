import { Component } from '@angular/core';
// ÉTAPE 1: Importer les outils pour les formulaires réactifs
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  // ÉTAPE 2: Ajouter ReactiveFormsModule à la boîte à outils du composant
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  // ÉTAPE 3: Créer une propriété pour notre groupe de formulaire
  // Le '!' dit à TypeScript: "fais-moi confiance, je l'initialiserai plus tard"
  loginForm!: FormGroup;

  // Le constructeur est une méthode spéciale appelée à la création du composant
  constructor() {
    // ÉTAPE 4: Initialiser le formulaire
    this.loginForm = new FormGroup({
      // On définit un contrôle pour chaque champ du formulaire
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  // ÉTAPE 5: Créer la méthode qui sera appelée à la soumission du formulaire
  onSubmit() {
    // Pour l'instant, on affiche juste les valeurs dans la console pour vérifier
    if (this.loginForm.valid) {
      console.log('Formulaire valide !');
      console.log('Valeurs soumises :', this.loginForm.value);
    } else {
      console.error('Le formulaire est invalide.');
    }
  }
}