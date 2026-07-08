"use client";

import { nunito } from "@/lib/font";
import { useStoryTheme } from "@/context/StoryThemeContext";

export default function OtherStoriesHeading() {
  const { dark } = useStoryTheme();
  return (
    <h2
      style={{
        fontFamily: nunito.style.fontFamily,
        fontSize: "clamp(1.3rem, 4vw, 2rem)",
        fontWeight: 800,
        color: dark ? "#ccd6f6" : "#0f1e3d",
        margin: 0,
        textAlign: "center",
        transition: "color 0.45s ease",
      }}
    >
      You no go like see other Stories?
    </h2>
  );
}
