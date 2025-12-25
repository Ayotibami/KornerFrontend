import { primaryColor } from "@/app/constants/color";
import { Quote, QuoteIcon } from "lucide-react";
import React from "react";
import StoriImage from "./StoriImage";

export default function StoriContent({
  content,
  mode,
  editContent,
  updateImage,
}) {
  if (content.block_type == "heading") {
    return (
      <HeadingBlock
        content={content}
        mode={mode}
        editContent={editContent}
      ></HeadingBlock>
    );
  } else if (content.block_type == "quote") {
    return (
      <QuoteBlock
        content={content}
        mode={mode}
        editContent={editContent}
      ></QuoteBlock>
    );
  } else if (content.block_type == "paragraph") {
    return (
      <ParagraphBlock
        content={content}
        mode={mode}
        editContent={editContent}
      ></ParagraphBlock>
    );
  } else if (content.block_type == "image") {
    return (
      <ImageBlock
        mode={mode}
        content={content}
        updateImage={updateImage}
      ></ImageBlock>
    );
  }
}

const HeadingBlock = ({ content, mode, editContent }) => {
  if (mode == "write") {
    return (
      <input
        type="text"
        style={{
          borderWidth: 1.5,
          borderRadius: 10,
          borderColor: primaryColor,
          padding: 20,
          width: "100%",
        }}
        placeholder="Heading go dey here"
        value={content.content}
        onChange={(e) => editContent(content.position, e.target.value)}
      />
    );
  }
  return (
    <h2 style={{ fontWeight: "bold", fontSize: 30 }}>
      {content.content || "Default Heading"}
    </h2>
  );
};

const QuoteBlock = ({ content, mode, editContent }) => {
  if (mode == "write") {
    return (
      <textarea
        style={{
          height: "150px",
          width: "100%",
          borderWidth: 1.5,
          borderRadius: 10,
          borderColor: primaryColor,
          padding: 20,
        }}
        value={content.content}
        onChange={(e) => editContent(content.position, e.target.value)}
        placeholder="Quote na here"
      ></textarea>
    );
  }
  return (
    <p
      style={{
        color: "#0E3E87",
      }}
    >
      <Quote size={40}></Quote>
      <span
        style={{
          fontStyle: "italic",
        }}
      >
        {" "}
        {content.content || "Default Quote"}
      </span>
    </p>
  );
};

const ParagraphBlock = ({ content, mode, editContent }) => {
  if (mode == "write") {
    return (
      <textarea
        style={{
          height: "150px",
          width: "100%",
          borderWidth: 1.5,
          borderColor: primaryColor,
          padding: 20,
          borderRadius: 10,
        }}
        placeholder="Write paragraph for this box"
        value={content.content}
        onChange={(e) => editContent(content.position, e.target.value)}
      />
    );
  }
  return (
    <p
      style={{
        textAlign: "justify",
      }}
    >
      {content.content || "Default Paragraph"}
    </p>
  );
};

const ImageBlock = ({ mode, content, updateImage }) => {
  return (
    <StoriImage
      mode={mode}
      content={content}
      updateImage={updateImage}
    ></StoriImage>
  );
};
