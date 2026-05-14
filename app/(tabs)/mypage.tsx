import { useEffect, useRef, useState } from 'react';
import { Alert, Platform, ScrollView, Text, TouchableOpacity } from 'react-native';

import { LiveActivity } from '@/modules/live-activity';

export default function MyScreen() {
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
    const { requireOptionalNativeModule } = require('expo-modules-core');
    const mod = requireOptionalNativeModule('LiveActivityModule');
    if (!mod) {
      Alert.alert('모듈 없음', 'LiveActivityModule이 null이야. ExpoModulesProvider 등록 필요.');
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
    LiveActivity.update({ elapsedSeconds: elapsed, isRunning: false, mode: 'course' });
  };

  const resume = () => {
    setIsRunning(true);
    timerRef.current = setInterval(tick, 1000);
    LiveActivity.update({ elapsedSeconds: elapsed, isRunning: true, mode: 'course' });
  };

  const stop = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setIsRunning(false);
    setActivityId(null);
    setElapsed(0);
    await LiveActivity.stop();
  };

  const h = String(Math.floor(elapsed / 3600)).padStart(2, '0');
  const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
  const s = String(elapsed % 60).padStart(2, '0');

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#1A1B1F' }}
      contentContainerStyle={{ padding: 24, paddingTop: 80, gap: 12 }}>
      <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700', marginBottom: 16 }}>
        Live Activity 테스트
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
        marginBottom: 8,
      }}>
      <Text style={{ color: '#1A1B1F', fontWeight: '700', fontSize: 16 }}>{label}</Text>
    </TouchableOpacity>
  );
}
