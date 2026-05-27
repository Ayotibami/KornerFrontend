"use server";

import { fetchWithAuth } from "@/lib/fetchWithAuth";

export type StoriBlock = {
  blockId: string;
  blockType: string;
  content: string;
  image_url: string;
  position: number;
};

export type StoriDetail = {
  title: string;
  subtitle: string;
  excerpt: string;
  readingTime: string;
  coverImage: string;
  status: string;
  blocks: StoriBlock[];
};

export async function getStori(storiId: string): Promise<StoriDetail | null> {
  try {
    const res = await fetchWithAuth(`/stories/adminstori/${storiId}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.stori ?? null;
  } catch {
    return null;
  }
}

// Placeholder — backend endpoint not yet built.
// Logs the payload so you can verify the shape is correct when you're ready to wire it up.
export async function updateStori(
  storiId: string,
  title: string,
  subtitle: string,
  excerpt: string,
  reading_time: string,
  cover_image: string | null,
  stori_blocks: {
    block_type: string;
    content: string;
    image_url: string;
    position: number;
  }[],
) {
  console.log("updateStori →", {
    storiId,
    title,
    subtitle,
    excerpt,
    reading_time,
    cover_image,
    stori_blocks: stori_blocks.map((b) => ({
      block_type: b.block_type,
      content: b.content,
      image_url: b.image_url,
      position: b.position,
    })),
  });
}
