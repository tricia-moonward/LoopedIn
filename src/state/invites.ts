import { useSyncExternalStore } from 'react';

import { colors } from '@/theme';

export type InviteRequest = { id: string; name: string; email: string };

// "How do you know Sam?" options. The design shows Romantic and Friendship; the rest are placeholders.
export const CONNECTION_TYPES = [
  { key: 'romantic', name: 'Romantic', emoji: '🤍', background: colors.accentRed, color: colors.white },
  { key: 'family', name: 'Family', emoji: '🏡', background: colors.accentLime, color: colors.black1000 },
  { key: 'friend', name: 'Friendship', emoji: '👯', background: colors.accentBlue, color: colors.black1000 },
  { key: 'work', name: 'Work', emoji: '💼', background: colors.accentPurple, color: colors.white },
] as const;

export type ConnectionType = (typeof CONNECTION_TYPES)[number]['key'];

// Prototype data: one pending request (the People header shows "1"). Sam and Amy from the
// "invites" screen (90:2587) are already connections on the People tab (102:3213).
let requests: InviteRequest[] = [{ id: 'jordan', name: 'Jordan Ellis', email: 'jordan.ellis@example.com' }];
let linkSuffix = '';
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((listener) => listener());

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// Accepting or declining both take the request off the list.
export function resolveRequest(id: string) {
  requests = requests.filter((request) => request.id !== id);
  notify();
}

export function useInviteRequests() {
  return useSyncExternalStore(subscribe, () => requests);
}

// A fresh random ending makes any previously shared link stop working (in the real app).
export function regenerateInviteLink() {
  linkSuffix = Math.random().toString(36).slice(2, 6);
  notify();
}

// e.g. "looped.in/invite/tricia.moon" — first name plus a short random ending.
export function useInviteLink(firstName: string) {
  const suffix = useSyncExternalStore(subscribe, () => linkSuffix);
  const name = firstName.trim().toLowerCase().replace(/[^a-z0-9]/g, '') || 'you';
  return `looped.in/invite/${name}.${suffix || 'moon'}`;
}
