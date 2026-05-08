import { createContext, useContext, useState, type ReactNode } from 'react';

type HomeStateContextValue = {
  hasRecords: boolean;
  toggleHasRecords: () => void;
};

const HomeStateContext = createContext<HomeStateContextValue>({
  hasRecords: true,
  toggleHasRecords: () => {},
});

export function HomeStateProvider({ children }: { children: ReactNode }) {
  const [hasRecords, setHasRecords] = useState(true);
  return (
    <HomeStateContext.Provider value={{ hasRecords, toggleHasRecords: () => setHasRecords((v) => !v) }}>
      {children}
    </HomeStateContext.Provider>
  );
}

export function useHomeStateContext() {
  return useContext(HomeStateContext);
}
