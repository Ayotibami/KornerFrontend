// Master-only stories list — three scopes, three endpoints, same rendering:
//   "all"   -> /master/stories               (every story, every admin)
//   "mine"  -> /stories/adminstories          (just the logged-in master's own)
//   "admin" -> /master/admins/:adminId/stories (one specific other admin's)
// Whichever scope, it renders through MasterStoryCard. "mine" and "admin"
// both come from endpoints with no admin_name/avatar_url, so the author row
// on the card stays hidden for those — is_own_story is true only for "mine"
// (every row genuinely is), false for "admin" (viewing someone else's).
//
// This used to be two separate components (MasterStoriesList + MyStoriesList)
// — merged once the only real difference came down to "which endpoint" and
// "is_own_story already true vs computed per-row," since duplicating the
// grid/empty-state JSX for that wasn't worth it. "admin" scope is the same
// reasoning extended one step further.

import { apiRequest } from "@/lib/api";
import MasterStoryCard from "./MasterStoryCard";
import StoriesEmptyState from "./StoriesEmptyState";
import type { MasterStory, Story } from "@/types/story";

export default async function MasterStoriesList({
  status,
  scope = "all",
  adminId,
}: {
  status?: string;
  scope?: "all" | "mine" | "admin";
  adminId?: string;
}) {
  const endpoint =
    scope === "mine"
      ? "/stories/adminstories"
      : scope === "admin"
        ? `/master/admins/${adminId}/stories`
        : "/master/stories";
  const res = await apiRequest(endpoint);
  const data = await res.json();

  const allStories: MasterStory[] =
    scope === "all"
      ? (data.stories as MasterStory[] ?? [])
      : (data.stories as Story[] ?? []).map((s) => ({ ...s, is_own_story: scope === "mine" }));

  const stories = status
    ? allStories.filter((s) => s.status === status)
    : allStories;

  if (stories.length === 0) return <StoriesEmptyState status={status} hasAnyStories={allStories.length > 0} />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 p-3 sm:p-4 w-full">
      {stories.map((story) => (
        <MasterStoryCard story={story} key={story.stori_id} />
      ))}
    </div>
  );
}
