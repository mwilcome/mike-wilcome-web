export type InboxFilter = 'all' | 'unread' | 'starred';

export type InboxMessage = Readonly<{
  id: string;
  from: string;
  subject: string;
  body: string;
  createdAtIso: string;
  read: boolean;
  starred: boolean;
  archived: boolean;
}>;
