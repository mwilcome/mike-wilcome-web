import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  PLATFORM_ID,
  signal
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeName, ThemeService } from '../../../services/theme.service';

type TokenRow = Readonly<{
  token: string;
  value: string;
  preview?: string; // only for simple color values
}>;

@Component({
  selector: 'app-theme-lab',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './theme.html',
  styleUrl: './theme.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThemeLab {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly themeService = inject(ThemeService);

  readonly theme = this.themeService.theme;
  readonly themes = this.themeService.themes;

  // Tokens we care about in this lab.
  private readonly tokens: readonly string[] = [
    '--bg-color',
    '--text-color',
    '--text-muted',
    '--primary-color',
    '--primary-hover',
    '--accent-color',
    '--link-color',
    '--surface-1',
    '--surface-2',
    '--surface-3',
    '--border-1',
    '--border-2',
    '--shadow-1',
    '--shadow-2',
    '--header-bg',
    '--header-border',
    '--title-glow'
  ] as const;

  private readonly _tokenRows = signal<readonly TokenRow[]>([]);
  readonly tokenRows = computed(() => this._tokenRows());

  constructor() {
    // Keep token inspector in sync with theme changes.
    effect(() => {
      // dependency
      void this.theme();

      if (!isPlatformBrowser(this.platformId)) return;

      // ThemeService sets the dataset in its own effect. This microtask
      // ensures we read computed styles after the DOM has the new data-theme.
      queueMicrotask(() => this.refreshTokens());
    });
  }

  setTheme(theme: ThemeName): void {
    this.themeService.setTheme(theme);
  }

  refreshTokens(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const root = document.documentElement;
    const styles = getComputedStyle(root);

    const rows: TokenRow[] = this.tokens.map(token => {
      const raw = styles.getPropertyValue(token);
      const value = raw.trim() || '(unset)';

      const preview = this.tryMakePreview(value);
      return preview ? { token, value, preview } : { token, value };
    });

    this._tokenRows.set(rows);
  }

  private tryMakePreview(value: string): string | undefined {
    // Only show a preview for simple colors. Avoid gradients, shadows, etc.
    if (this.isLikelyColor(value)) return value;
    return undefined;
  }

  private isLikelyColor(value: string): boolean {
    // hex
    if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(value)) return true;

    // rgb/rgba/hsl/hsla
    if (/^(rgb|rgba|hsl|hsla)\(/.test(value)) return true;

    // named colors (rare in your tokens, but harmless)
    if (/^[a-zA-Z]+$/.test(value)) return true;

    return false;
  }
}
