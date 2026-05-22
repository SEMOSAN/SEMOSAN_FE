import { StyleSheet } from 'react-native';
import { MountainsPinIcon } from '@/components/icons/mountains-pin-icon';
import { MountainMarkerTextBox } from '@/components/map-markers/mountain-marker-textbox';

export type UnvisitedMountainPillVariant = 'trending' | 'curation' | 'visited';

export const UNVISITED_MOUNTAIN_PILL_MARKER_WIDTH = 84;
export const UNVISITED_MOUNTAIN_PILL_MARKER_HEIGHT = 20;

type Props = {
  name: string;
  variant: UnvisitedMountainPillVariant;
  selected?: boolean;
};

const SELECTED_BG = '#464A57';

export function UnvisitedMountainPillMarker({ name, variant, selected = false }: Props) {
  const isVisited = variant === 'visited';
  const iconColor = selected ? '#ffffff' : isVisited ? '#00D864' : '#A4ABC0';

  return (
    <MountainMarkerTextBox
      name={name}
      leading={<MountainsPinIcon size={13} circleColor={iconColor} />}
      nameColor={selected ? '#ffffff' : '#464A57'}
      style={[styles.container, selected && { backgroundColor: SELECTED_BG }]}
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
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 4,
    paddingRight: 7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});
