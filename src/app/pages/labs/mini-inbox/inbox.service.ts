import { Injectable, computed, signal } from '@angular/core';
import { InboxFilter, InboxMessage } from './inbox.models';

const STORAGE_KEY = 'mw.miniInbox.v1';

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function nowIso(): string {
  return new Date().toISOString();
}

function uid(): string {
  // Simple, deterministic-enough for a demo lab (not crypto).
  return Math.random().toString(16).slice(2) + '-' + Date.now().toString(16);
}

function seed(): InboxMessage[] {
  return [
    {
      id: uid(),
      from: 'build@ci.local',
      subject: 'Build succeeded',
      body: 'All checks passed. No action required.',
      createdAtIso: nowIso(),
      read: false,
      starred: false,
      archived: false
    },
    {
      id: uid(),
      from: 'team@work.local',
      subject: 'Lunch poll',
      body: 'Vote: tacos, ramen, or sandwiches.',
      createdAtIso: nowIso(),
      read: true,
      starred: true,
      archived: false
    },
    {
      id: uid(),
      from: 'alerts@prod.local',
      subject: 'Latency spike (resolved)',
      body: 'Transient latency spike detected and auto-mitigated.',
      createdAtIso: nowIso(),
      read: true,
      starred: false,
      archived: false
    }
  ];
}

@Injectable({ providedIn: 'root' })
export class InboxService {
  // Source of truth
  private readonly messages = signal<InboxMessage[]>(this.loadInitial());
  readonly selectedId = signal<string | null>(null);

  // “UI state” (still state, but not domain data)
  readonly filter = signal<InboxFilter>('all');
  readonly query = signal<string>('');

  // Derived views
  readonly visibleMessages = computed(() => {
    const q = this.query().trim().toLowerCase();
    const f = this.filter();

    return this.messages()
      .filter(m => !m.archived)
      .filter(m => {
        if (f === 'unread') return !m.read;
        if (f === 'starred') return m.starred;
        return true;
      })
      .filter(m => {
        if (q.length === 0) return true;
        return (
          m.from.toLowerCase().includes(q) ||
          m.subject.toLowerCase().includes(q) ||
          m.body.toLowerCase().includes(q)
        );
      });
  });

  readonly selected = computed(() => {
    const id = this.selectedId();
    if (!id) return null;
    return this.messages().find(m => m.id === id) ?? null;
  });

  readonly unreadCount = computed(() => this.messages().filter(m => !m.archived && !m.read).length);

  // Actions
  select(id: string): void {
    this.selectedId.set(id);
  }

  setFilter(filter: InboxFilter): void {
    this.filter.set(filter);
  }

  setQuery(query: string): void {
    this.query.set(query);
  }

  toggleRead(id: string): void {
    this.messages.update(list => list.map(m => (m.id === id ? { ...m, read: !m.read } : m)));
    this.persist();
  }

  toggleStar(id: string): void {
    this.messages.update(list => list.map(m => (m.id === id ? { ...m, starred: !m.starred } : m)));
    this.persist();
  }

  archive(id: string): void {
    this.messages.update(list => list.map(m => (m.id === id ? { ...m, archived: true } : m)));
    if (this.selectedId() === id) this.selectedId.set(null);
    this.persist();
  }

  compose(from: string, subject: string, body: string): void {
    const msg: InboxMessage = {
      id: uid(),
      from: from.trim() || 'unknown@local',
      subject: subject.trim() || '(no subject)',
      body: body.trim() || '(empty)',
      createdAtIso: nowIso(),
      read: false,
      starred: false,
      archived: false
    };

    this.messages.update(list => [msg, ...list]);
    this.selectedId.set(msg.id);
    this.persist();
  }

  resetDemo(): void {
    this.messages.set(seed());
    this.selectedId.set(null);
    this.filter.set('all');
    this.query.set('');
    this.persist();
  }

  // Persistence
  private loadInitial(): InboxMessage[] {
    if (typeof window === 'undefined') return seed();

    const parsed = safeParse<InboxMessage[]>(localStorage.getItem(STORAGE_KEY));
    if (!parsed || !Array.isArray(parsed) || parsed.length === 0) return seed();

    // Minimal shape guard: keep only objects with required fields.
    const cleaned = parsed.filter(x =>
      x &&
      typeof x.id === 'string' &&
      typeof x.from === 'string' &&
      typeof x.subject === 'string' &&
      typeof x.body === 'string' &&
      typeof x.createdAtIso === 'string' &&
      typeof x.read === 'boolean' &&
      typeof x.starred === 'boolean' &&
      typeof x.archived === 'boolean'
    );

    return cleaned.length > 0 ? cleaned : seed();
  }

  private persist(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.messages()));
  }
}
