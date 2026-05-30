// StoryEditor — renders the full list of content blocks.
// Behaves differently in write vs read mode:
//
// Read mode: clean presentation — just the blocks stacked with gap-6.
//   No insert rows, no delete buttons. Used for previewing the story.
//
// Write mode: each block is wrapped in a row with:
//   - The block itself (flex-1, takes all available width)
//   - A red trash icon on the right to delete the block
//   - A BlockControls insert row BEFORE the first block and AFTER each block
//     so new blocks can be inserted at any position in the list.
//
// Position arithmetic for BlockControls:
//   The insert row before block N calls onInsert(type, N.position)
//   which pushes block N and everything after it up by 1 (see insertBlock in context).
//   The insert row AFTER block N calls onInsert(type, N.position + 1).

import { Fragment } from "react";
import { Trash } from "lucide-react";
import EditorBlock from "./EditorBlock";
import BlockControls from "./BlockControls";
import type { EditorBlock as BlockData } from "@/context/StoryEditorContext";
import type { BlockType } from "@/types/story";

export default function StoryEditor({
  blocks,
  mode,
  onUpdate,
  onImageUpload,
  onDelete,
  onInsert,
  onUploadStart,
  onUploadEnd,
}: {
  blocks: BlockData[];
  mode: "write" | "read";
  onUpdate: (pos: number, value: string) => void;
  onImageUpload: (pos: number, url: string) => void;
  onDelete: (pos: number) => void;
  onInsert: (type: BlockType, atPosition: number) => void;
  onUploadStart: () => void;
  onUploadEnd: () => void;
}) {
  if (mode !== "write") {
    return (
      <div className="flex flex-col gap-6">
        {blocks.map((block) => (
          <EditorBlock
            key={block.id}
            block={block}
            mode={mode}
            onChange={(val) => onUpdate(block.position, val)}
            onImageUpload={(url) => onImageUpload(block.position, url)}
            onUploadStart={onUploadStart}
            onUploadEnd={onUploadEnd}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Insert row above the first block — handles inserting at position 1,
          and also gives the empty-editor state a place to add the first block. */}
      <BlockControls onInsert={(type) => onInsert(type, 1)} />

      {blocks.map((block) => (
        <Fragment key={block.id}>
          <div className="flex gap-2 items-start">
            <div className="flex-1">
              <EditorBlock
                block={block}
                mode={mode}
                onChange={(val) => onUpdate(block.position, val)}
                onImageUpload={(url) => onImageUpload(block.position, url)}
                onUploadStart={onUploadStart}
                onUploadEnd={onUploadEnd}
              />
            </div>
            {/* Trash icon — mt-3.5 aligns it with the top of most block inputs */}
            <Trash
              onClick={() => onDelete(block.position)}
              size={18}
              className="text-[#E5533D] cursor-pointer flex-shrink-0 mt-3.5 transition-transform duration-300 hover:scale-95 active:scale-90"
            />
          </div>
          {/* Insert row after this block */}
          <BlockControls onInsert={(type) => onInsert(type, block.position + 1)} />
        </Fragment>
      ))}
    </div>
  );
}
