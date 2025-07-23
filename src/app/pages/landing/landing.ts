import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Landing {
  portraits = signal<string[]>([
    'assets/portraits/portrait1.JPG',
    'assets/portraits/portrait2.JPG',
    'assets/portraits/portrait3.JPG',
    'assets/portraits/portrait5.JPG',
    'assets/portraits/portrait6.JPG',
    'assets/portraits/portrait7.JPG',
    'assets/portraits/portrait8.JPG',
    'assets/portraits/portrait9.JPG',
    'assets/portraits/portrait10.JPG',
    'assets/portraits/portrait11.JPG',
    'assets/portraits/portrait12.JPG',
  ]);
}
