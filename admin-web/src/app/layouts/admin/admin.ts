import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'; // ÉTAPE 1 : Importer l'outil


@Component({
  selector: 'app-admin',
  imports: [
    RouterOutlet // ÉTAPE 2 : Mettre l'outil dans la boîte
  ],
  templateUrl: './admin.html',
  styleUrl: './admin.scss'
})
export class Admin {

}
