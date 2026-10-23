import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import FavoriteIcon from '@assets/icons/favorite-white.svg';
import PersonIcon from '@assets/icons/person.svg';
import StarIcon from '@assets/icons/star.svg';
import { colors, fonts } from '@/theme';

export type NavTab = 'home' | 'people' | 'you';

type NavBarProps = {
  active: NavTab;
  onSelect: (tab: NavTab) => void;
};

const TABS: { key: NavTab; label: string; icon: ReactNode }[] = [
  { key: 'home', label: 'Home', icon: <StarIcon width={16} height={16} /> },
  { key: 'people', label: 'People', icon: <FavoriteIcon width={16} height={16} /> },
  { key: 'you', label: 'You', icon: <PersonIcon width={16} height={16} /> },
];

// Figma "navBar" (102:3158): black bar, three icon + label tabs, inactive ones at 60%.
export function NavBar({ active, onSelect }: NavBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingBottom: Math.max(24, insets.bottom) }]} accessibilityRole="tablist">
      {TABS.map((tab) => {
        const selected = tab.key === active;
        return (
          <Pressable
            key={tab.key}
            accessibilityRole="tab"
            aria-selected={selected}
            onPress={() => onSelect(tab.key)}
            hitSlop={12}
            style={[styles.tab, !selected && styles.inactive]}
          >
            {tab.icon}
            <Text style={styles.label}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    paddingHorizontal: 48,
    backgroundColor: colors.black1000,
  },
  tab: { alignItems: 'center', gap: 4 },
  inactive: { opacity: 0.6 },
  label: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 10,
    letterSpacing: -0.3,
    color: colors.white,
    textTransform: 'uppercase',
  },
});
