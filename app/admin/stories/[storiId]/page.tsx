import StoriImage from "@/components/ui/StoriImage";
import Title from "@/components/ui/Title";
import { cookies } from "next/headers";
import React from "react";

export default async function page({
  params,
}: {
  params: { storiId: string };
}) {
  const { storiId } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value || "";

  const res = await fetch(
    `http://localhost:3000/api/v1/stories/adminstori/${storiId}`,
    {
      method: "GET",
      headers: {
        Cookie: `session=${token}`,
      },
    }
  );
  const data = await res.json();
  const stori = data.stori; // Log the response data
  console.log(data, "lion");

  return (
    <div>
      <Title title={stori.title}></Title>
    </div>
  );
}
