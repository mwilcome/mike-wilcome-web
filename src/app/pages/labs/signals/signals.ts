import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  signal,
  untracked
} from '@angular/core';
import { RouterLink } from '@angular/router';

type HistoryEntry = Readonly<{
  value: number;
  doubled: number;
  squared: number;
  at: string;
}>;

@Component({
  selector: 'app-signals-lab',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './signals.html',
  styleUrl: './signals.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignalsLab {
  readonly value = signal<number>(25);

  readonly doubled = computed(() => this.value() * 2);
  readonly squared = computed(() => this.value() * this.value());

  readonly label = computed(() => {
    const v = this.value();

    if (v === 0) return 'Zero';
    if (v % 15 === 0) return 'Divisible by 3 and 5';
    if (v % 3 === 0) return 'Divisible by 3';
    if (v % 5 === 0) return 'Divisible by 5';

    return 'Not divisible by 3 or 5';
  });

  readonly history = signal<HistoryEntry[]>([]);

  constructor() {
    effect(() => {
      const v = this.value();
      const entry: HistoryEntry = {
        value: v,
        doubled: v * 2,
        squared: v * v,
        at: new Date().toLocaleTimeString()
      };

      const prev = untracked(() => this.history());
      this.history.set([entry, ...prev].slice(0, 12));
    });
  }

  setFromInput(raw: string): void {
    const next = Number.parseInt(raw, 10);
    if (Number.isFinite(next)) this.value.set(next);
  }

  nudge(delta: number): void {
    this.value.update(v => v + delta);
  }

  reset(): void {
    this.value.set(25);
    this.history.set([]);
  }
}
