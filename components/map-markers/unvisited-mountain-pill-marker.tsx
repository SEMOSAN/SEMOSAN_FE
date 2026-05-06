import { StyleSheet, View } from 'react-native';
import { MountainIcon } from '@/components/icons/mountain-icon';
import { MountainMarkerTextBox } from '@/components/map-markers/mountain-marker-textbox';

export type UnvisitedMountainPillVariant = 'trending' | 'curation';

export const UNVISITED_MOUNTAIN_PILL_MARKER_WIDTH = 120;
export const UNVISITED_MOUNTAIN_PILL_MARKER_HEIGHT = 28;

const CURATION_ICON_CIRCLE = '#FFD40D';
const CURATION_ICON_FOREGROUND = '#FFFDF0';

const VARIANT_COLORS: Record<UnvisitedMountainPillVariant, { circle: string; icon: string }> = {
  trending: { circle: '#507EF4', icon: '#EFF6FF' },
  curation: { circle: CURATION_ICON_CIRCLE, icon: CURATION_ICON_FOREGROUND },
};

type Props = {
  name: string;
  variant: UnvisitedMountainPillVariant;
};

export function UnvisitedMountainPillMarker({ name, variant }: Props) {
  const { circle, icon } = VARIANT_COLORS[variant];

  return (
    <MountainMarkerTextBox
      name={name}
      leading={
        <View style={[styles.iconCircle, { backgroundColor: circle }]}>
          <MountainIcon size={9} color={icon} />
        </View>
      }
      style={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    height: UNVISITED_MOUNTAIN_PILL_MARKER_HEIGHT,
    backgroundColor: '#ffffff',
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 5,
    paddingRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  iconCircle: {
    width: 16,
    height: 16,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
});
