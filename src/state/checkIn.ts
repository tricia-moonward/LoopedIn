import { useSyncExternalStore } from 'react';

// The five stops on the "How are you feeling today?" slider, left to right.
export const MOODS = [
  { label: 'Very Unpleasant', emoji: '😣' },
  { label: 'Unpleasant', emoji: '😕' },
  { label: 'Neutral', emoji: '😐' },
  { label: 'Pleasant', emoji: '🙂' },
  { label: 'Very Pleasant', emoji: '😄' },
] as const;

export const NEUTRAL_MOOD = 2;

// Pick-any groups on the check-in (Figma 173:2247). "Who are you with?" also lists
// your connections ahead of these.
export const TAG_GROUPS = {
  happening: ['Big day at work', 'Not feeling 100%', 'Celebrating', 'Need some space', 'Busy week', 'Missing someone'],
  doing: ['Working', 'Travelling', 'Driving', 'Resting', 'Hobbies', 'Fitness', 'Hanging Out', 'Eating'],
  with: ['Friends', 'Co-workers', 'Family', 'Pets', 'By myself'],
  where: ['Work', 'Home', 'Outside', 'Commuting', 'School'],
  stretchedThin: ['Someone taking a job off me', 'Time alone to rest', 'Talking it through', 'A distraction'],
} as const;

export type TagGroup = keyof typeof TAG_GROUPS;

export type DailyCheckIn = {
  mood: number;
  // Private; never shared.
  note: string;
  picked: Record<TagGroup, string[]>;
  // Options added with "+", kept so they still show when editing.
  added: Record<TagGroup, string[]>;
  lookingForward: string;
  // Connection ids the check-in is shared with. Off until chosen.
  sharedWith: string[];
  checkedInAt?: number;
};

const emptyGroups = (): Record<TagGroup, string[]> => ({
  happening: [],
  doing: [],
  with: [],
  where: [],
  stretchedThin: [],
});

const emptyCheckIn = (): DailyCheckIn => ({
  mood: NEUTRAL_MOOD,
  note: '',
  picked: emptyGroups(),
  added: emptyGroups(),
  lookingForward: '',
  sharedWith: [],
});

// Today's saved check-in, and the one being filled in (the private note is written on
// its own screen, so the draft lives here rather than in the check-in screen).
let today: DailyCheckIn | undefined;
let draft: DailyCheckIn = emptyCheckIn();
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((listener) => listener());

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useTodayCheckIn() {
  return useSyncExternalStore(subscribe, () => today);
}

export function useCheckInDraft() {
  return useSyncExternalStore(subscribe, () => draft);
}

// Starts from today's check-in when editing it, otherwise from blank.
export function startCheckIn() {
  draft = today ? { ...today } : emptyCheckIn();
  notify();
}

export function updateCheckIn(patch: Partial<DailyCheckIn>) {
  draft = { ...draft, ...patch };
  notify();
}

export function submitCheckIn() {
  today = { ...draft, checkedInAt: Date.now() };
  notify();
}

export function moodLabel(checkIn: DailyCheckIn) {
  const mood = MOODS[checkIn.mood];
  return `${mood.emoji} Feeling ${mood.label}`;
}

// "Try this" suggestion, from what they said helps when they're stretched thin.
const SUGGESTIONS: Record<string, string> = {
  'Someone taking a job off me':
    'Ask for one thing to come off your plate tonight. You said a hand with the load helps most on big days.',
  'Time alone to rest': 'Take twenty minutes to yourself before dinner. You said time alone helps you reset on big days.',
  'Talking it through':
    'Call someone you trust for ten minutes tonight. You said talking it through helps you reset on big days.',
  'A distraction': 'Put on something you love for half an hour. You said a distraction helps you reset on big days.',
};

export function suggestionFor(checkIn: DailyCheckIn) {
  const answer = checkIn.picked.stretchedThin.find((option) => SUGGESTIONS[option]);
  return answer
    ? SUGGESTIONS[answer]
    : 'Take a few slow breaths before your next thing. Small pauses add up on busy days.';
}

// "Checked in 2h ago"
export function checkedInAgo(checkIn: DailyCheckIn, now = Date.now()) {
  const minutes = Math.floor((now - (checkIn.checkedInAt ?? now)) / 60_000);
  if (minutes < 1) return 'Checked in just now';
  if (minutes < 60) return `Checked in ${minutes}m ago`;
  return `Checked in ${Math.floor(minutes / 60)}h ago`;
}
