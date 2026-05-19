import { Text, TouchableOpacity, View } from "react-native";
import { ModalSheet } from "@/components/modal-sheet";
import {
  PermissionBellIcon,
  PermissionCameraIcon,
  PermissionImageIcon,
  PermissionLocationIcon,
} from "@/components/icons/permission-icons";

type Props = {
  visible: boolean;
  onConfirm: () => void;
};

type PermissionItem = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

const REQUIRED: PermissionItem[] = [
  {
    icon: <PermissionLocationIcon size={48} />,
    title: "위치",
    description: "현 위치 표시, 주변 정보 및 경로 안내",
  },
];

const OPTIONAL: PermissionItem[] = [
  {
    icon: <PermissionBellIcon size={48} />,
    title: "알림",
    description: "공지 및 이벤트, 트래킹 시 상황에 맞는 알림",
  },
  {
    icon: <PermissionCameraIcon size={48} />,
    title: "카메라",
    description: "트래킹 시 사진 촬영",
  },
  {
    icon: <PermissionImageIcon size={48} />,
    title: "사진 보관함",
    description: "클라이브, 포토리포트 저장",
  },
];

export function PermissionBottomSheet({ visible, onConfirm }: Props) {
  return (
    <ModalSheet visible={visible} onDismiss={onConfirm}>
      <View className="px-5 pt-3 gap-6">
        <Text className="typo-heading-1-semi-bold text-label-normal">
          {"원활한 SEMOSAN 사용을 위해\n아래 권한을 허용해주세요."}
        </Text>

        <View className="gap-4">
          <Text className="typo-body-1-normal-semi-bold text-label-subtle">필수 접근 권한</Text>
          {REQUIRED.map((item) => (
            <PermissionRow key={item.title} item={item} />
          ))}
        </View>

        <View className="gap-4">
          <Text className="typo-body-1-normal-semi-bold text-label-subtle">선택적 접근 권한</Text>
          {OPTIONAL.map((item) => (
            <PermissionRow key={item.title} item={item} />
          ))}
        </View>
      </View>

      <View className="px-5 pt-8">
        <TouchableOpacity
          className="h-12 bg-label-normal rounded-[10px] items-center justify-center"
          onPress={onConfirm}
          activeOpacity={0.8}
        >
          <Text className="typo-label-large text-label-normal-inverse">확인</Text>
        </TouchableOpacity>
      </View>
    </ModalSheet>
  );
}

function PermissionRow({ item }: { item: PermissionItem }) {
  return (
    <View className="flex-row items-center gap-3">
      {item.icon}
      <View className="flex-1 gap-0.5">
        <Text className="typo-body-2-normal-semi-bold text-label-normal">{item.title}</Text>
        <Text className="typo-caption-1-regular text-label-subtler">{item.description}</Text>
      </View>
    </View>
  );
}
