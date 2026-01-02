import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeName, ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-theme-lab',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './theme.html',
  styleUrl: './theme.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThemeLab {
  private readonly themeService = inject(ThemeService);

  readonly theme = this.themeService.theme;
  readonly themes = this.themeService.themes;

  setTheme(theme: ThemeName): void {
    this.themeService.setTheme(theme);
  }
}
