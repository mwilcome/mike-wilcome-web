import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { InboxService } from './inbox.service';
import { InboxFilter } from './inbox.models';

@Component({
  selector: 'app-mini-inbox-lab',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './mini-inbox.html',
  styleUrl: './mini-inbox.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MiniInboxLab {
  readonly inbox = inject(InboxService);

  // Compose inputs (kept local to this page on purpose)
  readonly from = signal('me@local');
  readonly subject = signal('');
  readonly body = signal('');

  readonly canCompose = computed(() => {
    return this.subject().trim().length > 0 || this.body().trim().length > 0;
  });

  setFilter(filter: InboxFilter): void {
    this.inbox.setFilter(filter);
  }

  setQuery(value: string): void {
    this.inbox.setQuery(value);
  }

  select(id: string): void {
    this.inbox.select(id);
  }

  toggleRead(id: string): void {
    this.inbox.toggleRead(id);
  }

  toggleStar(id: string): void {
    this.inbox.toggleStar(id);
  }

  archive(id: string): void {
    this.inbox.archive(id);
  }

  compose(): void {
    this.inbox.compose(this.from(), this.subject(), this.body());
    this.subject.set('');
    this.body.set('');
  }

  resetDemo(): void {
    this.inbox.resetDemo();
    this.subject.set('');
    this.body.set('');
  }
}
