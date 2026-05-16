import AnimatedIconGrid from "@/app/landing/Animatedicongrid";
import { inter, nunito } from "@/lib/font";

export default function AboutSection() {
  return (
    <div
      style={{
        padding: 30,
        borderRadius: 20,
        width: "95%",
        display: "grid",
        // stacks to 1 column on small screens, 2 columns on wider screens
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: 40,
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
      {/* Left: text content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <h1
          style={{
            color: "#000000",
            fontSize: "clamp(1.25rem, 3vw, 1.875rem)",
            fontWeight: 800,
            fontFamily: nunito.style.fontFamily,
          }}
        >
          Na your Korner
        </h1>
        <p
          style={{
            color: "#767575",
            fontSize: "0.9375rem",
            fontWeight: 500,
            fontFamily: inter.style.fontFamily,
          }}
        >
          We write — you grab popcorn and read. It's your corner. It's your
          breather from all the campus buzz — the banters, the gist, the
          overload. Here, we slow things down and gist like friends who get it.
          Korner is where we share stories and talk about what really matters —
          love life, deadlines, broke moments, dreams, and everything in between
        </p>
      </div>

      {/* Right: animated icon grid */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <AnimatedIconGrid />
      </div>
    </div>
  );
}
