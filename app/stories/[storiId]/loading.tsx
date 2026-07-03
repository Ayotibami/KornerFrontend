export default function StoriLoading() {
  return (
    <div
      style={{
        display: "flex",
        padding: 20,
        flexDirection: "column",
        backgroundColor: "white",
        alignItems: "center",
        gap: 20,
        minHeight: "100vh",
      }}
    >
      {/* Back button placeholder */}
      <div style={{ width: "100%", maxWidth: 680 }}>
        <div
          className="animate-pulse"
          style={{ height: 14, width: 100, backgroundColor: "#e2e8f0", borderRadius: 6 }}
        />
      </div>

      {/* Cover skeleton — matches StoriCover dimensions */}
      <div
        className="animate-pulse"
        style={{
          width: "100%",
          maxWidth: 680,
          height: "clamp(320px, 55vw, 480px)",
          backgroundColor: "#1e293b",
          borderRadius: "clamp(16px, 4vw, 36px)",
        }}
      />

      {/* Body text — a few paragraphs worth of lines */}
      <div
        style={{
          width: "100%",
          maxWidth: 680,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {[100, 90, 95, 80, 100, 85, 70].map((w, i) => (
          <div
            key={i}
            className="animate-pulse"
            style={{
              height: 14,
              width: `${w}%`,
              backgroundColor: "#e2e8f0",
              borderRadius: 6,
            }}
          />
        ))}

        {/* Second paragraph block */}
        <div style={{ height: 24 }} />
        {[100, 88, 92, 75, 98].map((w, i) => (
          <div
            key={i}
            className="animate-pulse"
            style={{
              height: 14,
              width: `${w}%`,
              backgroundColor: "#e2e8f0",
              borderRadius: 6,
            }}
          />
        ))}

        {/* Third block */}
        <div style={{ height: 24 }} />
        {[100, 82, 96, 65].map((w, i) => (
          <div
            key={i}
            className="animate-pulse"
            style={{
              height: 14,
              width: `${w}%`,
              backgroundColor: "#e2e8f0",
              borderRadius: 6,
            }}
          />
        ))}
      </div>

      {/* Author bio skeleton */}
      <div
        style={{
          width: "100%",
          maxWidth: 680,
          display: "flex",
          gap: 12,
          alignItems: "flex-start",
          paddingTop: 24,
          marginTop: 8,
          borderTop: "1px solid #f1f5f9",
        }}
      >
        <div
          className="animate-pulse"
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            backgroundColor: "#e2e8f0",
            flexShrink: 0,
          }}
        />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
          <div
            className="animate-pulse"
            style={{ height: 14, backgroundColor: "#e2e8f0", borderRadius: 6, width: "40%" }}
          />
          <div
            className="animate-pulse"
            style={{ height: 12, backgroundColor: "#f1f5f9", borderRadius: 6 }}
          />
          <div
            className="animate-pulse"
            style={{ height: 12, backgroundColor: "#f1f5f9", borderRadius: 6, width: "80%" }}
          />
        </div>
      </div>
    </div>
  );
}
