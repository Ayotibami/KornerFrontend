// Master-only stories list — three scopes, three endpoints, same rendering:
//   "all"   -> /master/stories               (every story, every admin)
//   "mine"  -> /stories/adminstories          (just the logged-in master's own)
//   "admin" -> /master/admins/:adminId/stories (one specific other admin's)
// Status filtering and pagination are both handled server-side via query params.

import { apiRequest } from "@/lib/api";
import MasterStoriesGrid from "./MasterStoriesGrid";
import Pagination from "@/components/admin/Pagination";
import StoriesEmptyState from "./StoriesEmptyState";
import type { MasterStory, Story } from "@/types/story";

const PAGE_SIZE = 20;

export default async function MasterStoriesList({
  status,
  search,
  scope = "all",
  adminId,
  page = 1,
  buildHref,
}: {
  status?: string;
  search?: string;
  scope?: "all" | "mine" | "admin";
  adminId?: string;
  page?: number;
  buildHref: (page: number) => string;
}) {
  const offset = (page - 1) * PAGE_SIZE;

  const qp = new URLSearchParams({ limit: String(PAGE_SIZE), offset: String(offset) });
  if (status) qp.set("status", status);
  if (search) qp.set("search", search);

  const endpoint =
    scope === "mine"
      ? `/stories/adminstories?${qp}`
      : scope === "admin"
        ? `/master/admins/${adminId}/stories?${qp}`
        : `/master/stories?${qp}`;

  const res = await apiRequest(endpoint);
  const data = await res.json();

  const stories: MasterStory[] =
    scope === "all"
      ? (data.stories as MasterStory[] ?? [])
      : (data.stories as Story[] ?? []).map((s) => ({ ...s, is_own_story: scope === "mine" }));

  const total: number = data.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  if (stories.length === 0) return <StoriesEmptyState status={status} hasAnyStories={false} />;

  return (
    <>
      <MasterStoriesGrid key={status ?? "Draft"} stories={stories} status={status ?? "Draft"} />
      <Pagination currentPage={page} totalPages={totalPages} buildHref={buildHref} />
    </>
  );
}
