import React from "react";
import StoriInput from "./StoriInput";

export default function ReadTime({ mode, placeholder, readTime, setReadTime }) {
  return mode == "write" ? (
    <StoriInput
      mode={mode}
      placeholder={placeholder}
      value={readTime}
      onChange={setReadTime}
    ></StoriInput>
  ) : (
    <p
      style={{
        fontSize: 12,
      }}
    >
      Reading time{" "}
      <span
        style={{
          fontSize: 14,
          fontWeight: "bold",
          display: "inline-block",
        }}
      >
        •
      </span>
      {" " + readTime}
    </p>
  );
}
