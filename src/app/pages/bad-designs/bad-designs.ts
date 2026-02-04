import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-bad-designs',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './bad-designs.html',
  styleUrl: './bad-designs.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BadDesigns {}
