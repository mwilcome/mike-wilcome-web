import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-derived-state-lab',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './derived-state.html',
  styleUrl: './derived-state.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DerivedStateLab {
  // Stored state: only raw inputs.
  readonly name = signal<string>('');
  readonly email = signal<string>('');
  readonly username = signal<string>('');

  // Derived state: no storage, no syncing.
  readonly emailOk = computed(() => this.isEmailOk(this.email().trim()));
  readonly usernameOk = computed(() => this.isUsernameOk(this.username().trim()));

  readonly issues = computed(() => {
    const problems: string[] = [];

    const name = this.name().trim();
    const email = this.email().trim();
    const username = this.username().trim();

    if (name.length === 0) problems.push('Name is required.');

    if (email.length === 0) {
      problems.push('Email is required.');
    } else if (!this.isEmailOk(email)) {
      problems.push('Email looks invalid.');
    }

    if (username.length === 0) {
      problems.push('Username is required.');
    } else {
      if (username.length < 3 || username.length > 16) {
        problems.push('Username must be 3–16 characters.');
      }
      if (!this.isUsernameOk(username)) {
        problems.push('Username can only use letters, numbers, and underscore.');
      }
      if (/\s/.test(username)) {
        problems.push('Username cannot contain spaces.');
      }
    }

    return problems;
  });

  readonly canSubmit = computed(() => this.issues().length === 0);

  setName(next: string): void {
    this.name.set(next);
  }

  setEmail(next: string): void {
    this.email.set(next);
  }

  setUsername(next: string): void {
    this.username.set(next);
  }

  reset(): void {
    this.name.set('');
    this.email.set('');
    this.username.set('');
  }

  private isEmailOk(value: string): boolean {
    // Intentionally simple. This is a state-derivation lab, not a validation library.
    const at = value.indexOf('@');
    if (at <= 0) return false;

    const dot = value.indexOf('.', at + 2);
    return dot > at + 1 && dot < value.length - 1;
  }

  private isUsernameOk(value: string): boolean {
    // Full rule for this lab:
    // - 3–16 chars
    // - no whitespace
    // - only letters/numbers/underscore
    if (value.length < 3 || value.length > 16) return false;
    if (/\s/.test(value)) return false;
    return /^[A-Za-z0-9_]+$/.test(value);
  }

}
