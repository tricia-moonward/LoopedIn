import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Line, Polygon } from 'react-native-svg';

import { Badge } from '@/components/Badge';
import { CHART_AXES, type ChartAxis, type CompareChart } from '@/components/people/insights';
import { colors, fonts } from '@/theme';

// Chart is drawn on a 329 × 290 frame (Figma 170:4398) and scaled to the card's width.
const FRAME_WIDTH = 329;
const FRAME_HEIGHT = 290;
const CENTRE = { x: 164.5, y: 145 };
const RADIUS = 98;
const RINGS = [1 / 3, 2 / 3, 1];
// Their outline is dashed; the 24pt legend swatch has its own dashes (short at each end).
const THEM_DASH = '6.4 4.2';
const SWATCH_DASH = '2.3 2.75 4.58 2.75 4.58 2.75 2.3';

// Axis i points straight up, then every 60° clockwise.
function point(index: number, value: number) {
  const angle = (-90 + index * 60) * (Math.PI / 180);
  return { x: CENTRE.x + Math.cos(angle) * RADIUS * value, y: CENTRE.y + Math.sin(angle) * RADIUS * value };
}

function points(values: Record<ChartAxis, number> | number) {
  return CHART_AXES.map((axis, index) => {
    const { x, y } = point(index, typeof values === 'number' ? values : values[axis.key]);
    return `${x},${y}`;
  }).join(' ');
}

// Where each label sits on the frame: centred over the top and bottom axes, and 14pt out
// from the side vertices (left-aligned on the right, right-aligned on the left).
const LABEL_SPOTS: { x: number; top: number; align: 'center' | 'left' | 'right' }[] = [
  { x: 164.5, top: 16, align: 'center' },
  { x: 263.49, top: 81.5, align: 'left' },
  { x: 263.49, top: 193.5, align: 'left' },
  { x: 164.5, top: 259, align: 'center' },
  { x: 65.51, top: 193.5, align: 'right' },
  { x: 65.51, top: 81.5, align: 'right' },
];

type ConnectionChartProps = {
  chart: CompareChart;
  // First name for the legend ("Sam").
  name: string;
};

// Figma "Connection Chart" (170:4394): you and them across six parts of the relationship.
// Tapping a label explains it in place of the biggest difference; tap it again to go back.
export function ConnectionChart({ chart, name }: ConnectionChartProps) {
  const [width, setWidth] = useState(0);
  const [selected, setSelected] = useState<ChartAxis | undefined>();
  const scale = width / FRAME_WIDTH;
  const axis = CHART_AXES.find((option) => option.key === selected);
  const biggest = CHART_AXES.find((option) => option.key === chart.biggestDifference.axis)!;

  return (
    <View style={styles.card}>
      <View style={styles.titleGroup}>
        <Text style={styles.title}>How you two compare</Text>
        <Text style={styles.body}>
          Where you each sit across six parts of your relationship. Tap a label to see what it means.
        </Text>
      </View>

      <View
        style={[styles.chart, { height: FRAME_HEIGHT * scale }]}
        onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
      >
        {width > 0 && (
          <>
            <Svg
              width={width}
              height={FRAME_HEIGHT * scale}
              viewBox={`0 0 ${FRAME_WIDTH} ${FRAME_HEIGHT}`}
              accessibilityLabel={`Chart comparing you and ${name}`}
            >
              {RINGS.map((ring, index) => (
                <Polygon
                  key={ring}
                  points={points(ring)}
                  fill="none"
                  stroke={colors.black1000}
                  strokeOpacity={index === 0 ? 0.1 : 0.2}
                />
              ))}
              {CHART_AXES.map((option, index) => {
                const end = point(index, 1);
                return (
                  <Line
                    key={option.key}
                    x1={CENTRE.x}
                    y1={CENTRE.y}
                    x2={end.x}
                    y2={end.y}
                    stroke={colors.black1000}
                    strokeOpacity={index === 3 ? 0.1 : 0.2}
                  />
                );
              })}
              <Polygon
                points={points(chart.you)}
                fill={colors.accentBlue}
                fillOpacity={0.4}
                stroke={colors.accentBlue}
                strokeWidth={2}
                strokeLinejoin="round"
              />
              <Polygon
                points={points(chart.them)}
                fill={colors.accentRed}
                fillOpacity={0.4}
                stroke={colors.accentRed}
                strokeWidth={2}
                strokeLinejoin="round"
                strokeDasharray={THEM_DASH}
              />
            </Svg>

            {CHART_AXES.map((option, index) => {
              const spot = LABEL_SPOTS[index];
              const active = option.key === selected;
              const x = spot.x * scale;
              return (
                // Centred labels sit in a full-width row so the text centres over the axis;
                // only the label itself takes the tap.
                <View
                  key={option.key}
                  pointerEvents="box-none"
                  style={[
                    styles.label,
                    { top: spot.top * scale },
                    spot.align === 'left' && { left: x },
                    spot.align === 'right' && { right: width - x },
                    spot.align === 'center' && styles.centredLabel,
                  ]}
                >
                  <Pressable
                    accessibilityRole="button"
                    aria-pressed={active}
                    accessibilityHint="Shows what this means"
                    hitSlop={10}
                    onPress={() => setSelected(active ? undefined : option.key)}
                  >
                    <Text style={[styles.labelText, active && styles.labelActive]}>{option.label}</Text>
                  </Pressable>
                </View>
              );
            })}
          </>
        )}
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <Svg width={24} height={4}>
            <Line x1={1} y1={2} x2={23} y2={2} stroke={colors.accentBlue} strokeWidth={2.5} strokeLinecap="round" />
          </Svg>
          <Text style={styles.legendText}>You</Text>
        </View>
        <View style={styles.legendItem}>
          <Svg width={24} height={4}>
            <Line
              x1={1}
              y1={2}
              x2={23}
              y2={2}
              stroke={colors.accentRed}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeDasharray={SWATCH_DASH}
            />
          </Svg>
          <Text style={styles.legendText}>{name}</Text>
        </View>
      </View>

      <View style={styles.detail} aria-live="polite">
        {axis ? (
          <>
            <Badge label={axis.label.toUpperCase()} background={colors.white} size="small" align="start" />
            <Text style={styles.detailText}>{axis.meaning}</Text>
          </>
        ) : (
          <>
            <Badge
              label={`BIGGEST DIFFERENCE: ${biggest.label.toUpperCase()}`}
              background={colors.accentRed}
              color={colors.white}
              size="small"
              align="start"
            />
            <Text style={styles.detailText}>{chart.biggestDifference.body}</Text>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignSelf: 'stretch',
    padding: 16,
    gap: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.black1000,
  },
  titleGroup: { alignSelf: 'stretch', gap: 8 },
  title: {
    fontFamily: fonts.serif,
    fontSize: 24,
    lineHeight: 24,
    letterSpacing: -0.72,
    color: colors.black1000,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  body: { fontFamily: fonts.sansMedium, fontSize: 14, letterSpacing: -0.42, color: colors.black800, textAlign: 'center' },
  chart: { alignSelf: 'stretch', maxWidth: FRAME_WIDTH, width: '100%' },
  label: { position: 'absolute' },
  centredLabel: { left: 0, right: 0, alignItems: 'center' },
  labelText: { fontFamily: fonts.sansSemiBold, fontSize: 12, letterSpacing: -0.36, color: colors.black600 },
  labelActive: { fontFamily: fonts.sansBold, color: colors.black1000, textDecorationLine: 'underline' },
  legend: { flexDirection: 'row', alignItems: 'center', gap: 24 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  legendText: { fontFamily: fonts.sansSemiBold, fontSize: 14, letterSpacing: -0.42, color: colors.black1000 },
  // Rule across the card, then the tag and its explanation.
  detail: {
    alignSelf: 'stretch',
    gap: 10,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.black1000,
  },
  detailText: { fontFamily: fonts.sansMedium, fontSize: 14, letterSpacing: -0.42, color: colors.black1000 },
});
