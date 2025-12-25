import React from "react";
import StoriInput from "./StoriInput";
export default function Title({
  mode,
  placeholder,
  title,
  setTitle,
}: {
  mode: string;
  placeholder: string;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
}) {
  return mode == "write" ? (
    <StoriInput
      mode={mode}
      placeholder={placeholder}
      value={title}
      onChange={setTitle}
    ></StoriInput>
  ) : (
    <h1
      style={{
        fontSize: 40,
        fontWeight: "bold",
      }}
    >
      {title || "Title goes here"}
    </h1>
  );
}
