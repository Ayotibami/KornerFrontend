// Layout for the edit story page.
// Same as create/layout.tsx — wraps the page in StoryEditorProvider so
// EditStoryEditor and all editor sub-components share the same context state.

import StoryEditorProvider from "@/context/StoryEditorContext";
import type { ReactNode } from "react";

export default function StoriLayout({ children }: { children: ReactNode }) {
  return <StoryEditorProvider>{children}</StoryEditorProvider>;
}
