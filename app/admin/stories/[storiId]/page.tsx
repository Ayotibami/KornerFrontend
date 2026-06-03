// Edit story page — server component.
// Fetches the story on the server before sending HTML to the browser.
//
// Why server component instead of fetching in useEffect on the client?
//   Server-side fetch means the page arrives fully populated — no loading spinner,
//   no layout shift. Next.js also handles the 404 case cleanly via notFound().
//
// The server component fetches the data, then passes it as props to EditStoryEditor
// (a client component) which seeds the context and handles user interactions.
// This pattern is called "passing server data to a client component as props."

import { notFound } from "next/navigation";
import { getStori } from "./action";
import EditStoryEditor from "./EditStoryEditor";

export default async function StoriPage({
  params,
}: {
  params: Promise<{ storiId: string }>;
}) {
  const { storiId } = await params;
  const stori = await getStori(storiId);
  console.log(stori?.blocks, "from backend");

  // getStori returns null on 404 — notFound() renders the nearest not-found.tsx.
  if (!stori) notFound();

  return <EditStoryEditor stori={stori} storiId={storiId} />;
}
