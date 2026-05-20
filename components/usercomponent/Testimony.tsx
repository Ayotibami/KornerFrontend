import { nunito } from "@/lib/font";

export default function Testimony() {
  return (
    // Two-column layout matching AboutSection — text left, visual right.
    // auto-fit collapses to 1 column on mobile.
    // The right column is a placeholder — real testimonial visuals come later.
    <div
      style={{
        backgroundColor: "white",
        width: "95%",
        padding: 30,
        borderRadius: 20,
        marginTop: 50,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 40,
        alignItems: "center",
      }}
    >
      {/* Left: heading + subtext */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <p
          style={{
            fontFamily: nunito.style.fontFamily,
            fontSize: "clamp(1.25rem, 3vw, 1.875rem)",
            fontWeight: 800,
            color: "#000000",
          }}
        >
          You no go like Korner ke?
        </p>
        <p
          style={{
            fontFamily: nunito.style.fontFamily,
            fontWeight: 500,
            fontSize: "0.9375rem",
            color: "#767575",
          }}
        >
          Yesss, you no go like am sef — you go love am! 💥 We go lie for you?
          We would never do such a thing.
        </p>
      </div>

      {/* Right: visual placeholder — replace with real testimonial cards/carousel */}
      <div
        style={{
          backgroundColor: "#f1f5f9",
          borderRadius: 16,
          minHeight: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: "#aaa", fontFamily: nunito.style.fontFamily, fontSize: "0.9rem" }}>
          Visual coming soon
        </p>
      </div>
    </div>
  );
}
