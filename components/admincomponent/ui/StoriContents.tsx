import React from "react";
import StoriContent from "./StoriContent";
import { Trash } from "lucide-react";

export default function StoriContents({
  contents,
  mode,
  editContent,
  deleteContent,
  updateImage,
}) {
  return contents.map((content) => {
    return (
      <div
        style={{
          display: "flex",
          gap: 5,
          alignItems: "center",
        }}
        key={content.id}
      >
        <StoriContent
          content={content}
          mode={mode}
          editContent={editContent}
          updateImage={updateImage}
        ></StoriContent>
        {mode == "write" && (
          <Trash
            onClick={() => deleteContent(content.position)}
            style={{ cursor: "pointer" }}
            size={20}
            color="#E5533D"
            className="transition-all duration-300 hover:scale-95 active:scale-90"
          ></Trash>
        )}
      </div>
    );
  });
}
