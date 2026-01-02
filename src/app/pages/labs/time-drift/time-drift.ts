import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, PLATFORM_ID, computed, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

type Unit = 'minutes' | 'hours' | 'days';

const STORAGE_KEY = 'mw.timeDrift.checkpointMs';

function clampInt(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, Math.trunc(value)));
}

function unitToMs(unit: Unit): number {
  switch (unit) {
    case 'minutes':
      return 60_000;
    case 'hours':
      return 3_600_000;
    default:
      return 86_400_000;
  }
}

function formatMs(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const s = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const m = totalMinutes % 60;
  const totalHours = Math.floor(totalMinutes / 60);
  const h = totalHours % 24;
  const d = Math.floor(totalHours / 24);

  const parts: string[] = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0 || d > 0) parts.push(`${h}h`);
  if (m > 0 || h > 0 || d > 0) parts.push(`${m}m`);
  parts.push(`${s}s`);
  return parts.join(' ');
}

@Component({
  selector: 'app-time-drift-lab',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './time-drift.html',
  styleUrl: './time-drift.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimeDriftLab {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private readonly formatter = new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  // live "now"
  readonly nowMs = signal<number>(Date.now());

  // persisted checkpoint (what the app remembers from last time)
  readonly checkpointMs = signal<number>(this.readInitialCheckpoint());

  // controls
  readonly amount = signal<number>(6);
  readonly unit = signal<Unit>('hours');

  // derived
  readonly nowLabel = computed(() => this.formatter.format(new Date(this.nowMs())));
  readonly checkpointLabel = computed(() => this.formatter.format(new Date(this.checkpointMs())));

  readonly driftMs = computed(() => Math.max(0, this.nowMs() - this.checkpointMs()));
  readonly driftLabel = computed(() => formatMs(this.driftMs()));

  readonly explanation = computed(() => {
    const drift = this.driftMs();
    if (drift < 5_000) return 'No meaningful drift yet. Save a checkpoint or simulate offline time.';
    return 'This is the “catch-up window” you’d use for offline progression, stale-cache checks, etc.';
  });

  constructor() {
    // ticking clock
    effect((onCleanup) => {
      if (!this.isBrowser) return;

      const id = window.setInterval(() => this.nowMs.set(Date.now()), 250);
      onCleanup(() => window.clearInterval(id));
    });

    // persist checkpoint changes
    effect(() => {
      if (!this.isBrowser) return;
      localStorage.setItem(STORAGE_KEY, String(this.checkpointMs()));
    });
  }

  saveCheckpoint(): void {
    this.checkpointMs.set(this.nowMs());
  }

  simulateOffline(): void {
    const a = clampInt(this.amount(), 1, 999);
    const ms = a * unitToMs(this.unit());
    this.checkpointMs.set(this.nowMs() - ms);
  }

  resetStorage(): void {
    if (this.isBrowser) localStorage.removeItem(STORAGE_KEY);
    this.checkpointMs.set(this.nowMs());
  }

  setAmountFromInput(raw: string): void {
    const num = Number(raw);
    this.amount.set(clampInt(num, 1, 999));
  }

  setUnitFromSelect(raw: string): void {
    if (raw === 'minutes' || raw === 'hours' || raw === 'days') {
      this.unit.set(raw);
    }
  }

  private readInitialCheckpoint(): number {
    const now = Date.now();
    if (!this.isBrowser) return now;

    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? Number(raw) : NaN;
    return Number.isFinite(parsed) ? parsed : now;
  }
}
