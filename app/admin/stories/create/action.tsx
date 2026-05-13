"use server";

import { log } from "console";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const CreateStori = async (
  title,
  subtitle,
  excerpt,
  reading_time,
  cover_image,
  stori_blocks,
) => {
  let success = false;
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value || "";
  try {
    const res = await fetch("http://localhost:3000/api/v1/stories/create", {
      method: "POST",
      body: JSON.stringify({
        title,
        subtitle,
        excerpt,
        reading_time,
        cover_image,
        stori_blocks,
      }),
      credentials: "include",
      headers: {
        Cookie: `session=${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    if (data.success) {
      success = true;
      console.log("====================================");
      console.log("mf");
      console.log("====================================");
    }
    console.log("response", data);
  } catch (error) {
    success = false;
    console.error("Create Story Error:", error);
  }
  if (success) {
    redirect("/admin/home");
  }
};
export default CreateStori;
