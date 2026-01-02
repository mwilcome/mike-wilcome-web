import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { effect, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

export type ThemeName = 'arcade' | 'ink' | 'terminal' | 'lava';

const STORAGE_KEY = 'mw.theme';

// Single source of truth for:
// - what themes exist
// - the cycle order
const THEME_ORDER: readonly ThemeName[] = ['ink', 'terminal', 'arcade', 'lava'] as const;

// First-time default (only used when nothing is in localStorage)
const DEFAULT_THEME: ThemeName = 'ink';

function isThemeName(value: string | null): value is ThemeName {
  if (!value) return false;
  return (THEME_ORDER as readonly string[]).includes(value);
}

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly doc = inject(DOCUMENT);

  // Expose list so UIs (Theme Lab, future menus) can render dynamically
  readonly themes = THEME_ORDER;

  readonly theme = signal<ThemeName>(this.readInitialTheme());

  constructor() {
    // Persist + apply only in the browser
    effect(() => {
      const t = this.theme();

      if (!isPlatformBrowser(this.platformId)) return;

      this.doc.documentElement.dataset['theme'] = t;
      localStorage.setItem(STORAGE_KEY, t);
    });
  }

  setTheme(theme: ThemeName): void {
    this.theme.set(theme);
  }

  cycleTheme(): void {
    const current = this.theme();
    const idx = THEME_ORDER.indexOf(current);
    const next = THEME_ORDER[(idx + 1) % THEME_ORDER.length] ?? DEFAULT_THEME;
    this.theme.set(next);
  }

  private readInitialTheme(): ThemeName {
    if (!isPlatformBrowser(this.platformId)) return DEFAULT_THEME;

    const stored = localStorage.getItem(STORAGE_KEY);
    return isThemeName(stored) ? stored : DEFAULT_THEME;
  }
}
