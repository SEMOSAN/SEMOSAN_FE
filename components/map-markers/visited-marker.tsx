import { useId } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { ClipPath, Defs, G, Image as SvgImage, Path } from 'react-native-svg';
import { MountainIcon } from '@/components/icons/mountain-icon';
import { MountainMarkerTextBox } from '@/components/map-markers/mountain-marker-textbox';

type Props = {
  name: string;
  visitCount: number;
  imageUri?: string;
  flagColor?: string;
  selected?: boolean;
};

export const VISITED_MARKER_OVERLAY_WIDTH = 108;
export const VISITED_MARKER_OVERLAY_HEIGHT = 62;

const SELECTED_BG = '#464A57';

export function VisitedMarker({ name, visitCount, imageUri, flagColor = '#00D864', selected = false }: Props) {
  const clipIdOuter = useId();
  const clipIdInner = useId();

  return (
    <View style={styles.container} collapsable={false}>
      <View style={styles.contentWrap}>
        <View style={styles.imageGroup}>
          <View style={[styles.flagPole, selected && { backgroundColor: SELECTED_BG }]} />
          <View style={[styles.flag, { borderLeftColor: selected ? SELECTED_BG : flagColor }]} />

          <View style={styles.imageShapeWrap}>
            <Svg width={36} height={32} viewBox="0 0 32 29">
              <Defs>
                <ClipPath id={clipIdOuter}>
                  <Path d="M13.7571 1.26472C14.7408 -0.421574 17.1773 -0.421574 18.161 1.26472L31.567 24.2465C32.5584 25.9459 31.3326 28.0802 29.3651 28.0802H2.55302C0.585586 28.0802 -0.640242 25.946 0.351092 24.2465L13.7571 1.26472Z" />
                </ClipPath>
                <ClipPath id={clipIdInner}>
                  <Path d="M14.719 3.632C15.307 2.624 16.761 2.624 17.349 3.632L28.919 23.466C29.511 24.481 28.779 25.757 27.605 25.757H4.463C3.288 25.757 2.556 24.481 3.149 23.466L14.719 3.632Z" />
                </ClipPath>
              </Defs>

              <Path
                d="M13.7571 1.26472C14.7408 -0.421574 17.1773 -0.421574 18.161 1.26472L31.567 24.2465C32.5584 25.9459 31.3326 28.0802 29.3651 28.0802H2.55302C0.585586 28.0802 -0.640242 25.946 0.351092 24.2465L13.7571 1.26472Z"
                fill={selected ? SELECTED_BG : '#FFFFFF'}
              />

              <G clipPath={`url(#${clipIdInner})`}>
                {imageUri ? (
                  <SvgImage
                    href={{ uri: imageUri }}
                    x={0}
                    y={0}
                    width={32}
                    height={29}
                    preserveAspectRatio="xMidYMid slice"
                  />
                ) : (
                  <Path d="M0 0H32V29H0Z" fill="#FFFFFF" />
                )}
              </G>

            </Svg>
          </View>

          <View style={styles.imageIcon}>
            <MountainIcon size={8} color="#ffffff" />
          </View>
        </View>

        <View style={styles.textBoxWrap}>
          <MountainMarkerTextBox
            name={name}
            suffix={visitCount}
            nameColor={selected ? '#ffffff' : '#464A57'}
            suffixColor={selected ? '#A4ABC0' : '#BFC4D1'}
            style={[styles.textBox, selected ? { backgroundColor: SELECTED_BG } : undefined]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: VISITED_MARKER_OVERLAY_WIDTH,
    height: VISITED_MARKER_OVERLAY_HEIGHT,
  },
  contentWrap: {
    position: 'absolute',
    left: 8,
    top: 8,
    width: 92,
    height: 46,
    boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.2)',
  },
  imageGroup: {
    position: 'absolute',
    top: 0,
    left: -4,
    width: 36,
    height: 46,
    zIndex: 2,
  },
  flagPole: {
    position: 'absolute',
    left: 16.7,
    top: 0,
    width: 2.08,
    height: 20,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
  },
  flag: {
    position: 'absolute',
    top: 0.7,
    left: 18.9,
    width: 0,
    height: 0,
    borderTopWidth: 6,
    borderBottomWidth: 5,
    borderLeftWidth: 8.2,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  imageShapeWrap: {
    position: 'absolute',
    left: 0,
    top: 14,
    width: 36,
    height: 32,
  },
  imageIcon: {
    position: 'absolute',
    top: 0,
    left: 19.6,
    width: 8,
    height: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBoxWrap: {
    position: 'absolute',
    left: 3,
    bottom: 0,
    zIndex: 1,
  },
  textBox: {
    height: 28,
    borderRadius: 999,
    paddingLeft: 30,
    paddingRight: 12,
    paddingTop: 6,
    paddingBottom: 6,
    alignSelf: 'flex-start',
  },
});
