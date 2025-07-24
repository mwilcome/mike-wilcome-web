import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-bottom-bar',
  standalone: true,
  templateUrl: './bottom-bar.html',
  styleUrl: './bottom-bar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BottomBar {
  shareProgress() {
    // Placeholder: Serialize game state and copy to clipboard or generate share URL
    console.log('Share progress functionality to be implemented');
    // Example: const saveData = this.gameService.serialize(); navigator.clipboard.writeText(saveData);
  }

  openHelp() {
    // Placeholder: Toggle help modal
    console.log('Open help modal functionality to be implemented');
    // Example: Inject a modal service and call openHelpModal()
  }
}
