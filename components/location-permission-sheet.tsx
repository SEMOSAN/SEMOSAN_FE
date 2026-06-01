import { PermissionBottomSheet } from "@/components/permission-bottom-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { requestForegroundPermissionsAsync } from "expo-location";
import { useEffect, useState } from "react";

export function LocationPermissionSheet() {
  const [visible, setVisible] = useState(false);

  async function requestLocation(): Promise<void> {
    await requestForegroundPermissionsAsync();
  }

  async function handleConfirm(): Promise<void> {
    await requestForegroundPermissionsAsync();
    AsyncStorage.setItem("permission_sheet_shown", "true");
    setVisible(false);
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
