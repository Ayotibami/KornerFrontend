// These types mirror the shapes returned by the backend API.
// Import from here — never type things inline in components.

// The four content block types the story editor supports.
// Maps to how blocks are stored in the database.
export type BlockType = "heading" | "paragraph" | "quote" | "image";

// A single content block inside a story.
// `position` is 1-based and controls rendering order.
// `content` holds HTML for rich-text blocks (paragraph, quote, heading).
// `image_url` holds the Cloudinary URL for image blocks; empty string otherwise.
export type Block = {
  id: string;
  block_type: BlockType;
  content: string;
  image_url: string;
  position: number;
};

// Shape returned by the stories list endpoint (/stories/adminstories).
// Used to render story cards on the home page.
export type Story = {
  stori_id: string;
  title: string;
  subtitle: string;
  excerpt: string;
  cover_image: string;
  reading_time: string;
  status: "Draft" | "Pending" | "Published";
  created_at: string; // ISO date string — formatted via formatDate() in lib/utils
};

// Shape returned when fetching a single story for editing (/stories/adminstori/:id).
// Extends Story with its blocks so the editor can seed itself with existing content.
export type StoryDetail = Story & {
  stori_blocks: Block[];
};
