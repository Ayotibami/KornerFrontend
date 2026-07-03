import Navbar from "@/components/usercomponent/Navbar";

const CARD_COUNT = 6;

export default function StoriesLoading() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#f1f5f9",
        minHeight: "100vh",
      }}
    >
      <Navbar />

      {/* Hero placeholder — matches StoriesHero full-screen */}
      <div
        className="animate-pulse w-full"
        style={{ height: "100vh", backgroundColor: "#0f1e3d" }}
      />

      {/* Mascot placeholder */}
      <div
        className="animate-pulse rounded-full"
        style={{
          width: "clamp(220px, 55vw, 520px)",
          aspectRatio: "1 / 1",
          backgroundColor: "#e2e8f0",
          marginTop: 16,
        }}
      />

      {/* Caption placeholder */}
      <div
        className="animate-pulse"
        style={{
          height: 14,
          width: 220,
          backgroundColor: "#e2e8f0",
          borderRadius: 8,
          marginTop: 12,
        }}
      />

      {/* Card grid section — dark background matches TornSection */}
      <div style={{ width: "100%", backgroundColor: "#1e293b", padding: "60px 20px" }}>
        {/* "Pick one na" heading placeholder */}
        <div
          className="animate-pulse"
          style={{
            height: 28,
            width: 240,
            backgroundColor: "rgba(255,255,255,0.08)",
            borderRadius: 8,
            margin: "0 auto 40px",
          }}
        />

        {/* Grid matching StoriCardList layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(clamp(250px, 30%, 400px), 1fr))",
            gap: 30,
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          {Array.from({ length: CARD_COUNT }).map((_, i) => (
            <div
              key={i}
              style={{
                height: 500,
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                overflow: "hidden",
                backgroundColor: "white",
                boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
              }}
            >
              {/* Cover image area — 55% of card height */}
              <div
                className="animate-pulse"
                style={{ height: "55%", backgroundColor: "#e2e8f0" }}
              />

              {/* Text content area — 45% */}
              <div
                style={{
                  height: "45%",
                  padding: 14,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: 10,
                }}
              >
                <div
                  className="animate-pulse"
                  style={{ height: 16, backgroundColor: "#e2e8f0", borderRadius: 6 }}
                />
                <div
                  className="animate-pulse"
                  style={{ height: 12, backgroundColor: "#f1f5f9", borderRadius: 6, width: "75%" }}
                />
                <div
                  className="animate-pulse"
                  style={{ height: 12, backgroundColor: "#f1f5f9", borderRadius: 6, width: "55%" }}
                />

                {/* Author row */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 8,
                  }}
                >
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <div
                      className="animate-pulse"
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        backgroundColor: "#e2e8f0",
                        flexShrink: 0,
                      }}
                    />
                    <div
                      className="animate-pulse"
                      style={{ height: 10, width: 72, backgroundColor: "#e2e8f0", borderRadius: 6 }}
                    />
                  </div>
                  <div
                    className="animate-pulse"
                    style={{ height: 10, width: 56, backgroundColor: "#e2e8f0", borderRadius: 6 }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
