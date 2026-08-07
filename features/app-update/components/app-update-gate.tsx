import Constants from "expo-constants";
import {
  Linking,
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAppVersion } from "../hooks/use-app-version";
import { compareVersion } from "../utils/compare-version";

const OVERLAY_COLOR = "rgba(0,0,0,0.4)";

/**
 * 앱 버전/점검 상태를 확인해 필요 시 전체 화면을 막는 게이트.
 * 우선순위: 점검(maintenance) > 강제 업데이트 > 없음.
 * 강제 업데이트 조건: 현재 버전 < minimumVersion, 또는 forceUpdate && 현재 < latestVersion.
 */
export function AppUpdateGate() {
  const { data } = useAppVersion();
  const platform = Platform.OS === "ios" ? data?.ios : data?.android;
  if (!platform) return null;

  const current = Constants.expoConfig?.version ?? "1.0.0";

  if (platform.maintenanceMode) {
    return (
      <BlockingModal
        title="서비스 점검 중이에요"
        message={
          platform.maintenanceMessage ??
          "더 나은 서비스를 위해 점검하고 있어요.\n잠시 후 다시 이용해주세요."
        }
      />
    );
  }

  const belowMinimum =
    !!platform.minimumVersion &&
    compareVersion(current, platform.minimumVersion) < 0;
  const forced =
    platform.forceUpdate === true &&
    !!platform.latestVersion &&
    compareVersion(current, platform.latestVersion) < 0;

  if (belowMinimum || forced) {
    return (
      <BlockingModal
        title="업데이트가 필요해요"
        message={
          platform.releaseNotes ??
          "원활한 이용을 위해 최신 버전으로 업데이트해주세요."
        }
        actionLabel="업데이트하기"
        onAction={() => {
          if (platform.storeUrl) {
            Linking.openURL(platform.storeUrl).catch(() => {});
          }
        }}
      />
    );
  }

  return null;
}

type BlockingModalProps = {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

function BlockingModal({
  title,
  message,
  actionLabel,
  onAction,
}: BlockingModalProps) {
  return (
    <Modal visible transparent animationType="fade" onRequestClose={() => {}}>
      <View
        className="flex-1 items-center justify-center px-4"
        style={{ backgroundColor: OVERLAY_COLOR }}
      >
        <View
          className="w-full bg-fill-normal"
          style={{ maxWidth: 320, borderRadius: 16 }}
        >
          <View className="px-5 pb-2 pt-6">
            <Text className="text-label-normal typo-heading-1-semi-bold">
              {title}
            </Text>
          </View>
          <View className="px-5 pb-5">
            <Text className="text-label-subtle typo-body-1-normal-regular">
              {message}
            </Text>
          </View>
          {actionLabel && (
            <View className="px-4 pb-4">
              <TouchableOpacity
                className="items-center justify-center rounded-[10px] bg-primary-normal"
                style={{ height: 48 }}
                onPress={onAction}
              >
                <Text className="text-common-100 typo-label-large">
                  {actionLabel}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}
