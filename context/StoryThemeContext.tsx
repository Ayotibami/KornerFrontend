"use client";

import { createContext, useContext, useState } from "react";

type StoryTheme = { dark: boolean; toggle: () => void };

const StoryThemeContext = createContext<StoryTheme>({ dark: false, toggle: () => {} });

export function StoryThemeProvider({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(false);
  return (
    <StoryThemeContext.Provider value={{ dark, toggle: () => setDark((d) => !d) }}>
      {children}
    </StoryThemeContext.Provider>
  );
}

export const useStoryTheme = () => useContext(StoryThemeContext);
