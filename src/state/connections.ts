import { useSyncExternalStore } from 'react';

import type { ConnectionType } from '@/state/invites';

export type CheckIn = {
  mood: string;
  note: string;
  sharedAgo: string;
  tryThis: string;
};

export type KeyDate = {
  id: string;
  emoji: string;
  title: string;
  // Local calendar date, "YYYY-MM-DD".
  date: string;
  showOnHome: boolean;
};

export type Connection = {
  id: string;
  name: string;
  type: ConnectionType;
  checkIn?: CheckIn;
  // "Your connection" card on the Overview tab.
  insight: { title: string; body: string; basis: string };
  keyDates: KeyDate[];
};

// Prototype data from the Figma People screens (102:3213, 112:4004). Only Sam's copy is
// designed; Amy's is placeholder.
let connections: Connection[] = [
  {
    id: 'sam',
    name: 'Sam Rusty',
    type: 'romantic',
    checkIn: {
      mood: '😕 A Bit Flat',
      note: '“Big week at work. Looking forward to the weekend”.',
      sharedAgo: 'Shared 2h ago',
      tryThis: 'Plan a quiet night in and sit close. A hug will say more than a pep talk.',
    },
    insight: {
      title: 'Warm & Steady',
      body: 'You open things up, Sam keeps them grounded. You both want closeness and trust, you just reach for them at different speeds.',
      basis: 'Based on 8 answers each + 12 check-ins',
    },
    keyDates: [],
  },
  {
    id: 'amy',
    name: 'Amy Rhinehart',
    type: 'friend',
    insight: {
      title: 'Easy & Upbeat',
      body: 'You both bring the energy and say what you think. Make sure the quieter catch-ups get airtime too.',
      basis: 'Based on 8 answers each + 3 check-ins',
    },
    keyDates: [],
  },
];

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((listener) => listener());

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useConnections() {
  return useSyncExternalStore(subscribe, () => connections);
}

export function useConnection(id: string | undefined) {
  return useSyncExternalStore(subscribe, () => connections.find((connection) => connection.id === id));
}

// Accepting an invite request adds them with no check-ins or answers yet.
export function addConnection(id: string, name: string, type: ConnectionType) {
  if (connections.some((connection) => connection.id === id)) return;
  const firstName = name.split(' ')[0];
  connections = [
    ...connections,
    {
      id,
      name,
      type,
      insight: {
        title: 'Getting To Know Each Other',
        body: `Once you’ve both answered a few questions, we’ll show how you and ${firstName} fit together.`,
        basis: 'Based on 0 check-ins',
      },
      keyDates: [],
    },
  ];
  notify();
}

// Adds the date, or replaces the one with the same id when editing.
export function saveKeyDate(connectionId: string, keyDate: KeyDate) {
  connections = connections.map((connection) => {
    if (connection.id !== connectionId) return connection;
    const exists = connection.keyDates.some((existing) => existing.id === keyDate.id);
    const keyDates = exists
      ? connection.keyDates.map((existing) => (existing.id === keyDate.id ? keyDate : existing))
      : [...connection.keyDates, keyDate];
    return { ...connection, keyDates: keyDates.sort((a, b) => daysUntil(a.date) - daysUntil(b.date)) };
  });
  notify();
}

function toLocalDate(isoDate: string) {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day);
}

// Days from today to the date's next occurrence (dates already past roll on a year,
// so anniversaries and birthdays keep counting down).
export function daysUntil(isoDate: string, now = new Date()) {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const next = toLocalDate(isoDate);
  while (next < today) next.setFullYear(next.getFullYear() + 1);
  return Math.round((next.getTime() - today.getTime()) / 86_400_000);
}

// "23 Nov 2026"
export function formatKeyDate(isoDate: string) {
  return toLocalDate(isoDate).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
}
