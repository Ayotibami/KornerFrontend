import Button from "@/components/admincomponent/Button";
import { nunito } from "@/lib/font";

export default function ActivationForm() {
  return (
    <div
      style={{
        backgroundColor: "#0f1e3d",
        width: "95%",
        borderRadius: 20,
        padding: "clamp(24px, 5vw, 60px)",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 40,
        alignItems: "center",
        marginTop: 50,
      }}
    >
      {/* Left: text */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <p
          style={{
            fontFamily: nunito.style.fontFamily,
            fontSize: "clamp(1.25rem, 3vw, 1.875rem)",
            fontWeight: 800,
            color: "white",
          }}
        >
          Korner effect
        </p>
        <p
          style={{
            fontFamily: nunito.style.fontFamily,
            fontSize: "0.9375rem",
            fontWeight: 500,
            color: "#C4C4C4",
            lineHeight: 1.7,
          }}
        >
          Well to be honest we just wanted to give it a fancy name... we do not
          expect you to stay in the Korner 247. Your 8am lectures no go allow
          am — but we do not want you to miss any article we drop in the Korner.
          So subscribe to get notified whenever we drop an article.
        </p>
      </div>

      {/* Right: form */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <input
          placeholder="Full name"
          style={{
            backgroundColor: "white",
            border: "none",
            borderRadius: 14,
            padding: "16px 20px",
            fontSize: "0.9375rem",
            fontFamily: nunito.style.fontFamily,
            color: "#0f1e3d",
            outline: "none",
            width: "100%",
            boxSizing: "border-box",
          }}
        />
        <input
          placeholder="Email"
          type="email"
          style={{
            backgroundColor: "white",
            border: "none",
            borderRadius: 14,
            padding: "16px 20px",
            fontSize: "0.9375rem",
            fontFamily: nunito.style.fontFamily,
            color: "#0f1e3d",
            outline: "none",
            width: "100%",
            boxSizing: "border-box",
          }}
        />
        <div style={{ width: "fit-content" }}>
          <Button>Activate Korner Effect</Button>
        </div>
      </div>
    </div>
  );
}
