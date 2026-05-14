import { useEffect, useRef, useState } from 'react';
import { Alert, NativeModules, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { LiveActivity } from '@/modules/live-activity';

export default function LiveActivityTestScreen() {
  const [activityId, setActivityId] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const tick = () => {
    setElapsed((prev) => {
      const next = prev + 1;
      LiveActivity.update({
        elapsedSeconds: next,
        isRunning: true,
        mode: 'course',
        remainingMinutes: Math.max(0, 30 - Math.floor(next / 60)),
        remainingMeters: Math.max(0, 500 - next * 2),
        progress: Math.min(next / 300, 1),
      });
      return next;
    });
  };

  const startCourse = async () => {
    if (!NativeModules.LiveActivityModule) {
      Alert.alert('모듈 없음', 'LiveActivityModule이 네이티브에 등록되지 않았습니다.\nXcode에서 LiveActivityModule.swift, LiveActivityModule.m 파일이 semosan 타겟에 포함되어 있는지 확인하세요.');
      return;
    }
    try {
      const id = await LiveActivity.start({
        mode: 'course',
        remainingMinutes: 30,
        remainingMeters: 500,
        progress: 0,
      });
      setActivityId(id);
      setElapsed(0);
      setIsRunning(true);
      timerRef.current = setInterval(tick, 1000);
    } catch (e: any) {
      Alert.alert('오류', e.message ?? String(e));
    }
  };

  const startFree = async () => {
    if (!NativeModules.LiveActivityModule) {
      Alert.alert('모듈 없음', 'LiveActivityModule이 네이티브에 등록되지 않았습니다.\nXcode에서 LiveActivityModule.swift, LiveActivityModule.m 파일이 semosan 타겟에 포함되어 있는지 확인하세요.');
      return;
    }
    try {
      const id = await LiveActivity.start({ mode: 'free' });
      setActivityId(id);
      setElapsed(0);
      setIsRunning(true);
      timerRef.current = setInterval(tick, 1000);
    } catch (e: any) {
      Alert.alert('오류', e.message ?? String(e));
    }
  };

  const pause = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setIsRunning(false);
    LiveActivity.update({
      elapsedSeconds: elapsed,
      isRunning: false,
      mode: 'course',
    });
  };

  const resume = () => {
    setIsRunning(true);
    timerRef.current = setInterval(tick, 1000);
    LiveActivity.update({
      elapsedSeconds: elapsed,
      isRunning: true,
      mode: 'course',
    });
  };

  const stop = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setIsRunning(false);
    setActivityId(null);
    setElapsed(0);
    await LiveActivity.stop();
  };

  if (Platform.OS !== 'ios') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#fff' }}>iOS 전용 테스트</Text>
      </View>
    );
  }

  const h = String(Math.floor(elapsed / 3600)).padStart(2, '0');
  const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
  const s = String(elapsed % 60).padStart(2, '0');

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#1A1B1F' }}
      contentContainerStyle={{ padding: 24, paddingTop: 80, gap: 12 }}>
      <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700', marginBottom: 8 }}>
        Live Activity 테스트
      </Text>

      <Text style={{ color: NativeModules.LiveActivityModule ? '#00D864' : '#EF4444', fontSize: 12, marginBottom: 8 }}>
        모듈: {NativeModules.LiveActivityModule ? '✓ 연결됨' : '✗ 없음 (네이티브 모듈 미등록)'}
      </Text>

      <Text style={{ color: '#00D864', fontSize: 32, fontWeight: '700', textAlign: 'center', marginBottom: 16 }}>
        {h}:{m}:{s}
      </Text>

      {!activityId ? (
        <>
          <Btn label="코스 따라가기 시작" onPress={startCourse} color="#00D864" />
          <Btn label="자유 기록하기 시작" onPress={startFree} color="#4ADE80" />
        </>
      ) : (
        <>
          {isRunning ? (
            <Btn label="일시정지" onPress={pause} color="#F59E0B" />
          ) : (
            <Btn label="재개" onPress={resume} color="#00D864" />
          )}
          <Btn label="종료" onPress={stop} color="#EF4444" />
        </>
      )}

      {activityId && (
        <Text style={{ color: '#ffffff50', fontSize: 11, marginTop: 8 }}>
          Activity ID: {activityId}
        </Text>
      )}
    </ScrollView>
  );
}

function Btn({ label, onPress, color }: { label: string; onPress: () => void; color: string }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: color,
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
      }}>
      <Text style={{ color: '#1A1B1F', fontWeight: '700', fontSize: 16 }}>{label}</Text>
    </TouchableOpacity>
  );
}
