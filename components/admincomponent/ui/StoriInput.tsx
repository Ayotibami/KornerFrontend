import { primaryColor } from "@/app/constants/color";
import React from "react";

export default function StoriInput({ mode, placeholder, value, onChange }) {
  return (
    <div
      style={{
        borderColor: primaryColor,
        borderWidth: 1.4,

        width: "50%",
      }}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange && onChange(e.target.value);
        }}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "10px 15px",
        }}
      />
    </div>
  );
}
