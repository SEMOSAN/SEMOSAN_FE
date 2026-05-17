import { createContext, useContext, useState, type ReactNode } from 'react';

export type TabBarVariant = "light" | "dark";

type HomeStateContextValue = {
  hasRecords: boolean;
  toggleHasRecords: () => void;
  tabBarVariant: TabBarVariant;
  setTabBarVariant: (variant: TabBarVariant) => void;
};

const HomeStateContext = createContext<HomeStateContextValue>({
  hasRecords: true,
  toggleHasRecords: () => {},
  tabBarVariant: "light",
  setTabBarVariant: () => {},
});

export function HomeStateProvider({ children }: { children: ReactNode }) {
  const [hasRecords, setHasRecords] = useState(true);
  const [tabBarVariant, setTabBarVariant] = useState<TabBarVariant>("light");
  return (
    <HomeStateContext.Provider
      value={{
        hasRecords,
        toggleHasRecords: () => setHasRecords((v) => !v),
        tabBarVariant,
        setTabBarVariant,
      }}
    >
      {children}
    </HomeStateContext.Provider>
  );
}

export function useHomeStateContext() {
  return useContext(HomeStateContext);
}
