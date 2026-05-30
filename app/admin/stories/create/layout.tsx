// Layout for the create story page.
// Wraps the page in StoryEditorProvider so the page component and all editor
// sub-components can access the shared editor state via useStoryEditor().
//
// The same provider is used for the edit page ([storiId]/layout.tsx),
// so both pages share the exact same context shape and editor components.

import StoryEditorProvider from "@/context/StoryEditorContext";
import type { ReactNode } from "react";

export default function CreateLayout({ children }: { children: ReactNode }) {
  return <StoryEditorProvider>{children}</StoryEditorProvider>;
}
