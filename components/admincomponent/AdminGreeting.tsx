import React from "react";
export default function AdminGreeting({ name }) {
  const greetings = ["Hello", "Wassup", "How far", "Hi", "Halo", "Konnichiwa"];
  const randomGreeting = (greetings: string[]) =>
    greetings[Math.floor(Math.random() * greetings.length)];
  return (
    <p
      style={{
        fontSize: "1rem",
        fontWeight: "bold",
      }}
    >
      {randomGreeting(greetings)}, {name}
      <span
        style={{
          fontSize: 30,
        }}
        className="custom-shake"
      >
        👋
      </span>
    </p>
  );
}
