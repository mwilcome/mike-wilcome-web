import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

type LabLink = Readonly<{
  path: string;
  title: string;
  description: string;
  tag: string;
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
  readonly labLinks: readonly LabLink[] = [
    {
      path: 'signals',
      title: 'Signals Playground',
      description: 'Signals + computed + effect, with no RxJS and no DOM weirdness.',
      tag: 'Reactive core'
    },
    {
      path: 'theme',
      title: 'Theme Switcher',
      description: 'Flip global CSS tokens with data-theme + localStorage persistence.',
      tag: 'Design system'
    }
  ];
}
