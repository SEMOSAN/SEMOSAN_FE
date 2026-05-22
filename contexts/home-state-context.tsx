import { createContext, useContext, useState, type ReactNode } from 'react';
import { useSharedValue, type SharedValue } from 'react-native-reanimated';

export type TabBarVariant = "light" | "dark";

type HomeStateContextValue = {
  hasRecords: boolean;
  toggleHasRecords: () => void;
  tabBarVariant: TabBarVariant;
  setTabBarVariant: (variant: TabBarVariant) => void;
  tabProgress: SharedValue<number>;
};

const HomeStateContext = createContext<HomeStateContextValue>({
  hasRecords: true,
  toggleHasRecords: () => {},
  tabBarVariant: "light",
  setTabBarVariant: () => {},
  tabProgress: { value: 0 } as SharedValue<number>,
});

export function HomeStateProvider({ children }: { children: ReactNode }) {
  const [hasRecords, setHasRecords] = useState(true);
  const [tabBarVariant, setTabBarVariant] = useState<TabBarVariant>("light");
  const tabProgress = useSharedValue(0);
  return (
    <HomeStateContext.Provider
      value={{
        hasRecords,
        toggleHasRecords: () => setHasRecords((v) => !v),
        tabBarVariant,
        setTabBarVariant,
        tabProgress,
      }}
    >
      {children}
    </HomeStateContext.Provider>
  );
}

export function useHomeStateContext() {
  return useContext(HomeStateContext);
}
