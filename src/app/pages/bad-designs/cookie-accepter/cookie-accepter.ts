import { ChangeDetectionStrategy, Component, signal, OnDestroy, viewChild, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import {NgOptimizedImage} from '@angular/common';

type Phase = 'raw' | 'baking' | 'done' | 'accepted' | 'rejected';

@Component({
  selector: 'app-cookie-accepter',
  standalone: true,
  imports: [RouterLink, NgOptimizedImage],
  templateUrl: './cookie-accepter.html',
  styleUrl: './cookie-accepter.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CookieAccepter implements OnDestroy {
  readonly phase = signal<Phase>('raw');
  private readonly plateTarget = viewChild<ElementRef<HTMLElement>>('plateTarget');
  private bakingTimer: ReturnType<typeof setTimeout> | null = null;

  startBaking(): void {
    if (this.phase() !== 'raw') return;
    this.phase.set('baking');
    this.bakingTimer = setTimeout(() => {
      this.phase.set('done');
      this.bakingTimer = null;
    }, 8000);
  }

  accept(): void {
    if (this.phase() !== 'done') return;
    this.phase.set('accepted');
  }

  reject(): void {
    if (this.phase() !== 'done') return;
    this.phase.set('rejected');
  }

  reset(): void {
    if (this.bakingTimer) {
      clearTimeout(this.bakingTimer);
      this.bakingTimer = null;
    }
    this.phase.set('raw');
  }

  onDragStart(event: DragEvent): void {
    event.dataTransfer?.setData('text/plain', 'cookie');
  }

  onOvenDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onOvenDrop(event: DragEvent): void {
    event.preventDefault();
    this.startBaking();
  }

  onPlateDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onPlateDrop(event: DragEvent): void {
    event.preventDefault();
    this.accept();
  }

  onTrashDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onTrashDrop(event: DragEvent): void {
    event.preventDefault();
    this.reject();
  }

  onRawKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.startBaking();
    }
  }

  onBakedKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.plateTarget()?.nativeElement.focus();
    }
  }

  onPlateKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.accept();
    }
  }

  onTrashKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.reject();
    }
  }

  ngOnDestroy(): void {
    if (this.bakingTimer) {
      clearTimeout(this.bakingTimer);
    }
  }
}
