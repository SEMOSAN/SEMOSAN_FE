import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
      <View style={styles.content}>
        <Text style={styles.title}>
          {"원활한 SEMOSAN 사용을 위해\n아래 권한을 허용해주세요."}
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>필수 접근 권한</Text>
          {REQUIRED.map((item) => (
            <PermissionRow key={item.title} item={item} />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>선택적 접근 권한</Text>
          {OPTIONAL.map((item) => (
            <PermissionRow key={item.title} item={item} />
          ))}
        </View>
      </View>

      <View style={styles.btnWrap}>
        <TouchableOpacity
          style={styles.confirmBtn}
          onPress={onConfirm}
          activeOpacity={0.8}
        >
          <Text style={styles.confirmBtnText}>확인</Text>
        </TouchableOpacity>
      </View>
    </ModalSheet>
  );
}

function PermissionRow({ item }: { item: PermissionItem }) {
  return (
    <View style={styles.row}>
      {item.icon}
      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>{item.title}</Text>
        <Text style={styles.rowDesc}>{item.description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1A1B1F",
    lineHeight: 28,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#464A57",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1B1F",
  },
  rowDesc: {
    fontSize: 12,
    fontWeight: "400",
    color: "#73798C",
  },
  btnWrap: {
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  confirmBtn: {
    height: 48,
    backgroundColor: "#1A1B1F",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmBtnText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
