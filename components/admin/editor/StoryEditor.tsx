"use client";

// StoryEditor — renders the full list of content blocks.
// Behaves differently in write vs read mode:
//
// Read mode: clean presentation — just the blocks stacked with gap-6.
//   No drag handles, no insert rows, no delete buttons.
//
// Write mode: drag-and-drop reordering via @dnd-kit/sortable, plus insert
//   rows between blocks and a trash icon on each block.
//
// Drag handle UX:
//   Only the GripVertical icon triggers a drag — the rest of each block
//   (content area, image uploader, etc.) is untouched so it scrolls and
//   interacts normally on mobile. A 5px activation distance prevents an
//   accidental tap from being misread as a drag gesture.

import { Fragment } from "react";
import { GripVertical, Trash } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import EditorBlock from "./EditorBlock";
import BlockControls from "./BlockControls";
import type { EditorBlock as BlockData } from "@/context/StoryEditorContext";
import type { BlockType } from "@/types/story";

// ── Sortable block row ────────────────────────────────────────────────────
// Wraps one block with the dnd-kit sortable hook and renders the grip handle
// on the left and trash icon on the right alongside the block content.

function SortableBlock({
  block,
  onUpdate,
  onImageUpload,
  onDelete,
  onImageFilePicked,
}: {
  block: BlockData;
  onUpdate: (pos: number, value: string) => void;
  onImageUpload: (pos: number, url: string) => void;
  onDelete: (pos: number) => void;
  onImageFilePicked: (blockId: string, file: File) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        // z-index elevation while dragging so the block floats above others
        zIndex: isDragging ? 10 : undefined,
        position: "relative",
      }}
      className="flex gap-2 items-start"
    >
      {/* ── Drag handle ──────────────────────────────────────────────────────
          Only this element carries the dnd-kit listeners so the rest of the
          block row scrolls and interacts normally on touch screens.
          touch-none stops the browser from intercepting touch events here so
          dnd-kit receives them directly for smooth mobile dragging. */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
        className="flex-shrink-0 mt-3.5 text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 cursor-grab active:cursor-grabbing transition-colors touch-none"
      >
        <GripVertical size={18} />
      </button>

      <div className="flex-1">
        <EditorBlock
          block={block}
          mode="write"
          onChange={(val) => onUpdate(block.position, val)}
          onImageUpload={(url) => onImageUpload(block.position, url)}
          onImageFilePicked={(file) => onImageFilePicked(block.id, file)}
        />
      </div>

      <Trash
        onClick={() => onDelete(block.position)}
        size={18}
        className="text-[#E5533D] cursor-pointer flex-shrink-0 mt-3.5 transition-transform duration-300 hover:scale-95 active:scale-90"
      />
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────

export default function StoryEditor({
  blocks,
  mode,
  onUpdate,
  onImageUpload,
  onDelete,
  onInsert,
  onMove,
  onImageFilePicked,
}: {
  blocks: BlockData[];
  mode: "write" | "read";
  onUpdate: (pos: number, value: string) => void;
  onImageUpload: (pos: number, url: string) => void;
  onDelete: (pos: number) => void;
  onInsert: (type: BlockType, atPosition: number) => void;
  onMove: (activeId: string, overId: string) => void;
  onImageFilePicked: (blockId: string, file: File) => void;
}) {
  // Activation distance of 5px prevents a tap from being misread as a drag
  // — the pointer must move 5px before dnd-kit treats it as a drag gesture.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      onMove(active.id as string, over.id as string);
    }
  };

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
            onImageFilePicked={(file) => onImageFilePicked(block.id, file)}
          />
        ))}
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={blocks.map((b) => b.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col">
          {/* Insert row above the first block */}
          <BlockControls onInsert={(type) => onInsert(type, 1)} />

          {blocks.map((block) => (
            <Fragment key={block.id}>
              <SortableBlock
                block={block}
                onUpdate={onUpdate}
                onImageUpload={onImageUpload}
                onDelete={onDelete}
                onImageFilePicked={onImageFilePicked}
              />
              {/* Insert row after each block */}
              <BlockControls onInsert={(type) => onInsert(type, block.position + 1)} />
            </Fragment>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
