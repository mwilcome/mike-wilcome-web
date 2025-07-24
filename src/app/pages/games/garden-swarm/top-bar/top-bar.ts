import { Component, ChangeDetectionStrategy } from '@angular/core';
import { GameService } from '@core/services/game';
import { computed, signal } from '@angular/core';
import Big from 'big.js';
import { ClickOutsideDirective } from '../click-outside';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [ClickOutsideDirective],
  templateUrl: './top-bar.html',
  styleUrl: './top-bar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopBar {
  constructor(public gameService: GameService) {}

  bloomsFormatted = computed(() => {
    const blooms = this.gameService.blooms();
    return blooms.gte(new Big('1000000')) ? blooms.toExponential(2) : blooms.toFixed(2);
  });
  bpsFormatted = computed(() => {
    const bps = this.gameService.bps();
    return bps.gte(new Big('1000000')) ? bps.toExponential(2) : bps.toFixed(2);
  });
  offlineGains = signal(0);

  showSettings = signal(false);

  toggleSettings() {
    this.showSettings.update(v => !v);
  }

  toggleAudio(event: Event) {
    console.log('Audio toggled', (event.target as HTMLInputElement).checked);
  }

  exportSave() {
    console.log('Save exported:', this.gameService.serialize());
  }

  closeSettings() {
    this.showSettings.set(false);
  }
}
