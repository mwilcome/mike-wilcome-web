import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Landing {
  private readonly themeService = inject(ThemeService);

  readonly theme = this.themeService.theme;

  cycleTheme(): void {
    this.themeService.cycleTheme();
  }
}
