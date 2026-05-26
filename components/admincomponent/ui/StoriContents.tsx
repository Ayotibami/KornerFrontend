import React from "react";
import { Trash } from "lucide-react";
import StoriContent from "./StoriContent";
import InsertBlockRow from "./InsertBlockRow";
import type { ContentBlock } from "@/context/CreateStoriContext";

export default function StoriContents({
  contents,
  mode,
  editContent,
  deleteContent,
  updateImage,
  onInsert,
}: {
  contents: ContentBlock[];
  mode: string;
  editContent: (pos: number, value: string) => void;
  deleteContent: (pos: number) => void;
  updateImage: (pos: number, url: string) => void;
  onInsert: (type: string, atPosition: number) => void;
}) {
  // In read/preview mode — clean render, no insert rows or delete buttons
  if (mode !== "write") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {contents.map((content) => (
          <StoriContent
            key={content.id}
            content={content}
            mode={mode}
            editContent={editContent}
            updateImage={updateImage}
          />
        ))}
      </div>
    );
  }

  // In write mode — interleave insert rows between every block.
  // The first InsertBlockRow (before any block) also handles the empty state.
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* Insert row at the very top — inserts before block 1 */}
      <InsertBlockRow onInsert={(type) => onInsert(type, 1)} />

      {contents.map((content) => (
        <React.Fragment key={content.id}>
          {/* Block row: content + delete button */}
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <StoriContent
                content={content}
                mode={mode}
                editContent={editContent}
                updateImage={updateImage}
              />
            </div>
            <Trash
              onClick={() => deleteContent(content.position)}
              size={18}
              color="#E5533D"
              style={{ cursor: "pointer", flexShrink: 0, marginTop: 14 }}
              className="transition-all duration-300 hover:scale-95 active:scale-90"
            />
          </div>

          {/* Insert row after this block */}
          <InsertBlockRow
            onInsert={(type) => onInsert(type, content.position + 1)}
          />
        </React.Fragment>
      ))}
    </div>
  );
}
