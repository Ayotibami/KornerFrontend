import { fetchWithAuth } from "@/lib/fetchWithAuth";
import Image from "next/image";
import { Clock, QuoteIcon } from "lucide-react";
import { primaryColor, secondaryColor } from "@/app/constants/color";

export default async function page({
  params,
}: {
  params: Promise<{ storiId: string }>;
}) {
  const { storiId } = await params;

  const res = await fetchWithAuth(`/stories/adminstori/${storiId}`);
  if (!res.ok) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "#6B7280" }}>
        Story could not be loaded.
      </div>
    );
  }

  const data = await res.json();
  const stori = data.stori;

  if (!stori) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "#6B7280" }}>
        Story not found.
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        maxWidth: 800,
        margin: "0 auto",
        padding: "40px 20px",
        gap: 24,
      }}
    >
      {stori.coverImage && (
        <div
          style={{
            position: "relative",
            width: "100%",
            height: 400,
            borderRadius: 20,
            overflow: "hidden",
          }}
        >
          <Image
            src={stori.coverImage}
            alt="Cover"
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Clock size={14} color="#6B7280" />
        <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>
          {stori.readingTme}
        </p>
        <span
          style={{
            marginLeft: 8,
            padding: "3px 10px",
            borderRadius: 12,
            fontSize: 12,
            backgroundColor: stori.status === "Draft" ? secondaryColor : primaryColor,
            color: stori.status === "Draft" ? "#0E3E87" : "white",
          }}
        >
          {stori.status}
        </span>
      </div>

      <h1 style={{ fontSize: 40, fontWeight: "bold", margin: 0 }}>
        {stori.title}
      </h1>

      {stori.subtitle && (
        <p style={{ fontSize: 18, color: "#6B7280", margin: 0 }}>
          {stori.subtitle}
        </p>
      )}

      {stori.excerpt && (
        <p
          style={{
            fontSize: 15,
            fontStyle: "italic",
            color: "#9CA3AF",
            margin: 0,
          }}
        >
          {stori.excerpt}
        </p>
      )}

      <hr style={{ borderColor: "#E5E7EB" }} />

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {(stori.blocks ?? []).sort((a: { position: number }, b: { position: number }) => a.position - b.position).map(
          (
            block: { blockId: string; blockType: string; content: string; imageUrl: string; position: number },
            index: number,
          ) => {
            if (block.blockType === "heading") {
              return (
                <h2
                  key={block.blockId ?? index}
                  style={{ fontSize: 28, fontWeight: "bold", margin: 0 }}
                >
                  {block.content}
                </h2>
              );
            }
            if (block.blockType === "paragraph") {
              return (
                <p
                  key={block.blockId ?? index}
                  style={{
                    fontSize: 16,
                    lineHeight: 1.8,
                    textAlign: "justify",
                    margin: 0,
                  }}
                >
                  {block.content}
                </p>
              );
            }
            if (block.blockType === "quote") {
              return (
                <div
                  key={block.blockId ?? index}
                  style={{ borderLeft: `4px solid ${primaryColor}`, paddingLeft: 20 }}
                >
                  <QuoteIcon size={24} color={primaryColor} />
                  <p
                    style={{ fontStyle: "italic", color: "#0E3E87", margin: 0 }}
                  >
                    {block.content}
                  </p>
                </div>
              );
            }
            if (block.blockType === "image" && block.imageUrl) {
              return (
                <div
                  key={block.blockId ?? index}
                  style={{
                    position: "relative",
                    width: "100%",
                    height: 400,
                    borderRadius: 12,
                    overflow: "hidden",
                  }}
                >
                  <Image
                    src={block.imageUrl}
                    alt="Story image"
                    fill
                    style={{ objectFit: "contain" }}
                  />
                </div>
              );
            }
            return null;
          },
        )}
      </div>
    </div>
  );
}
