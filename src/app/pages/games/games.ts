import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-games',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './games.html',
  styleUrl: './games.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Games {}
