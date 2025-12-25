import React from "react";
import StoriInput from "./StoriInput";

export default function Excerpt({ mode, placeholder, excerpt, setExcerpt }) {
  return (
    mode == "write" && (
      <StoriInput
        mode={mode}
        placeholder={placeholder}
        value={excerpt}
        onChange={setExcerpt}
      ></StoriInput>
    )
  );
}
