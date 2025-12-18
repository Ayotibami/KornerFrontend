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
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        // backgroundColor: "red",
        display: "flex",
        flexDirection: "column",
        gap: 5,
      }}
    >
      <label htmlFor="">{label}</label>
      {label == "Avatar" && (
        <input
          type="file"
          name="avatar"
          placeholder="avatar"
          style={{
            height: 100,
            width: 100,
            borderRadius: 50,
            borderColor: "#165ABF",
            borderWidth: 2,
          }}
        />
      )}
      {label !== "Avatar" && (
        <input
          type={type}
          name={name}
          style={{
            width: "50%",

            outline: "none",
            padding: "15px 10px",
            borderRadius: 30,
            borderColor: "#165ABF",
            borderWidth: 3,
          }}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        ></input>
      )}
    </div>
  );
}
