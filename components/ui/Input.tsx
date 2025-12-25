"use client";
import React from "react";

export default function Input({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
}: any) {
  return (
    <div
      style={{
        justifyContent: "center",
        // backgroundColor: "red",
        display: "flex",
        flexDirection: "column",
        gap: 5,
      }}
    >
      <label htmlFor="">{label}</label>

      <input
        type={type}
        name={name}
        style={{
          outline: "none",
          padding: "15px 10px",
          borderRadius: 30,
          borderColor: "#165ABF",
          borderWidth: 3,
          // backgroundColor: "yellow",
        }}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      ></input>
    </div>
  );
}
