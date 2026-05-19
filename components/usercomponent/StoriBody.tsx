import { nunito } from "@/lib/font";
import Image from "next/image";
import { FaQuoteLeft } from "react-icons/fa";

type Block = {
  id: string;
  position: number;
  block_type: "heading" | "paragraph" | "quote" | "image";
  content: string;
  image_url?: string;
};

function HeadingBlock({ content }: { content: string }) {
  return (
    <h2
      style={{
        fontFamily: nunito.style.fontFamily,
        fontSize: "clamp(1.2rem, 3vw, 1.75rem)",
        fontWeight: 800,
        color: "#0f1e3d",
        margin: 0,
        lineHeight: 1.3,
      }}
    >
      {content}
    </h2>
  );
}

function ParagraphBlock({ content }: { content: string }) {
  return (
    <p
      style={{
        fontFamily: nunito.style.fontFamily,
        fontSize: "clamp(0.95rem, 2vw, 1.05rem)",
        fontWeight: 500,
        color: "#374151",
        margin: 0,
        lineHeight: 1.85,
      }}
    >
      {content}
    </p>
  );
}

function QuoteBlock({ content }: { content: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <style>{`
        @keyframes quote-shake {
          0%, 100% { transform: rotate(0deg); }
          15%       { transform: rotate(-8deg); }
          30%       { transform: rotate(8deg); }
          45%       { transform: rotate(-5deg); }
          60%       { transform: rotate(5deg); }
          75%       { transform: rotate(-2deg); }
        }
      `}</style>
      <FaQuoteLeft
        size="clamp(5rem, 12vw, 8rem)"
        color="#112C4A"
        style={{ animation: "quote-shake 2.5s ease-in-out infinite" }}
      />
      <p
        style={{
          fontFamily: nunito.style.fontFamily,
          fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
          fontWeight: 600,
          fontStyle: "italic",
          color: "#112C4A",
          margin: 0,
          lineHeight: 1.7,
        }}
      >
        {content}
      </p>
    </div>
  );
}

function ImageBlock({
  content,
  image_url,
}: {
  content: string;
  image_url?: string;
}) {
  const src = image_url || content;

  return (
    <div
      style={{
        width: "100%",
        aspectRatio: "16/9",
        position: "relative",
        borderRadius: "clamp(8px, 2vw, 16px)",
        overflow: "hidden",
        backgroundColor: "#e2e8f0",
      }}
    >
      {src ? (
        <Image
          src={src}
          alt="Story image"
          fill
          style={{ objectFit: "cover" }}
        />
      ) : null}
    </div>
  );
}

export default function StoriBody({ blocks }: { blocks: Block[] }) {
  if (!blocks || blocks.length === 0) return null;

  const sorted = [...blocks].sort((a, b) => a.position - b.position);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "clamp(16px, 3vw, 28px)",
        padding: "clamp(16px, 4vw, 32px)",
        backgroundColor: "white",
        borderRadius: "clamp(16px, 4vw, 24px)",
        width: "100%",
      }}
    >
      {sorted.map((block) => {
        if (block.block_type === "heading")
          return <HeadingBlock key={block.id} content={block.content} />;
        if (block.block_type === "paragraph")
          return <ParagraphBlock key={block.id} content={block.content} />;
        if (block.block_type === "quote")
          return <QuoteBlock key={block.id} content={block.content} />;
        if (block.block_type === "image")
          return (
            <ImageBlock
              key={block.id}
              content={block.content}
              image_url={block.image_url}
            />
          );
        return null;
      })}
    </div>
  );
}
