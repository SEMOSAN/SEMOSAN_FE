import { type ReactNode } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

type Props = {
  name: string;
  suffix?: string | number;
  leading?: ReactNode;
  nameColor?: string;
  suffixColor?: string;
  gap?: number;
  fontSize?: number;
  lineHeight?: number;
  style?: StyleProp<ViewStyle>;
};

export function MountainMarkerTextBox({
  name,
  suffix,
  leading,
  nameColor = '#464A57',
  suffixColor = '#BFC4D1',
  gap = 4,
  fontSize = 12,
  lineHeight = 16,
  style,
}: Props) {
  return (
    <View style={[styles.container, { gap }, style]}>
      {leading}
      <Text
        style={[styles.name, { color: nameColor, fontSize, lineHeight }]}
        numberOfLines={1}
      >
        {name}
      </Text>
      {suffix !== undefined && suffix !== null ? (
        <Text
          style={[styles.suffix, { color: suffixColor, fontSize, lineHeight }]}
          numberOfLines={1}
        >
          {suffix}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  name: {
    color: '#464A57',
    fontFamily: 'Pretendard',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
    textAlign: 'center',
  },
  suffix: {
    color: '#BFC4D1',
    fontFamily: 'Pretendard',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
    textAlign: 'center',
  },
});
