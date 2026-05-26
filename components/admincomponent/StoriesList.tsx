import { fetchWithAuth } from "@/lib/fetchWithAuth";
import StoriCard from "./StoriCard";

export default async function StoriesList() {
  const res = await fetchWithAuth("/stories/adminstories");
  const data = await res.json();
  type Stori = {
    stori_id: string;
    title: string;
    subtitle: string;
    excerpt: string;
    cover_image: string;
    reading_time: string;
    status: string;
    created_at: string;
  };
  const stories: Stori[] = data.stories ?? [];

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
      {stories.map((stori) => {
        return <StoriCard stori={stori} key={stori.stori_id}></StoriCard>;
      })}
    </div>
  );
}
