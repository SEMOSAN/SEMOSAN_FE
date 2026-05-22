import { PermissionBottomSheet } from "@/components/permission-bottom-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { requestForegroundPermissionsAsync } from "expo-location";
import { useEffect, useState } from "react";

export function LocationPermissionSheet(): JSX.Element {
  const [visible, setVisible] = useState(false);

  async function requestLocation(): Promise<void> {
    await requestForegroundPermissionsAsync();
  }

  async function handleConfirm(): Promise<void> {
    const { status } = await requestForegroundPermissionsAsync();
    if (status !== "granted") return;

    AsyncStorage.setItem("permission_sheet_shown", "true");
    setVisible(false);
    requestLocation();
  }

  useEffect(() => {
    AsyncStorage.getItem("permission_sheet_shown").then((val) => {
      if (!val) {
        setVisible(true);
      } else {
        requestLocation();
      }
    });
  }, []);

  return <PermissionBottomSheet visible={visible} onConfirm={handleConfirm} />;
}
