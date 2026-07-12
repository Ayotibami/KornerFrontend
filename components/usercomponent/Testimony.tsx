import { nunito } from "@/lib/font";
import Freeform from "./Freeform";
import SocialProof from "./SocialProof";

export default function Testimony() {
  return (
    <div
      style={{
        backgroundColor: "white",
        width: "95%",
        padding: 30,
        borderRadius: 20,
        marginTop: 50,
        display: "flex",
        flexDirection: "column",
        gap: 40,
      }}
    >
      {/* Heading — full width above everything */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <p
          style={{
            fontFamily: nunito.style.fontFamily,
            fontSize: "clamp(1.25rem, 3vw, 1.875rem)",
            fontWeight: 800,
            color: "#000000",
            margin: 0,
          }}
        >
          You no go like Korner ke?
        </p>
      </div>

      {/* Word cloud + text beside it */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 40,
          alignItems: "center",
        }}
      >
        <Freeform />

        {/* Text column beside the word cloud */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
            padding: "8px 0",
          }}
        >
          {/* Eyebrow */}
          <span
            style={{
              fontFamily: nunito.style.fontFamily,
              fontSize: "0.75rem",
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase" as const,
              color: "#0f1e3d",
              opacity: 0.4,
            }}
          >
            More than the vibes
          </span>

          {/* Hook */}
          <p
            style={{
              fontFamily: nunito.style.fontFamily,
              fontSize: "clamp(0.9rem, 1.8vw, 1rem)",
              fontWeight: 600,
              color: "#0f1e3d",
              margin: 0,
              lineHeight: 1.75,
            }}
          >
            Korner isn&apos;t just about the vibes, drama, and fun stories from
            your student life — let&apos;s be honest for a second, we want this
            to add real value too. We want to help your whole life as a student,
            which is the main goal. Abi na?
          </p>

          {/* Value list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              "Get better grades",
              "Level up your academic game",
              "Manage your finances",
              "Balance the chaos of school life with your personal life",
              "Help you get better with your school culture and community",
              "Prepare you for life after school",
            ].map((item) => (
              <div
                key={item}
                style={{ display: "flex", alignItems: "center", gap: 12 }}
              >
                <div
                  style={{
                    width: 18,
                    height: 2.5,
                    backgroundColor: "#0f1e3d",
                    flexShrink: 0,
                    borderRadius: 2,
                  }}
                />
                <p
                  style={{
                    fontFamily: nunito.style.fontFamily,
                    fontSize: "clamp(0.875rem, 1.8vw, 0.9375rem)",
                    fontWeight: 600,
                    color: "#767575",
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  {item}
                </p>
              </div>
            ))}
          </div>

          {/* Punchline */}
          <p
            style={{
              fontFamily: nunito.style.fontFamily,
              fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
              fontWeight: 900,
              color: "#0f1e3d",
              margin: 0,
              lineHeight: 1.4,
              paddingTop: 6,
            }}
          >
            So you no go just like it — you go love am.
          </p>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, backgroundColor: "#f0f0f0" }} />

      {/* Bottom: animated social proof copy */}
      <SocialProof />
    </div>
  );
}
