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
  created_at: string;
  updated_at: string;
  views: number;
};

// Shape returned when fetching a single story for editing (/stories/adminstori/:id).
// Extends Story with its blocks so the editor can seed itself with existing content.
export type StoryDetail = Story & {
  stori_blocks: Block[];
};

// Shape consumed by MasterStoryCard — used for both the "all admins" list
// (/master/stories, which sets admin_name/avatar_url since the card needs to
// show who wrote what) and contexts where the author is already known from
// the page itself, like "only mine" or "this one specific admin" (which omit
// them — MasterStoryCard only renders the author row when they're present).
// is_own_story is always required: it's what decides whether clicking Publish
// needs the "are you sure, this isn't yours" confirmation, so every caller
// must set it explicitly rather than leaving it to an assumed default.
export type MasterStory = Story & {
  admin_id?: string;
  admin_name?: string;
  avatar_url?: string;
  is_own_story: boolean;
};

// Shape returned by the public, unauthenticated listing endpoint
// (/stories/public) — the reader-facing site's story grid.
export type PublicStorySummary = {
  stori_id: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  cover_image: string;
  reading_time: string;
  created_at: string;
  views: number;
  author_name: string;
  author_avatar: string;
};

// Shape returned by the public, unauthenticated single-story endpoint
// (/stories/public/:storiId) — adds the author's bio and the content blocks
// needed to actually render the story body.
export type PublicStoryDetail = PublicStorySummary & {
  author_bio: string | null;
  blocks: Block[];
};
