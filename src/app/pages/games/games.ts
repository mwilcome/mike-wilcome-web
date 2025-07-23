import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-games',
  imports: [
    RouterOutlet,
    RouterLink
  ],
  templateUrl: './games.html',
  styleUrl: './games.scss'
})
export class Games {

}
