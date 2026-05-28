"use server";

import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { redirect } from "next/navigation";

export default async function CreateStori(
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
): Promise<{ error: string } | void> {
  try {
    const res = await fetchWithAuth("/stories/create", {
      method: "POST",
      body: JSON.stringify({
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
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { error: data?.message ?? `Request failed (${res.status})` };
    }
  } catch (error) {
    console.log("Create Story Error:", error);
    return { error: "Something went wrong. Please try again." };
  }

  redirect("/admin/home");
}
