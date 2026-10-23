import { useSyncExternalStore } from 'react';

// Details the person gives during sign-up, kept in memory for this session so
// later screens (e.g. "Welcome to LoopedIn, Tricia") can use them.
let firstName = '';
const listeners = new Set<() => void>();

export function setFirstName(name: string) {
  firstName = name.trim();
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useFirstName() {
  return useSyncExternalStore(subscribe, () => firstName);
}
