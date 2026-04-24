import * as AppleAuthentication from 'expo-apple-authentication';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function LoginScreen() {
  const [identityToken, setIdentityToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<{
    user: string;
    email: string | null;
    fullName: string | null;
  } | null>(null);

  const handleAppleLogin = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      setIdentityToken(credential.identityToken);
      setUserInfo({
        user: credential.user,
        email: credential.email,
        fullName: credential.fullName
          ? `${credential.fullName.givenName ?? ''} ${credential.fullName.familyName ?? ''}`.trim()
          : null,
      });
    } catch (error: any) {
      if (error.code !== 'ERR_REQUEST_CANCELED') {
        Alert.alert('로그인 실패', error.message);
      }
    }
  };

  const copyToClipboard = async () => {
    if (!identityToken) return;
    const { setStringAsync } = await import('expo-clipboard');
    await setStringAsync(identityToken);
    Alert.alert('복사 완료', 'Identity Token이 클립보드에 복사됐어요.');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Apple 로그인 테스트</Text>
      <Text style={styles.subtitle}>백엔드 테스트용 Identity Token 발급</Text>

      {!identityToken ? (
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
          cornerRadius={12}
          style={styles.appleButton}
          onPress={handleAppleLogin}
        />
      ) : (
        <View style={styles.resultContainer}>
          <Text style={styles.sectionLabel}>사용자 정보</Text>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>User ID: {userInfo?.user}</Text>
            {userInfo?.email && <Text style={styles.infoText}>Email: {userInfo.email}</Text>}
            {userInfo?.fullName && <Text style={styles.infoText}>Name: {userInfo.fullName}</Text>}
          </View>

          <Text style={styles.sectionLabel}>Identity Token</Text>
          <View style={styles.tokenBox}>
            <Text style={styles.tokenText} selectable>{identityToken}</Text>
          </View>

          <Pressable style={styles.copyButton} onPress={copyToClipboard}>
            <Text style={styles.copyButtonText}>클립보드에 복사</Text>
          </Pressable>

          <Pressable style={styles.resetButton} onPress={() => { setIdentityToken(null); setUserInfo(null); }}>
            <Text style={styles.resetButtonText}>다시 로그인</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 8,
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 40,
  },
  appleButton: {
    width: 280,
    height: 50,
  },
  resultContainer: {
    width: '100%',
    gap: 12,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#444',
    marginTop: 8,
  },
  infoBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    gap: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  infoText: {
    fontSize: 13,
    color: '#333',
  },
  tokenBox: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 14,
    maxHeight: 200,
  },
  tokenText: {
    fontSize: 11,
    color: '#00ff88',
    fontFamily: 'Courier',
    lineHeight: 18,
  },
  copyButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  copyButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  resetButton: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#666',
    fontSize: 14,
  },
});
