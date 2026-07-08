"use client";

import { useStoryTheme } from "@/context/StoryThemeContext";

export default function StoriPageShell({ children }: { children: React.ReactNode }) {
  const { dark } = useStoryTheme();

  return (
    <>
      <style>{`
        @keyframes dm-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
      <div
        style={{
          display: "flex",
          padding: 20,
          flexDirection: "column",
          backgroundColor: dark ? "#060d1b" : "white",
          alignItems: "center",
          gap: 20,
          transition: "background-color 0.45s ease",
          minHeight: "100vh",
        }}
      >
        {children}
      </div>
    </>
  );
}
