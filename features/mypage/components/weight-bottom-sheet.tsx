import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ITEM_HEIGHT = 48;
const VISIBLE_ITEMS = 5;
const PADDING_COUNT = Math.floor(VISIBLE_ITEMS / 2);
const MIN_WEIGHT = 30;
const MAX_WEIGHT = 200;
const WEIGHTS = Array.from({ length: MAX_WEIGHT - MIN_WEIGHT + 1 }, (_, i) => i + MIN_WEIGHT);
const DATA = [...Array(PADDING_COUNT).fill(null), ...WEIGHTS, ...Array(PADDING_COUNT).fill(null)];

function parseWeight(value: string): number {
  const num = parseInt(value.replace(/[^0-9]/g, ''), 10);
  return isNaN(num) ? 60 : Math.min(MAX_WEIGHT, Math.max(MIN_WEIGHT, num));
}

type Props = {
  visible: boolean;
  initialValue: string;
  onClose: () => void;
  onSave: (value: string) => void;
};

export function WeightBottomSheet({ visible, initialValue, onClose, onSave }: Props) {
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);
  const initialWeight = parseWeight(initialValue);
  const [selected, setSelected] = useState(initialWeight);

  const currentIndexRef = useRef(WEIGHTS.indexOf(initialWeight));

  useEffect(() => {
    if (!visible) return;
    const parsed = parseWeight(initialValue);
    const idx = WEIGHTS.indexOf(parsed);
    currentIndexRef.current = idx;
    setSelected(parsed);
    setTimeout(() => {
      flatListRef.current?.scrollToOffset({
        offset: idx * ITEM_HEIGHT,
        animated: false,
      });
    }, 50);
  }, [visible, initialValue]);

  const isChanged = selected !== initialWeight;

  const handleScroll = (e: any) => {
    const y = e.nativeEvent.contentOffset.y;
    currentIndexRef.current = Math.max(
      0,
      Math.min(WEIGHTS.length - 1, Math.round(y / ITEM_HEIGHT)),
    );
  };

  const handleScrollEnd = (e: any) => {
    const y = e.nativeEvent.contentOffset.y;
    const idx = Math.max(
      0,
      Math.min(WEIGHTS.length - 1, Math.round(y / ITEM_HEIGHT)),
    );
    currentIndexRef.current = idx;
    setSelected(WEIGHTS[idx]);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <TouchableOpacity
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          className="bg-black/40"
          activeOpacity={1}
          onPress={onClose}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ backgroundColor: 'transparent' }}
        >
          <View
            className="bg-fill-normal"
            style={{
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              paddingHorizontal: 20,
              paddingTop: 12,
              paddingBottom: insets.bottom + 16,
            }}
          >
            {/* 핸들 바 */}
            <View className="items-center mb-5">
              <View className="bg-fill-stronger" style={{ width: 36, height: 4, borderRadius: 2 }} />
            </View>

            {/* 제목 */}
            <Text
              className="typo-body-2-normal-semi-bold text-label-subtle"
              style={{ marginBottom: 12, letterSpacing: -0.14 }}
            >
              체중
            </Text>

            {/* 드럼롤 피커 */}
            <View style={{ height: ITEM_HEIGHT * VISIBLE_ITEMS, overflow: 'hidden' }}>
              {/* 선택 하이라이트 */}
              <View
                className="bg-fill-stronger"
                style={{
                  position: 'absolute',
                  top: ITEM_HEIGHT * PADDING_COUNT,
                  left: 0,
                  right: 0,
                  height: ITEM_HEIGHT,
                  borderRadius: 8,
                }}
                pointerEvents="none"
              />

              <FlatList
                ref={flatListRef}
                data={DATA}
                keyExtractor={(_, i) => i.toString()}
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate="fast"
                scrollEventThrottle={16}
                extraData={selected}
                getItemLayout={(_, index) => ({
                  length: ITEM_HEIGHT,
                  offset: ITEM_HEIGHT * index,
                  index,
                })}
                onScroll={handleScroll}
                onMomentumScrollEnd={handleScrollEnd}
                onScrollEndDrag={handleScrollEnd}
                renderItem={({ item }) => {
                  if (item === null) return <View style={{ height: ITEM_HEIGHT }} />;
                  const isSelected = item === selected;
                  return (
                    <View
                      style={{
                        height: ITEM_HEIGHT,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text
                        className={isSelected ? 'text-label-normal' : 'text-label-disabled'}
                        style={{
                          fontSize: 16,
                          fontWeight: isSelected ? '600' : '400',
                          letterSpacing: -0.16,
                          width: 36,
                          textAlign: 'center',
                        }}
                      >
                        {String(item).padStart(3, '0')}
                      </Text>
                      <Text
                        className="text-label-normal"
                        style={{
                          fontSize: 16,
                          fontWeight: '400',
                          letterSpacing: -0.16,
                          marginLeft: 6,
                          opacity: isSelected ? 1 : 0,
                        }}
                      >
                        kg
                      </Text>
                    </View>
                  );
                }}
              />

              {/* 상단 그라데이션 */}
              <LinearGradient
                colors={['rgba(255,255,255,1)', 'rgba(255,255,255,0)']}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: ITEM_HEIGHT * PADDING_COUNT,
                  zIndex: 3,
                }}
                pointerEvents="none"
              />
              {/* 하단 그라데이션 */}
              <LinearGradient
                colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: ITEM_HEIGHT * PADDING_COUNT,
                  zIndex: 3,
                }}
                pointerEvents="none"
              />
            </View>

            {/* 저장하기 버튼 */}
            <TouchableOpacity
              className={`items-center justify-center mt-9 mb-9 ${
                isChanged ? 'bg-label-normal' : 'bg-fill-disabled'
              }`}
              style={{ height: 56, borderRadius: 16 }}
              activeOpacity={0.8}
              disabled={!isChanged}
              onPress={() => {
                onSave(`${selected}kg`);
                onClose();
              }}
            >
              <Text
                className={`typo-body-1-normal-semi-bold ${
                  isChanged ? 'text-common-100' : 'text-label-disabled'
                }`}
              >
                저장하기
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
