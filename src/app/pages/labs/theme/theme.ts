import { ChangeDetectionStrategy, Component, effect, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

type ThemeName = 'arcade' | 'ink' | 'terminal';

const STORAGE_KEY = 'mw.theme';

function isThemeName(value: string | null): value is ThemeName {
  return value === 'arcade' || value === 'ink' || value === 'terminal';
}

function applyTheme(theme: ThemeName): void {
  document.documentElement.dataset['theme'] = theme;
}

function readInitialTheme(): ThemeName {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (isThemeName(stored)) return stored;
  return 'arcade';
}

@Component({
  selector: 'app-theme-lab',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './theme.html',
  styleUrl: './theme.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThemeLab {
  readonly theme = signal<ThemeName>(readInitialTheme());

  constructor() {
    effect(() => {
      const t = this.theme();
      applyTheme(t);
      localStorage.setItem(STORAGE_KEY, t);
    });
  }

  setTheme(theme: ThemeName): void {
    this.theme.set(theme);
  }
}
