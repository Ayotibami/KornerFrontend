"use server";

import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { redirect } from "next/navigation";

const CreateStori = async (
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
) => {
  let success = false;
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
          blockType: b.block_type,
          content: b.content,
          imageUrl: b.image_url,
          position: b.position,
        })),
      }),
    });
    const data = await res.json();
    console.log(data);
    if (data.success) {
      success = true;
    }
  } catch (error) {
    success = false;
    console.log("Create Story Error:", error);
  }
  if (success) {
    redirect("/admin/home");
  }
};
export default CreateStori;
