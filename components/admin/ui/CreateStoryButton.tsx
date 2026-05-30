// Feather icon link in the Navbar that navigates to the create story page.
// Uses a feather icon (✒) to suggest writing/authoring — fits the "stories" theme.

import { FeatherIcon } from "lucide-react";
import Link from "next/link";

export default function CreateStoryButton() {
  return (
    <Link href="/admin/stories/create" aria-label="Create new story" className="text-primary">
      <FeatherIcon size={28} />
    </Link>
  );
}
