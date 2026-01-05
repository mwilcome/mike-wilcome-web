import { ViewportScroller } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

type LabCategory = 'explore' | 'handsOn';

type LabLink = Readonly<{
  path: string;
  title: string;
  description: string;
  tag: string;
  category: LabCategory;
}>;

@Component({
  selector: 'app-labs',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './labs.html',
  styleUrl: './labs.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Labs {
  private readonly viewportScroller = inject(ViewportScroller);

  readonly labLinks: readonly LabLink[] = [
    {
      path: 'signals',
      title: 'Angular Signals',
      description: 'A small, isolated demonstration of Angular’s signal-based reactivity model.',
      tag: 'Reactive core',
      category: 'explore'
    },
    {
      path: 'time-drift',
      title: 'Time Drift',
      description: 'Persist a timestamp, simulate “offline time”, and see how apps compute catch-up deltas.',
      tag: 'Time + persistence',
      category: 'explore'
    },
    {
      path: 'derived-state',
      title: 'Derived State',
      description: 'Store only raw inputs. Derive validity, messages, and submit readiness with computed().',
      tag: 'Derived values',
      category: 'explore'
    },
    {
      path: 'theme',
      title: 'Theme Switcher',
      description: 'Flip global CSS tokens with data-theme + localStorage persistence.',
      tag: 'Design system',
      category: 'explore'
    },

    // Hands-on
    {
      path: 'mini-inbox',
      title: 'Mini Inbox',
      description: 'Build a small inbox UI to learn templates, components, services, routing, and persistence.',
      tag: 'Angular basics',
      category: 'handsOn'
    }
  ];

  readonly exploreLabs = this.labLinks.filter(l => l.category === 'explore');
  readonly handsOnLabs = this.labLinks.filter(l => l.category === 'handsOn');

  scrollTo(sectionId: 'explore' | 'hands-on'): void {
    this.viewportScroller.scrollToAnchor(sectionId);
  }
}
