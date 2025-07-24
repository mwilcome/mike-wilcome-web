import { Component, ChangeDetectionStrategy } from '@angular/core';
import { GameService } from '@core/services/game';
import { computed, signal } from '@angular/core';
import Big from 'big.js'; // For derived stats

@Component({
  selector: 'app-top-bar',
  standalone: true,
  templateUrl: './top-bar.html',
  styleUrl: './top-bar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopBar {
  constructor(public gameService: GameService) {}

  // Example signals for HUD
  bloomsFormatted = computed(() => {
    const blooms = this.gameService.blooms();
    return blooms.gte(new Big('1000000')) ? blooms.toExponential(2) : blooms.toFixed(2);
  });
  bpsFormatted = computed(() => this.gameService.bps().toExponential(2));
  offlineGains = signal(0); // Placeholder; calculate in service on load

  // Settings modal toggle
  showSettings = signal(false);

  toggleSettings() {
    this.showSettings.update(v => !v);
  }

  // Placeholder methods
  toggleAudio(event: Event) {
    console.log('Audio toggled', (event.target as HTMLInputElement).checked);
    // Implement audio logic later
  }

  exportSave() {
    console.log('Save exported:', this.gameService.serialize());
    // Implement save export (e.g., copy to clipboard) later
  }
}
