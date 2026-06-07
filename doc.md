# Korner Frontend — Full Codebase Documentation

> **Living document.** Update this file whenever a component, route, type, or pattern changes.
> A new developer or maintainer should be able to understand every part of the codebase from this file alone.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Folder Structure](#3-folder-structure)
4. [Styling System](#4-styling-system)
5. [Authentication & Middleware](#5-authentication--middleware)
6. [Data Types](#6-data-types)
7. [API Layer](#7-api-layer)
8. [Image Uploads (Cloudinary)](#8-image-uploads-cloudinary)
9. [Utility Functions](#9-utility-functions)
10. [Story Editor Context](#10-story-editor-context)
11. [UI Components](#11-ui-components)
12. [Admin Components](#12-admin-components)
13. [Editor Components](#13-editor-components)
14. [Routes & Pages](#14-routes--pages)
15. [Server Actions Pattern](#15-server-actions-pattern)
16. [Public Pages](#16-public-pages)
17. [Key Patterns & Decisions](#17-key-patterns--decisions)

---

## 1. Project Overview

**Korner** is a content platform. This repository is the **Next.js frontend** for the admin panel — the interface where admins write, edit, and manage stories.

The public-facing site (where readers see stories) also lives in this repo under `app/` and `components/usercomponent/`.

**What the admin panel does:**
- Login / signup for admin accounts
- View stories in a grid — Draft view by default, toggle to Published
- Create a new story with a rich block-based editor
- Edit an existing story
- Logout

---

## 2. Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Next.js | 15+ (App Router) | Framework — routing, server components, server actions |
| React | 19+ | UI rendering |
| TypeScript | 5+ | Type safety |
| Tailwind CSS | v4 | Styling (CSS-first config, no `tailwind.config.ts`) |
| TipTap | 2.x | Rich text editor (built on ProseMirror) |
| Cloudinary | (direct API) | Image hosting and CDN |
| Sonner | latest | Toast notifications |
| date-fns | latest | Relative date formatting |
| Lucide React | latest | Icon library |
| react-icons/fa | latest | `FaQuoteLeft` (Lucide has no quote icon) |

---

## 3. Folder Structure

```
kornerfrontend/
├── app/
│   ├── admin/
│   │   ├── (auth)/                  # Auth route group — login & signup
│   │   │   ├── layout.tsx           # Redirects logged-in users away from auth pages
│   │   │   ├── login/
│   │   │   │   ├── page.tsx         # Login form (client component)
│   │   │   │   └── actions.tsx      # login() server action
│   │   │   └── signUp/
│   │   │       ├── page.tsx         # Signup form (client component)
│   │   │       └── actions.tsx      # signUp() server action
│   │   ├── home/
│   │   │   ├── layout.tsx           # Wraps all home content with Navbar
│   │   │   ├── page.tsx             # Stories grid — Draft by default, toggles to Published
│   │   │   ├── action.tsx           # getProfile() — fetches admin profile for Navbar
│   │   │   ├── loading.tsx          # Loading skeleton
│   │   │   └── error.tsx            # Error boundary for this route
│   │   ├── logout/
│   │   │   └── action.ts            # logout() — deletes cookie, redirects to login
│   │   └── stories/
│   │       ├── create/
│   │       │   ├── layout.tsx       # Wraps page in StoryEditorProvider
│   │       │   ├── page.tsx         # Create story page (client component)
│   │       │   └── action.tsx       # createStory() server action
│   │       └── [storiId]/
│   │           ├── layout.tsx       # Wraps page in StoryEditorProvider
│   │           ├── page.tsx         # Edit story page (server component — fetches data)
│   │           ├── EditStoryEditor.tsx  # Edit story UI (client component)
│   │           └── action.tsx       # getStori(), updateStory() server actions
│   ├── stories/                     # Public story listing (user-facing)
│   ├── layout.tsx                   # Root layout (fonts, Toaster)
│   └── globals.css                  # Tailwind v4 theme + custom utilities
├── components/
│   ├── admin/                       # Admin-specific components
│   │   ├── ui/                      # Reusable UI primitives
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── AuthCard.tsx
│   │   │   ├── AuthBranding.tsx
│   │   │   ├── AvatarPicker.tsx
│   │   │   ├── Avatar.tsx
│   │   │   ├── LogoutButton.tsx
│   │   │   └── CreateStoryButton.tsx
│   │   ├── editor/                  # Story editor building blocks
│   │   │   ├── RichTextEditor.tsx   # TipTap wrapper
│   │   │   ├── CoverImage.tsx       # Full-width cover image with upload
│   │   │   ├── ImageUploader.tsx    # Inline image block with upload
│   │   │   ├── EditorBlock.tsx      # Renders one block (routes by block_type)
│   │   │   ├── BlockControls.tsx    # Insert row between blocks
│   │   │   ├── StoryEditor.tsx      # Full block list (write + read mode)
│   │   │   └── MetaFields.tsx       # Title, SubTitle, Excerpt, ReadTime inputs
│   │   ├── stories/                 # Stories grid components
│   │   │   ├── StoryCard.tsx        # Individual story card
│   │   │   ├── StoriesList.tsx      # Grid of story cards (server component)
│   │   │   └── FilterBar.tsx        # Draft / Published filter buttons
│   │   ├── AdminGreeting.tsx        # "Hi, [name]" greeting in Navbar
│   │   └── Navbar.tsx               # Fixed top navigation bar
│   ├── admincomponent/              # LEGACY — kept for public pages only
│   │   ├── Button.tsx               # Used by app/page.tsx and stories/page.tsx
│   │   ├── HeroText.tsx             # Used by app/stories/page.tsx
│   │   ├── Tornsection.tsx          # Used by app/stories/page.tsx
│   │   └── FloatingCards.tsx        # Used by usercomponent/HeroSection.tsx
│   └── usercomponent/               # Public-facing page components
├── context/
│   └── StoryEditorContext.tsx       # Shared state for the story editor
├── constants/
│   └── theme.ts                     # PRIMARY and SECONDARY hex color values
├── lib/
│   ├── api.ts                       # apiRequest() — central authenticated fetch
│   ├── cloudinary.ts                # uploadToCloudinary() — direct browser upload
│   ├── font.ts                      # Nunito font definition
│   ├── utils.ts                     # formatDate(), capitalize()
│   └── validation.ts                # validatePassword()
├── middleware.ts                    # Route protection for /admin/*
├── types/
│   ├── story.ts                     # Block, Story, StoryDetail types
│   ├── api.ts                       # ApiResult<T> discriminated union
│   └── admin.ts                     # AdminProfile type
└── doc.md                           # ← You are here
```

---

## 4. Styling System

### Tailwind CSS v4

This project uses **Tailwind v4**, which is configured entirely in CSS — there is no `tailwind.config.ts`.

All configuration lives in [`app/globals.css`](app/globals.css):

```css
@import "tailwindcss";

/* Overrides Tailwind's default dark mode (prefers-color-scheme) with class-based dark mode.
   This makes all `dark:` classes activate when the `dark` class is on <html>.
   MUST use @custom-variant (not @variant) — @variant does not override the dark strategy. */
@custom-variant dark (&:where(.dark, .dark *));

/* Tells Tailwind to scan the full project root for class names.
   Without this, Tailwind only scans the app/ directory (where globals.css lives)
   and misses all classes used in components/, context/, etc. */
@source "../";

@theme {
  --color-primary: #165ABF;      /* brand blue */
  --color-secondary: #B4CFF6;    /* light blue */
  --font-nunito: var(--font-nunito);
}
```

The `@layer utilities` block below it provides **explicit fallback definitions** for the custom color utilities. This guarantees `bg-primary`, `text-primary`, etc. always work — even if Tailwind's scan misses a file:

```css
@layer utilities {
  .bg-primary    { background-color: var(--color-primary); }
  .bg-secondary  { background-color: var(--color-secondary); }
  .text-primary  { color: var(--color-primary); }
  .text-secondary { color: var(--color-secondary); }
  .border-primary   { border-color: var(--color-primary); }
  .border-secondary { border-color: var(--color-secondary); }
  .font-nunito   { font-family: var(--font-nunito, sans-serif); }
}
```

### Brand Colors

| Name | Hex | Usage |
|---|---|---|
| `primary` | `#165ABF` | Main blue — buttons, borders, text, icons |
| `secondary` | `#B4CFF6` | Light blue — backgrounds, badges, inputs |

**Rule:** Always use Tailwind classes (`bg-primary`, `text-secondary`, etc.) for colors in JSX.
Only use the raw hex values from `constants/theme.ts` where Tailwind classes won't work — SVG `fill` attributes and Lucide `color` props.

### constants/theme.ts

```ts
export const PRIMARY = "#165ABF";
export const SECONDARY = "#B4CFF6";
```

Use these constants only for SVG/icon color props. For everything else, use the Tailwind classes.

### Typography

The project uses the **Nunito** font loaded in `lib/font.ts` via `next/font/google`.
Apply it with the `font-nunito` Tailwind utility class.
The font variable is exposed as `--font-nunito` in the CSS.

### Responsive Sizing

All font sizes and spacing that need to scale smoothly use `clamp()`:

```css
font-size: clamp(min, preferred-viewport-unit, max)
/* Example: clamp(1.5rem, 4vw, 2.5rem) */
```

This replaces breakpoint-based responsive classes for typography — the size grows continuously between min and max as the viewport widens.

---

## 5. Authentication & Middleware

### How authentication works

1. Admin submits login form → `login()` server action POSTs to backend
2. Backend returns a JWT token
3. The action stores the token as an **httpOnly cookie** named `auth_token`
   - `httpOnly: true` — browser JavaScript cannot read this cookie (XSS protection)
   - `secure: true` in production — only sent over HTTPS
   - `maxAge: 86400` — expires after 24 hours
4. Every subsequent request to the backend includes this token via `apiRequest()`

### middleware.ts

Runs on **every request** (except `_next/static`, `_next/image`, `favicon.ico`).

Logic:
- Non-admin routes → pass through (public pages are open)
- `/admin/login` and `/admin/signUp` → pass through (these are the unauthenticated entry points)
- Any other `/admin/*` route without `auth_token` cookie → redirect to `/admin/login`

### Auth Layout (`app/admin/(auth)/layout.tsx`)

The **inverse** of middleware:
- Middleware protects admin pages from unauthenticated users
- Auth layout protects the login/signup pages from **already authenticated** users
- If a logged-in admin navigates to `/admin/login`, they're redirected to `/admin/home`

### Logout (`app/admin/logout/action.ts`)

Server action that:
1. Deletes the `auth_token` httpOnly cookie (only server code can delete httpOnly cookies)
2. Redirects to `/admin/login`

---

## 6. Data Types

All types live in the `types/` folder. Never define types inline in components.

### `types/story.ts`

```ts
type BlockType = "heading" | "paragraph" | "quote" | "image"
```
The four block types supported by the story editor. Maps to the database values.

```ts
type Block = {
  id: string
  block_type: BlockType
  content: string      // HTML string for text blocks; empty string for image blocks
  image_url: string    // Cloudinary URL for image blocks; empty string otherwise
  position: number     // 1-based, controls rendering order
}
```

```ts
type Story = {
  stori_id: string
  title: string
  subtitle: string
  excerpt: string
  cover_image: string
  reading_time: string
  status: "Draft" | "Published"
  created_at: string   // ISO date string
}
```
Shape returned by `GET /stories/adminstories` (the list endpoint).

```ts
type StoryDetail = Story & { stori_blocks: Block[] }
```
Shape returned by `GET /stories/adminstori/:id` (single story for editing).

### `types/api.ts`

```ts
type ApiSuccess<T = void> = { ok: true; data: T }
type ApiError = { ok: false; status: number; message: string }
type ApiResult<T = void> = ApiSuccess<T> | ApiError
```

Every server action returns `ApiResult<T>`. Callers check `result.ok` to get TypeScript's discriminated union narrowing:

```ts
const result = await someAction()
if (!result.ok) {
  toast.error(result.message)  // TypeScript knows result is ApiError
  return
}
// TypeScript now knows result is ApiSuccess<T>
```

### `types/admin.ts`

```ts
type AdminProfile = {
  admin_name: string
  email: string
  avatar_url?: string  // optional — admin may not have a profile picture
}
```
Shape returned by `GET /admin/profile`. Used in the Navbar.

### `StoriDetail` (local type in `[storiId]/action.tsx`)

The single-story edit endpoint returns camelCase field names, unlike the list endpoint which uses snake_case. A local type captures this:

```ts
type StoriBlock = {
  blockId: string      // camelCase from backend
  blockType: string    // camelCase from backend
  content: string
  image_url: string    // snake_case (backend inconsistency)
  position: number
}

type StoriDetail = {
  title: string
  subtitle: string
  excerpt: string
  readingTime: string    // camelCase
  coverImage?: string | null  // camelCase
  status: string
  blocks: StoriBlock[]
}
```

---

## 7. API Layer

### `lib/api.ts` — `apiRequest()`

Central authenticated fetch function. All requests to the backend go through this.

```ts
apiRequest(path: string, options?: RequestInit): Promise<Response>
```

What it does:
1. Reads the `auth_token` cookie from `next/headers`
2. Merges it into the request headers as `Authorization: Bearer <token>`
3. Sets `Content-Type: application/json` by default (overridable via `options.headers`)
4. **Throws `ApiRequestError`** if the response is not 2xx

**Important:** This file has NO `"use server"` directive. It is a server-side utility that runs on the server because it imports from `next/headers`. `"use server"` is only for Server Action files (callable from client). This distinction matters — adding `"use server"` to this file would break it because the file exports a class (`ApiRequestError`), and `"use server"` files can only export async functions.

### `ApiRequestError`

```ts
class ApiRequestError extends Error {
  status: number
}
```

Thrown by `apiRequest()` on non-2xx responses. Carries the HTTP status code so callers can:
- Distinguish 401 (unauthorized) from 500 (server error)
- Check for 404 specifically (e.g., `getStori()` returns `null` on 404, re-throws everything else)

### How different callers handle errors

| Caller type | Error handling strategy |
|---|---|
| Server component | Let it throw — Next.js routes it to the nearest `error.tsx` |
| Server action | Catch it, return `{ ok: false, status, message }` |
| `getProfile()` | Catch all errors, return `null` (Navbar shows fallback instead of crashing) |
| `getStori()` | Catch 404 → return `null`, re-throw everything else |

---

## 8. Image Uploads (Cloudinary)

### `lib/cloudinary.ts` — `uploadToCloudinary()`

```ts
uploadToCloudinary(file: File): Promise<string>
```

Uploads directly from the browser to Cloudinary using an **unsigned upload preset**. Returns the permanent CDN URL. Throws on failure.

**Why unsigned?** Signed uploads require a server-side signing step. Unsigned presets (configured in the Cloudinary dashboard) allow direct browser-to-Cloudinary uploads without an extra server round-trip.

### Upload flow (used in CoverImage, ImageUploader, AvatarPicker)

All three image upload components follow the same pattern:

```
1. User selects file
2. Create local blob URL → show as optimistic preview immediately
3. setUploading(true) + onUploadStart() [increments uploadingCount in context]
4. try: upload to Cloudinary
5.   success → onChange(permanentUrl) [update context with real Cloudinary URL]
6.   failure → revert preview to original URL + toast.error()
7. finally: setUploading(false) + onUploadEnd() [always runs, even on error]
```

The `finally` block is critical — it guarantees `uploadingCount` decrements back to zero even if the upload throws. Without it, the save button could stay permanently disabled after a failed upload.

### Why uploadingCount matters

When a user is in the middle of uploading an image, the block's `image_url` is a temporary **blob URL** (like `blob://...`). If the admin saves at this moment:
- The blob URL would be sent to the backend
- Blob URLs are local to the browser session — the backend can't access them
- The saved story would have a broken image

`uploadingCount > 0` keeps the save button disabled until all uploads complete.

---

## 9. Utility Functions

### `lib/utils.ts`

```ts
formatDate(date: string | Date): string
```
Returns a human-readable relative string like `"3 days ago"`, `"about 2 hours ago"`.
Uses `date-fns`'s `formatDistanceToNow`. Used on story cards.

```ts
capitalize(s: string): string
```
Capitalizes the first character. Used to normalize story status from the API
(e.g., `"draft"` → `"Draft"`).

### `lib/validation.ts`

```ts
validatePassword(password: string): { isValid: boolean; message: string }
```

Client-side password validation (purely for UX — the server also validates).
Rules: minimum 8 characters, at least one uppercase letter, at least one number.
Special character rule is commented out — uncomment to enforce it.

---

## 10. Story Editor Context

### `context/StoryEditorContext.tsx`

The story editor is spread across many deeply nested components (MetaFields, EditorBlock, CoverImage, etc.). Rather than prop-drilling every piece of state down 4–5 levels, all editor state lives in a single React context.

**This context is intentionally state-only.** No API calls happen inside it. The create page and edit page each make their own API calls and update context state as needed.

The provider (`StoryEditorProvider`) is mounted in the layout files for both create and edit pages, so the context wraps the entire page tree.

### State fields

| Field | Type | Purpose |
|---|---|---|
| `mode` | `"write" \| "read"` | Whether the editor is in editing or preview mode |
| `title` | `string` | Story title |
| `subTitle` | `string` | Story subtitle |
| `excerpt` | `string` | Short teaser text |
| `readTime` | `string` | Estimated reading time (e.g., "5 min read") |
| `coverImage` | `string \| null` | Cloudinary URL of the cover image |
| `blocks` | `EditorBlock[]` | Ordered array of content blocks |
| `uploadingCount` | `number` | Number of image uploads currently in progress |

### EditorBlock type

```ts
type EditorBlock = {
  id: string         // client-only UUID — used as React key, NOT sent to API
  block_type: BlockType
  content: string    // HTML string for text blocks
  image_url: string  // Cloudinary URL for image blocks
  position: number   // 1-based display order
}
```

### Context functions

**`insertBlock(type, atPosition)`**
Inserts a new block at `atPosition`, shifting all existing blocks at or after that position up by 1.

Uses the **functional updater pattern** `setBlocks((prev) => ...)` instead of reading `blocks` from the closure. This prevents stale closure bugs when multiple state updates happen in the same render cycle.

**`updateBlock(pos, value)`**
Updates the text content (HTML) of a block at a given position. Skips image blocks.

**`updateImageBlock(pos, url)`**
Updates the Cloudinary URL of an image block. Separate from `updateBlock` because image blocks have no `content`.

**`deleteBlock(pos)`**
Removes a block and renumbers all remaining blocks so positions stay sequential (1, 2, 3…). Without renumbering, the position gaps would break `insertBlock`'s shift arithmetic.

**`incrementUploading()` / `decrementUploading()`**
Increment/decrement `uploadingCount`. `decrementUploading` uses `Math.max(0, c - 1)` to prevent going below zero.

### Seeding the context (edit page)

On the edit page, `EditStoryEditor` seeds the context with server-fetched data in a `useEffect` with an empty dependency array.

**Why the seeding effect has a cleanup:**
`StoryEditorProvider` lives in `[storiId]/layout.tsx`. Next.js App Router preserves layouts when navigating between routes that share the same layout segment — so navigating from `/stories/1` to `/stories/2` keeps the same provider instance with story 1's state. When story 2's `EditStoryEditor` mounts, it briefly renders with story 1's stale `blocks` before the seeding `useEffect` fires. The cleanup function resets all context fields to neutral values on unmount, so the next story's first render always sees a clean slate.

**Why CoverImage needs a sync `useEffect`:**
`CoverImage` initialises its local `previewUrl` state with `useState(url)` — which only runs once on mount. On the edit page, `CoverImage` mounts before the seeding `useEffect` fires (because `coverImage` in context starts as `null`). Without a sync effect, `previewUrl` would stay `null` even after the context is seeded with the real URL. `CoverImage` therefore has `useEffect(() => setPreviewUrl(url), [url])` to pick up the prop change after seeding.

```ts
useEffect(() => {
  setMode("read")
  setTitle(stori.title)
  setBlocks(stori.blocks.map(...))
  // ...
}, []) // intentionally empty — seed once on mount
```

The empty deps array with `eslint-disable` is intentional. We only want to seed once when the component mounts. Re-running the effect on every render would reset any edits the admin made.

---

## 11. UI Components

All in `components/admin/ui/`.

### Button

```tsx
<Button variant="primary" | "secondary" type="submit" disabled={...}>
  Label
</Button>
```

Full-width pill button. Used on the auth pages (login, signup).
- `primary` — solid blue, main CTA
- `secondary` — light blue, secondary actions

### Input

```tsx
<Input label="Email" name="email" type="email" placeholder="..." disabled={...} />
```

Styled form input with a floating eye toggle for password fields.
Uses Tailwind's `peer` class: `peer-focus:text-primary` on the eye icon makes it turn blue when the input is focused (without any JS).

### AuthCard

A white rounded card that centers the auth form vertically and horizontally on the screen. Max width 460px.

### AuthBranding

Shows the Kampos logo in a blue circle, the page title (e.g., "Korner Admin"), and a subtitle tagline. Used at the top of both auth pages.

### AvatarPicker

Circle avatar with a `+` button in the bottom-right corner. Used on the signup page.
Follows the standard upload flow (blob preview → Cloudinary → final URL).
Notifies the parent when uploading starts/ends via `onUploadingChange` so the signup button can be disabled.

### Avatar

Simple circle that shows the admin's profile picture. Used in the Navbar.
Fallback: empty circle with `bg-secondary` background (no broken image).

### ProfileTrigger (`components/admin/ui/ProfileTrigger.tsx`)

Client component used in two places in the Navbar — `variant="avatar"` on the left (the 50px circle) and `variant="icon"` on the right (the User icon). Each instance holds its own `open` state and renders `ProfileModal` when open.

### ProfileModal (`components/admin/ui/ProfileModal.tsx`)

Centred overlay modal for viewing and editing the admin profile. Conditionally rendered (`{open && <ProfileModal />}`) so it unmounts on close and resets state on next open.

**View mode:** large avatar, name, email, bio (or "No bio yet."), pencil icon to enter edit mode, X to close.

**Edit mode:** `AvatarPicker` (pre-filled with existing avatar via `initialUrl`), name input, bio textarea, Save button. Save currently just returns to view mode — no API call yet. Wire up `updateProfile()` here when the endpoint is ready.

**State fields:**

| Field | Seeded from |
|---|---|
| `localName` | `profile.admin_name` |
| `localBio` | `profile.bio` (null until API supports it) |
| `localAvatarUrl` | `profile.avatar_url` |
| `avatarUploading` | from `AvatarPicker.onUploadingChange` — disables Save |

### LogoutButton

Red icon button in the Navbar. Calls the `logout()` server action via `useTransition` to show a spinner while the server deletes the cookie.

### CreateStoryButton

Feather icon link to `/admin/stories/create`. The feather (✒) icon visually suggests writing.

---

## 12. Admin Components

### AdminGreeting (`components/admin/AdminGreeting.tsx`)

Shows a greeting like "Wassup, Victor 👋" in the Navbar.
Randomly picks from `["Hello", "Wassup", "How far", "Hi", "Halo", "Konnichiwa"]` on each load.

**Hydration-safe pattern:** The server renders `"Hi"` (a fixed value). After hydration, `useEffect` randomizes it on the client. Without this, the server and client would render different greetings, causing React hydration mismatch errors.

The 👋 emoji uses the `custom-shake` CSS class (defined in `globals.css`) — a gentle side-to-side wave animation.

### Navbar (`components/admin/Navbar.tsx`)

Fixed top bar on all admin pages that use the home layout. It's a **server component** — it fetches the admin profile on the server so the name and avatar appear immediately without a loading flash.

Layout: Avatar + Greeting (left) | CreateStory + UpdateProfile + Logout (right)

Height: `h-[14vh]`. All pages below it use `pt-[14vh]` to push content below it.

The `getProfile()` call returns `null` on error instead of throwing — the Navbar shows fallback values and doesn't crash.

### FilterBar (`components/admin/stories/FilterBar.tsx`)

Two toggle buttons — **Draft** and **Published** — one is always active. There is no "show all" state.

- Clicking the inactive button switches to it
- Clicking the already-active button does nothing (`cursor-default`)
- Initial / default state is **Draft** (controlled by the home page defaulting to `"Draft"` when no `?status` param exists)

Updates the URL query string (`?status=Draft` / `?status=Published`). Using the URL means the filter survives page refreshes and is preserved when the admin clicks Back after editing a story.

### StoryCard (`components/admin/stories/StoryCard.tsx`)

Card for a single story in the grid. Fixed height `500px` keeps the grid visually consistent regardless of content length. The entire card is a Next.js `<Link>` — clicking anywhere navigates to the edit page.

Status badge:
- **Draft** — `bg-secondary` (light blue) + dark blue text
- **Published** — `bg-primary` (brand blue) + white text

`line-clamp-1` / `line-clamp-2` on title, subtitle, excerpt prevents overflow. Date pushed to the bottom with `mt-auto`.

### StoriesList (`components/admin/stories/StoriesList.tsx`)

Server component. Fetches all stories from `GET /stories/adminstories`, then filters by the `status` prop passed from the home page. Always receives a status value (never undefined) because the home page defaults to `"Draft"`.

`apiRequest()` throws on non-2xx — errors propagate to `error.tsx` automatically.

Grid uses CSS `auto-fill` with `minmax(350px, 1fr)` — adapts from 1 column on mobile to 2–3 on desktop without media queries.

Shows `EmptyState` (inline SVG illustration + "create one" link) when no stories match.

---

## 13. Editor Components

### The Write/Read Mode System

Every editor component accepts a `mode: "write" | "read"` prop.

- **Write mode** — interactive inputs, upload buttons, insert/delete controls
- **Read mode** — clean rendered HTML, looks like a finished article

The admin can toggle between modes using the floating action buttons on the editor pages.

---

### MetaFields (`components/admin/editor/MetaFields.tsx`)

Four exported components for the story's metadata:

| Component | Write mode | Read mode |
|---|---|---|
| `TitleField` | Transparent input with bottom border | `<h1>` tag |
| `SubTitleField` | Transparent input with bottom border | `<p>` tag |
| `ExcerptField` | Italic textarea with bottom border | Light blue card (`bg-[#F0F5FF]`) |
| `ReadTimeField` | Clock icon + text input | Clock icon + text |

Write mode uses `border-b-2 border-secondary` (no box, no background) — the input feels like typing directly onto the page.

All font sizes use `clamp()` for fluid responsive scaling.

---

### CoverImage (`components/admin/editor/CoverImage.tsx`)

Full-width rounded image at the top of the story. Height uses `clamp(320px, 55vw, 480px)`.

Uses CSS `background-image` (not `<img>`) so it can use `background-size: cover` without a fixed aspect ratio.

In write mode: shows "Upload Image" / "Change Image" / "Uploading…" button at the bottom of the image.

Follows the standard upload flow.

---

### ImageUploader (`components/admin/editor/ImageUploader.tsx`)

Inline image block for images within the story body. Uses a 16:9 aspect ratio (`aspect-video`).

Uses Next.js `<Image fill>` (not CSS background) because:
- Inline body images benefit from Next.js lazy loading and srcset optimisation
- `unoptimized` is set because images come from Cloudinary which has its own CDN

---

### RichTextEditor (`components/admin/editor/RichTextEditor.tsx`)

TipTap-based rich text editor. Used for paragraph and quote blocks.

**Toolbar:** Bold, Italic, Underline, Strikethrough

**Why `onMouseDown` + `e.preventDefault()` on toolbar buttons:**
Normally, clicking a button blurs the editor first, then fires `onClick`. The blur clears TipTap's selection, so toggling bold would have nothing to toggle. Using `onMouseDown` + `preventDefault` keeps the editor focused through the click.

**Why a `<style>` tag instead of Tailwind for ProseMirror CSS:**
Tailwind classes can only target elements directly in your template. TipTap's ProseMirror generates internal DOM nodes (`.ProseMirror p`, etc.) that Tailwind can't reach. Scoped CSS via the `rte-box` wrapper class is the only clean solution.

**Why `forceUpdate` via `useReducer`:**
TipTap's `isActive("bold")` state changes inside ProseMirror but doesn't trigger a React re-render on its own. Calling `forceUpdate()` in `onTransaction` keeps the toolbar buttons in sync with the actual editor state.

**Normalizing empty output:**
TipTap outputs `"<p></p>"` for an empty editor. This is normalized to `""` in `onChange` so the context doesn't store meaningless markup.

**Accepted props:**

| Prop | Default | Purpose |
|---|---|---|
| `content` | — | Initial HTML content |
| `onChange` | — | Called with new HTML on every keystroke |
| `placeholder` | — | Shown when editor is empty |
| `minHeight` | `100` | Minimum editor height in px |
| `fontSize` | `clamp(0.95rem, 2vw, 1.05rem)` | Font size (inherited by editor) |
| `fontWeight` | `500` | Font weight |
| `color` | `#374151` | Text color |
| `fontStyle` | `"normal"` | Normal or italic |

---

### EditorBlock (`components/admin/editor/EditorBlock.tsx`)

Routes to the correct block sub-component based on `block.block_type`:

| block_type | Write mode | Read mode |
|---|---|---|
| `heading` | `<input type="text">` | `<h2>` |
| `paragraph` | `RichTextEditor` | `dangerouslySetInnerHTML` |
| `quote` | `FaQuoteLeft` icon + `RichTextEditor` (italic) | Large `FaQuoteLeft` + `dangerouslySetInnerHTML` |
| `image` | `ImageUploader` | `ImageUploader` (read mode, no button) |

**Why `dangerouslySetInnerHTML`:**
Paragraph and quote blocks store HTML strings (produced by TipTap). To render that HTML, `dangerouslySetInnerHTML` is required. This is safe here because the content is created by the admin themselves, never by public users.

**Why `FaQuoteLeft` from react-icons:**
Lucide React does not have a quote icon. `react-icons/fa` provides `FaQuoteLeft`.

---

### BlockControls (`components/admin/editor/BlockControls.tsx`)

The insert row between blocks in write mode.

**Collapsed state:** A thin horizontal line with a `+` icon in the centre. Opacity 35% normally, 100% on hover — visually subtle until the admin wants to use it.

**Expanded state:** Pill buttons for each block type (Heading, Paragraph, Quote, Image) + a Cancel button. Clicking a type calls `onInsert(type)` and collapses back.

One `BlockControls` is placed before the first block and after every block, allowing insertion at any position.

---

### StoryEditor (`components/admin/editor/StoryEditor.tsx`)

Renders the full list of blocks. Behaviour depends on mode:

**Read mode:** `flex-col gap-6` stack of `EditorBlock` components — clean, no controls.

**Write mode:** Each block is wrapped in a flex row:
```
[  EditorBlock (flex-1)  ] [  🗑 Trash icon  ]
```
With a `BlockControls` row before the first block and after every block.

---

## 14. Routes & Pages

### `app/admin/(auth)/login/page.tsx`

Client component. Renders the login form inside `AuthCard`.

- Uses `useTransition` to call `login()` without blocking the UI
- Error messages displayed inline above the form
- On success, the server action redirects — no client-side navigation needed
- Link to `/admin/signUp` (capital S — matches the folder name exactly)

### `app/admin/(auth)/signUp/page.tsx`

Client component. Renders the signup form.

Client-side validation order:
1. Name, email, password are not empty
2. Passwords match
3. `validatePassword()` passes
4. `avatarUrl` is not null (avatar must be uploaded)

The avatar URL is managed as separate state (not in the form) because `AvatarPicker` uploads asynchronously. The URL is appended to `FormData` just before calling `signUp()`.

Submit button is disabled while `avatarUploading === true` to prevent submitting with a null `avatar_url`.

### `app/admin/home/page.tsx`

Server component. Reads `status` from `searchParams` and passes it to `StoriesList`.
Defaults to `"Draft"` when no query param is present — so the first thing an admin sees after login is their drafts.

`FilterBar` is wrapped in `<Suspense>` because it uses `useSearchParams()` — Next.js requires `Suspense` for this in server-rendered pages to avoid blocking.

### `app/admin/home/layout.tsx`

Renders the `Navbar` and offsets content below it with `pt-[14vh]`.

### `app/admin/stories/create/page.tsx`

Client component. Reads all state from `useStoryEditor()`.

**Floating Action Buttons (FABs):**
- **Top**: Save as draft (BookCheck icon) — calls `createStory()`, redirects to home on success
- **Bottom**: Toggle write/read mode (Pencil ↔ Save icon)

Both buttons show a spinner while `busy` (isDrafting or uploadingCount > 0).

### `app/admin/stories/[storiId]/page.tsx`

**Server component.** Fetches the story on the server with `getStori(storiId)`.
- If null (404): calls `notFound()` → renders `not-found.tsx`
- Otherwise: passes the story data as props to `EditStoryEditor`

This pattern eliminates client-side loading states and lets Next.js handle the 404 natively.

### `app/admin/stories/[storiId]/EditStoryEditor.tsx`

**Client component.** Receives the server-fetched story as props, seeds the context in `useEffect`, and handles all user interactions.

Key differences from the create page:
- Opens in **read mode** by default (preview the story first)
- Has a "Go back" link to the home page
- Shows a **status badge** (Draft/Published) next to the read time
- **Save button only appears when `isDirty`** — see below
- **Save shows a success toast** instead of redirecting — admin stays on the page
- Wider content area (`maxWidth: 1100px` vs create's `800px`)

#### isDirty — change detection

The save button is hidden until the admin actually changes something. This prevents accidental no-op saves.

**How it works:**

On mount, the seeding `useEffect` snapshots the story's initial values into `useRef` variables (one per field). Refs are used instead of state because reading them never triggers a re-render — they're a silent reference point.

On every render, `isDirty` is recomputed by comparing the current context values against the snapshot:

```ts
// Simple string fields — plain !== comparison
const simpleFieldsChanged =
  title !== initialTitleRef.current ||
  subTitle !== initialSubTitleRef.current ||
  // ... etc

// Blocks — JSON.stringify comparison (arrays can't be compared with ===)
// The `id` field is stripped before comparing because it's a client-only UUID
// (not content). Without stripping, adding then deleting a block would leave
// a different UUID and falsely mark the story dirty.
const blocksChanged =
  JSON.stringify(blocks.map(blockWithoutId)) !==
  JSON.stringify(initialBlocksRef.current.map(blockWithoutId));

const isDirty = simpleFieldsChanged || blocksChanged;
```

The save FAB renders only when `isDirty === true`:
```tsx
{isDirty && <button ...>Save</button>}
```

---

## 15. Server Actions Pattern

### What a server action is

A server action is an `async function` in a file marked with `"use server"` at the top. It runs on the server but can be called directly from client components.

### The standard pattern

```ts
"use server"

export async function someAction(data: ...): Promise<ApiResult<void>> {
  try {
    await apiRequest("/endpoint", { method: "POST", body: JSON.stringify(data) })
  } catch (err: unknown) {
    const status = (err as { status?: number }).status ?? 500
    const message = err instanceof Error ? err.message : "Something went wrong."
    return { ok: false, status, message }
  }

  // redirect() must be OUTSIDE try/catch because it works by throwing
  // an internal Next.js exception — if inside catch, it gets swallowed
  redirect("/admin/home")
}
```

### Calling from client components

```ts
const result = await someAction(data)
if (!result.ok) {
  toast.error(result.message)
  return
}
// success — result.ok is true
```

Use `useTransition` to avoid blocking the UI:
```ts
const [isPending, startTransition] = useTransition()
const handleSubmit = () => {
  startTransition(async () => {
    const result = await someAction(data)
    if (!result.ok) toast.error(result.message)
  })
}
```

### Why redirect() must be outside try/catch

`redirect()` in Next.js works by throwing a special internal error (`NEXT_REDIRECT`). If you place it inside a `try/catch`, the `catch` block intercepts it as a regular error and the redirect never happens. Always structure actions as: do all async work inside try/catch → call redirect() after the catch block.

---

## 16. Public Pages

The `components/admincomponent/` folder still exists but is **only used by public user-facing pages**. These four files must never be deleted:

| File | Used by |
|---|---|
| `Button.tsx` | `app/page.tsx`, `app/stories/page.tsx`, and usercomponent files |
| `HeroText.tsx` | `app/stories/page.tsx`, `usercomponent/HeroSection.tsx` |
| `Tornsection.tsx` | `app/stories/page.tsx`, `usercomponent/PeepSection.tsx` |
| `FloatingCards.tsx` | `usercomponent/HeroSection.tsx` |

These are **not** part of the admin panel. They are legacy components from before the admin rewrite that serve the public-facing site.

---

## 17. Key Patterns & Decisions

### Functional updater for setBlocks

```ts
// ❌ Stale closure — `blocks` might be outdated
setBlocks([...blocks, newBlock])

// ✅ Always reads the latest state
setBlocks((prev) => [...prev, newBlock])
```

Used in `insertBlock` and `deleteBlock` because these functions can be called multiple times in rapid succession.

### onMouseDown instead of onClick for toolbar buttons

```tsx
<button
  onMouseDown={(e) => {
    e.preventDefault()  // prevents editor blur
    onClick()
  }}
>
```

Prevents the editor from losing focus when a formatting button is clicked.

### Hydration-safe random values

```ts
const [greeting, setGreeting] = useState("Hi")  // fixed initial value

useEffect(() => {
  setGreeting(randomPick(GREETINGS))  // randomize after hydration
}, [])
```

Server and client must render the same HTML initially. Randomize in `useEffect` after hydration.

### Server component + client component split for edit page

```
page.tsx (server)          EditStoryEditor.tsx (client)
    │                               │
    ├── getStori()                  ├── useStoryEditor() (reads context)
    ├── notFound() if null          ├── useEffect() seeds context
    └── <EditStoryEditor            └── useTransition() for save action
         stori={data}
         storiId={id} />
```

The server fetches data cleanly, hands it to the client component as props. The client handles all interactivity.

### Error handling hierarchy

```
apiRequest throws ApiRequestError
    │
    ├── Server component caller: let it throw → goes to error.tsx
    ├── Server action caller: catch → return { ok: false, ... }
    ├── getProfile(): catch all → return null (Navbar fallback)
    └── getStori(): catch 404 → return null; re-throw others
```

### @source "../" in globals.css

```css
@source "../";
```

Without this, Tailwind v4 only scans the `app/` directory (where `globals.css` lives). Classes like `bg-primary` used in `components/admin/` would be missing from the generated CSS. This directive tells Tailwind to scan from the project root.

---

*Last updated: 2026-05-30*
*Updated by: Admin codebase deep review — bugs fixed, comprehensive comments added to all files. Dark mode added to create and edit story pages (page background, FAB buttons, Go back link).*
