import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router'; // On importe le Router pour la redirection
import { Auth } from '../../core/services/auth'; // On importe notre service


@Component({
  selector: 'app-login',
  standalone: true,
  // ÉTAPE 2: Ajouter ReactiveFormsModule à la boîte à outils du composant
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  loginForm!: FormGroup;

  constructor(
    private auth: Auth,
    private router: Router
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  onSubmit() {
    if (!this.loginForm.valid) {
      return; // Si le formulaire n'est pas valide, on ne fait rien
    }

    console.log('Envoi des données au backend :', this.loginForm.value);

    // On appelle la méthode login de notre service
    this.auth.login(this.loginForm.value).subscribe({
      // La méthode .subscribe écoute la réponse de l'Observable
      
      // Cas n°1 : La requête a réussi (le backend a renvoyé un statut 2xx)
       next: () => {
      // La redirection est la seule chose qui reste ici.
      console.log('Connexion réussie et token stocké !');
      this.router.navigate(['/dashboard']); 
    },
      
      // Cas n°2 : La requête a échoué (le backend a renvoyé une erreur 4xx ou 5xx)
      error: (err) => {
        console.error('Erreur de connexion :', err);
        // TODO: Afficher un message d'erreur à l'utilisateur dans le HTML
        alert('Identifiants incorrects ou erreur serveur.');
      }
    });
  }
}