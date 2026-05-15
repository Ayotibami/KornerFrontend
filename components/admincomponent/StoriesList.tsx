import { cookies } from "next/headers";
import React from "react";
import StoriCard from "./StoriCard";
import { log } from "node:console";

export default async function StoriesList() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value || "";
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/stories/adminstories`,
    {
      method: "GET",
      headers: {
        Cookie: `session=${token}`,
      },
    },
  );
  const data = await res.json();
  const stories: [] = data.stories;

  return (
    <div
      style={{
        display: "grid",
        gap: 16,
        gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
        width: "100%",
        height: "100%",
        padding: 10,
      }}
    >
      {stories.map((stori, index) => {
        return <StoriCard stori={stori} key={stori.stori_id}></StoriCard>;
      })}
    </div>
  );
}
