# Korner Frontend — Full Codebase Documentation

> **Living document.** Update this file whenever a component, route, type, or pattern changes.
> A new developer or maintainer should be able to understand every part of the codebase from this file alone.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Folder Structure](#3-folder-structure)
4. [Styling System](#4-styling-system)
5. [Color System](#5-color-system)
6. [Authentication & Middleware](#6-authentication--middleware)
7. [Data Types](#7-data-types)
8. [API Layer](#8-api-layer)
9. [Image Uploads (Cloudinary)](#9-image-uploads-cloudinary)
10. [Utility Functions](#10-utility-functions)
11. [Story Editor Context](#11-story-editor-context)
12. [UI Components](#12-ui-components)
13. [Admin Components](#13-admin-components)
14. [Editor Components](#14-editor-components)
15. [Routes & Pages](#15-routes--pages)
16. [Server Actions Pattern](#16-server-actions-pattern)
17. [Public Pages](#17-public-pages)
18. [Key Patterns & Decisions](#18-key-patterns--decisions)

---

## 1. Project Overview

**Korner** is a content platform. This repository is the **Next.js frontend** for the admin panel — the interface where admins write, edit, and manage stories.

The public-facing site (where readers see stories) also lives in this repo under `app/` and `components/usercomponent/`.

**What the admin panel does:**
- Login / signup / forgot-password / reset-password for admin accounts
- View stories in a grid filtered by status — Draft (default), Pending, Published
- Create a new story with a rich block-based editor
- Edit an existing story (with dirty-state detection so Save only appears when something changed)
- Submit a draft for review (from the editor FAB or directly from the story card)
- Revert a pending story back to draft (from the story card)
- Profile management — update name, bio, avatar
- Help modal accessible from the `?` icon in the navbar
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
| date-fns | latest | Relative and formatted date output |
| Lucide React | latest | Icon library |
| react-icons/fa | latest | `FaQuoteLeft` (Lucide has no quote icon) |

---

## 3. Folder Structure

```
kornerfrontend/
├── app/
│   ├── admin/
│   │   ├── (auth)/                       # Auth route group — login, signup, password reset
│   │   │   ├── layout.tsx                # Redirects logged-in users away from auth pages
│   │   │   ├── login/
│   │   │   │   ├── page.tsx              # Login form (client component)
│   │   │   │   └── actions.tsx           # login() server action
│   │   │   ├── signup/
│   │   │   │   ├── page.tsx              # Signup form (client component)
│   │   │   │   └── actions.tsx           # signUp() server action
│   │   │   ├── forgot-password/
│   │   │   │   ├── page.tsx              # Forgot password form — requests OTP
│   │   │   │   └── action.ts             # requestOtp() server action
│   │   │   └── reset-password/
│   │   │       ├── page.tsx              # Server shell — reads ?email from searchParams
│   │   │       ├── ResetPasswordForm.tsx # Client form — OTP input + new password
│   │   │       └── action.ts             # resetPassword() server action
│   │   ├── home/
│   │   │   ├── layout.tsx                # Wraps all home content with Navbar
│   │   │   ├── page.tsx                  # Stories grid — Draft by default, toggle to Pending/Published
│   │   │   ├── action.tsx                # getProfile() + updateProfile() server actions
│   │   │   ├── loading.tsx               # Loading skeleton
│   │   │   └── error.tsx                 # Error boundary for this route
│   │   ├── logout/
│   │   │   └── action.ts                 # logout() — deletes cookie, redirects to login
│   │   └── stories/
│   │       ├── create/
│   │       │   ├── layout.tsx            # Wraps page in StoryEditorProvider
│   │       │   ├── page.tsx              # Create story editor (client component)
│   │       │   ├── action.tsx            # createStory() server action
│   │       │   └── submitForReview.tsx   # submitForReview() — create then submit in one action
│   │       └── [storiId]/
│   │           ├── layout.tsx            # Wraps page in StoryEditorProvider
│   │           ├── page.tsx              # Edit story (server component — fetches data)
│   │           ├── EditStoryEditor.tsx   # Edit story UI (client component)
│   │           └── action.tsx            # getStori(), updateStory(), submitStoryForReview(),
│   │                                     # submitStoryForReviewFromCard()
│   ├── stories/                          # Public story listing (user-facing)
│   ├── layout.tsx                        # Root layout (fonts, Toaster)
│   └── globals.css                       # Tailwind v4 theme + custom utilities
├── components/
│   ├── admin/                            # Admin-specific components
│   │   ├── ui/                           # Reusable UI primitives
│   │   │   ├── Button.tsx                # Full-width pill button (primary / secondary variants)
│   │   │   ├── Input.tsx                 # Styled form input with eye toggle for passwords
│   │   │   ├── AuthCard.tsx              # White rounded card centering auth forms
│   │   │   ├── AuthBranding.tsx          # Logo + title + subtitle at top of auth pages
│   │   │   ├── AvatarPicker.tsx          # Circle avatar with + upload button
│   │   │   ├── Avatar.tsx                # Read-only circle avatar (Navbar)
│   │   │   ├── OtpInput.tsx              # 6-box OTP input for password reset
│   │   │   ├── LogoutButton.tsx          # Red icon button — calls logout() via useTransition
│   │   │   ├── ThemeToggle.tsx           # Light/dark mode toggle button (Navbar)
│   │   │   ├── ThemedToaster.tsx         # Sonner Toaster wired to the active theme
│   │   │   ├── ProfileTrigger.tsx        # Avatar circle / User icon that opens ProfileModal
│   │   │   ├── ProfileModal.tsx          # View + edit admin profile modal
│   │   │   ├── HelpTrigger.tsx           # ? icon button that opens HelpModal
│   │   │   ├── HelpModal.tsx             # Guided help overlay with Pidgin/Gen-Z tone
│   │   │   └── CreateStoryButton.tsx     # Feather icon link — navigates to /stories/create
│   │   ├── editor/                       # Story editor building blocks
│   │   │   ├── RichTextEditor.tsx        # TipTap wrapper (bold, italic, underline, strike)
│   │   │   ├── CoverImage.tsx            # Full-width cover image with upload
│   │   │   ├── ImageUploader.tsx         # Inline image block with upload (16:9)
│   │   │   ├── EditorBlock.tsx           # Routes to correct sub-component by block_type
│   │   │   ├── BlockControls.tsx         # Insert row between blocks (+) in write mode
│   │   │   ├── StoryEditor.tsx           # Full block list — write mode has trash + controls
│   │   │   └── MetaFields.tsx            # Title, SubTitle, Excerpt, ReadTime inputs
│   │   ├── stories/                      # Stories grid components
│   │   │   ├── StoryCard.tsx             # Individual story card (client component)
│   │   │   ├── StoriesList.tsx           # Grid of story cards (server component)
│   │   │   └── FilterBar.tsx             # Draft / Pending / Published filter buttons
│   │   ├── AdminGreeting.tsx             # "Hi, [name]" greeting in Navbar
│   │   └── Navbar.tsx                    # Fixed top navigation bar (server component)
│   ├── admincomponent/                   # LEGACY — kept for public pages only
│   │   ├── Button.tsx                    # Used by app/page.tsx and stories/page.tsx
│   │   ├── HeroText.tsx                  # Used by app/stories/page.tsx
│   │   ├── Tornsection.tsx               # Used by app/stories/page.tsx
│   │   └── FloatingCards.tsx             # Used by usercomponent/HeroSection.tsx
│   └── usercomponent/                    # Public-facing page components
├── context/
│   └── StoryEditorContext.tsx            # Shared state for the story editor
├── constants/
│   └── theme.ts                          # PRIMARY and SECONDARY hex color values
├── lib/
│   ├── api.ts                            # apiRequest() — central authenticated fetch
│   ├── cloudinary.ts                     # uploadToCloudinary() — direct browser upload
│   ├── font.ts                           # Nunito font definition
│   ├── utils.ts                          # formatDate(), formatFullDate(), capitalize()
│   └── validation.ts                     # validatePassword()
├── middleware.ts                         # Route protection for /admin/*
├── types/
│   ├── story.ts                          # BlockType, Block, Story, StoryDetail types
│   ├── api.ts                            # ApiResult<T> discriminated union
│   └── admin.ts                          # AdminProfile type
└── doc.md                                # ← You are here
```

---

## 4. Styling System

### Tailwind CSS v4

This project uses **Tailwind v4**, configured entirely in CSS — there is no `tailwind.config.ts`.

All configuration lives in [`app/globals.css`](app/globals.css):

```css
@import "tailwindcss";

/* Class-based dark mode — `dark:` classes activate when <html> has the `dark` class.
   MUST use @custom-variant (not @variant) to override Tailwind's default strategy. */
@custom-variant dark (&:where(.dark, .dark *));

/* Scan from project root so Tailwind picks up classes in components/, context/, etc. */
@source "../";

@theme {
  --color-primary: #165ABF;      /* brand blue */
  --color-secondary: #B4CFF6;    /* light blue */
  --font-nunito: var(--font-nunito);
}
```

An `@layer utilities` block provides explicit fallback definitions for custom color utilities:

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

### Typography

The project uses the **Nunito** font loaded in `lib/font.ts` via `next/font/google`. Apply it with the `font-nunito` utility. The font variable is exposed as `--font-nunito` in CSS.

### Responsive Sizing

Font sizes and spacing that need to scale smoothly use `clamp()`:

```css
font-size: clamp(min, preferred-viewport-unit, max)
```

This replaces breakpoint-based responsive classes for typography.

---

## 5. Color System

### Brand Colors

| Name | Hex | Usage |
|---|---|---|
| `primary` | `#165ABF` | Main blue — buttons, borders, text, icons |
| `secondary` | `#B4CFF6` | Light blue — backgrounds, badges, inputs |

**Rule:** Always use Tailwind classes (`bg-primary`, `text-secondary`) in JSX. Only use the raw hex values from `constants/theme.ts` for SVG `fill` attributes and Lucide `color` props where Tailwind classes can't reach.

### Story Status Colors

Every place that shows a story's status uses the same three color families. This applies to: status badges on cards, the status badges in FilterBar, the quick-action buttons on cards, and the FAB buttons on editor pages.

| Status | Light bg | Light text | Dark bg | Dark text |
|---|---|---|---|---|
| Draft | `#DBEAFE` | `#1e40af` | `#1e3a5f` | `#93c5fd` |
| Pending | `#FEF3C7` | `#92400E` | `#422006` | `#FDE68A` |
| Published | `#D1FAE5` | `#065F46` | `#022C22` | `#6EE7B7` |

### FAB Colors (Editor Pages)

The four floating action buttons on the create and edit pages use consistent colors:

| Button | Color family | Light bg | Dark bg | Usage |
|---|---|---|---|---|
| Submit for review | Amber | `#FEF3C7` | `#422006` | Send draft to Pending |
| Save as draft | Teal | `#CCFBF1` | `#022C22` | Save without submitting |
| Edit story | Blue (brand) | `secondary` | `#1e3a5f` | Enter write mode |
| Preview story | Violet | `#EDE9FE` | `#2E1065` | Enter read/preview mode |

---

## 6. Authentication & Middleware

### How authentication works

1. Admin submits login form → `login()` server action POSTs to backend
2. Backend returns a JWT token
3. The action stores the token as an **httpOnly cookie** named `auth_token`
   - `httpOnly: true` — browser JS cannot read it (XSS protection)
   - `secure: true` in production — only sent over HTTPS
   - `maxAge: 86400` — expires after 24 hours
4. Every subsequent request to the backend includes this token via `apiRequest()`

### middleware.ts

Runs on every request (except `_next/static`, `_next/image`, `favicon.ico`).

- Non-admin routes → pass through
- `/admin/login` and `/admin/signup` → pass through (unauthenticated entry points)
- Any other `/admin/*` route without `auth_token` → redirect to `/admin/login`

### Auth Layout (`app/admin/(auth)/layout.tsx`)

The inverse of middleware: if a logged-in admin navigates to `/admin/login`, they're redirected to `/admin/home`.

### Forgot Password / Reset Password

Two-step flow:

1. `/admin/forgot-password` — admin enters email → `requestOtp()` POSTs to backend → backend emails a 6-digit OTP → page redirects to `/admin/reset-password?email=...`
2. `/admin/reset-password` — admin enters OTP + new password → `resetPassword()` POSTs to backend → on success, redirect to login

The reset page is a server component that reads `?email` from `searchParams` and passes it as a prop to `ResetPasswordForm` (client component). The form includes a 60-second resend cooldown timer (countdown managed with `useEffect` + `setTimeout`).

### Logout (`app/admin/logout/action.ts`)

Server action that:
1. Deletes the `auth_token` httpOnly cookie
2. Redirects to `/admin/login`

---

## 7. Data Types

All types live in `types/`. Never define types inline in components.

### `types/story.ts`

```ts
type BlockType = "heading" | "paragraph" | "quote" | "image"
```

```ts
type Block = {
  id: string
  block_type: BlockType
  content: string      // HTML for text blocks; empty string for image blocks
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
  status: "Draft" | "Pending" | "Published"
  created_at: string   // ISO date string
  updated_at: string   // ISO date string
}
```
Shape returned by `GET /stories/adminstories`. Used to render story cards.

```ts
type StoryDetail = Story & { stori_blocks: Block[] }
```
Shape returned by `GET /stories/adminstori/:id`. Used on the edit page.

### `types/api.ts`

```ts
type ApiSuccess<T = void> = { ok: true; data: T }
type ApiError = { ok: false; status: number; message: string }
type ApiResult<T = void> = ApiSuccess<T> | ApiError
```

Every server action returns `ApiResult<T>`. Callers check `result.ok` for TypeScript discriminated union narrowing.

### `types/admin.ts`

```ts
type AdminProfile = {
  admin_name: string
  email: string
  bio?: string
  avatar_url?: string
}
```

### `StoriDetail` (local type in `[storiId]/action.tsx`)

The single-story edit endpoint returns camelCase field names, unlike the list endpoint's snake_case. A local type captures this shape:

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
  coverImage?: string | null
  status: string
  blocks: StoriBlock[]
}
```

---

## 8. API Layer

### `lib/api.ts` — `apiRequest()`

Central authenticated fetch. All requests to the backend go through this.

```ts
apiRequest(path: string, options?: RequestInit): Promise<Response>
```

What it does:
1. Reads `auth_token` from `next/headers`
2. Merges it into `Authorization: Bearer <token>`
3. Sets `Content-Type: application/json` by default
4. **Throws `ApiRequestError`** if the response is not 2xx

**Important:** No `"use server"` directive here — it runs on the server because it imports from `next/headers`, but `"use server"` is only for Server Action files. Adding it here would break the file because `"use server"` files can only export async functions (not classes like `ApiRequestError`).

### Error handling per caller type

| Caller type | Strategy |
|---|---|
| Server component | Let it throw → goes to nearest `error.tsx` |
| Server action | Catch → return `{ ok: false, status, message }` |
| `getProfile()` | Catch all → return `null` (Navbar shows fallback) |
| `getStori()` | Catch 404 → return `null`; re-throw everything else |

---

## 9. Image Uploads (Cloudinary)

### `lib/cloudinary.ts` — `uploadToCloudinary()`

```ts
uploadToCloudinary(file: File): Promise<string>
```

Uploads directly from the browser to Cloudinary using an unsigned upload preset. Returns the permanent CDN URL. Throws on failure.

### Upload flow (CoverImage, ImageUploader, AvatarPicker)

```
1. User selects file
2. Create local blob URL → show as optimistic preview immediately
3. setUploading(true) + onUploadStart() [increments uploadingCount in context]
4. try: upload to Cloudinary
5.   success → onChange(permanentUrl)
6.   failure → revert preview to original URL + toast.error()
7. finally: setUploading(false) + onUploadEnd() [always runs, even on error]
```

The `finally` block is critical — it guarantees `uploadingCount` decrements back to zero even on upload failure.

### Why uploadingCount matters

While a user is uploading, the block's `image_url` is a temporary `blob://` URL local to the browser session. If saved at this moment, the backend would receive a URL it can't access. `uploadingCount > 0` keeps all save/submit buttons disabled until all uploads complete.

---

## 10. Utility Functions

### `lib/utils.ts`

```ts
formatDate(date: string | Date): string
```
Returns a relative string like `"3 days ago"`, `"about 2 hours ago"`. Uses `date-fns` `formatDistanceToNow`. Shown as "Last updated X ago" on story cards.

```ts
formatFullDate(date: string | Date): string
```
Returns a full date string like `"Jun 7, 2026"`. Uses `date-fns` `format`. Shown as "Created Jun 7, 2026" on story cards below the relative date.

```ts
capitalize(s: string): string
```
Capitalizes the first character. Used to normalize API status values (`"draft"` → `"Draft"`).

### `lib/validation.ts`

```ts
validatePassword(password: string): { isValid: boolean; message: string }
```

Client-side password validation. Rules: minimum 8 characters, at least one uppercase letter, at least one number.

---

## 11. Story Editor Context

### `context/StoryEditorContext.tsx`

The story editor spans many deeply nested components (MetaFields, EditorBlock, CoverImage, etc.). All editor state lives in a single React context instead of being prop-drilled 4–5 levels deep.

**This context is state-only.** No API calls happen inside it.

The provider (`StoryEditorProvider`) is mounted in the layout files for both the create and edit pages.

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
| `uploadingCount` | `number` | Number of in-progress image uploads |

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
Inserts a new block at `atPosition`, shifting all existing blocks at or after that position up by 1. Uses the functional updater `setBlocks((prev) => ...)` to avoid stale closure bugs when multiple state updates fire in the same render cycle.

**`updateBlock(pos, value)`**
Updates the HTML content of a block at a given position. Skips image blocks.

**`updateImageBlock(pos, url)`**
Updates the Cloudinary URL of an image block at a given position.

**`deleteBlock(pos)`**
Removes a block and renumbers all remaining blocks so positions stay sequential (1, 2, 3…). Without renumbering, position gaps would break `insertBlock`'s shift arithmetic.

**`incrementUploading()` / `decrementUploading()`**
Track in-flight Cloudinary uploads. `decrementUploading` uses `Math.max(0, c - 1)` to prevent going below zero.

### Seeding the context (edit page)

On the edit page, `EditStoryEditor` seeds the context with server-fetched data in a `useEffect` with an empty dependency array (fires once on mount). A cleanup function resets all context fields on unmount so the next story's first render always sees a clean slate — critical because `StoryEditorProvider` lives in the layout and persists across `[storiId]` navigations.

---

## 12. UI Components

All in `components/admin/ui/`.

### Button

```tsx
<Button variant="primary" | "secondary" type="submit" disabled={...}>Label</Button>
```

Full-width pill button. Used on auth pages. `primary` = solid blue; `secondary` = light blue.

### Input

```tsx
<Input label="Email" name="email" type="email" placeholder="..." disabled={...} />
```

Styled form input. Password type gets a floating eye toggle. Uses Tailwind `peer` to turn the eye icon blue on focus without JS.

### AuthCard / AuthBranding

`AuthCard` — white rounded card centering the auth form. Max width 460px.
`AuthBranding` — Kampos logo, page title, subtitle tagline. Top of all auth pages.

### OtpInput

6-box OTP input for the password reset form. Handles auto-focus-next-box on each keystroke and backspace-to-previous-box deletion. Accepts `value`, `onChange`, and `disabled` props. Used in `ResetPasswordForm`.

### AvatarPicker

Circle avatar with a `+` button in the bottom-right corner. Used on the signup page and in ProfileModal (edit mode). Follows the standard upload flow. Notifies the parent when uploading starts/ends via `onUploadingChange`.

### Avatar

Read-only circle showing the admin's profile picture. Fallback: empty circle with `bg-secondary` background. Used in Navbar.

### ThemeToggle

Icon button in the Navbar that toggles the `dark` class on `<html>`. Persists preference to localStorage.

### ThemedToaster

Wraps Sonner's `<Toaster>` and passes the current theme so toasts match light/dark mode.

### ProfileTrigger (`components/admin/ui/ProfileTrigger.tsx`)

Client component. Used twice in the Navbar — `variant="avatar"` on the left (50px circle) and `variant="icon"` on the right (User icon). Each holds its own `open` state and renders `ProfileModal` when open.

### ProfileModal (`components/admin/ui/ProfileModal.tsx`)

Centred overlay modal for viewing and editing the admin profile. Rendered via `createPortal` into `document.body`.

**View mode:** avatar, name, email, bio (or "No bio yet."), pencil icon → edit mode, X → close.

**Edit mode:** `AvatarPicker` (pre-filled), read-only email, name input, bio textarea, Save button (calls `updateProfile()` server action, shows success toast on success).

**State fields:**

| Field | Seeded from |
|---|---|
| `localName` | `profile.admin_name` |
| `localBio` | `profile.bio` |
| `localAvatarUrl` | `profile.avatar_url` |
| `avatarUploading` | from `AvatarPicker.onUploadingChange` — disables Save |

### HelpTrigger (`components/admin/ui/HelpTrigger.tsx`)

Client component. `HelpCircle` icon button in the Navbar. Manages `open` state and renders `HelpModal` when open.

```tsx
{open && <HelpModal onClose={() => setOpen(false)} />}
```

### HelpModal (`components/admin/ui/HelpModal.tsx`)

Guided help overlay rendered via `createPortal`. Written in Pidgin/Gen-Z tone consistent with Korner's brand voice. Sticky header, scrollable body.

Seven sections:
1. **How to born a story** — numbered steps for creating a story (entry point: the floating `FeatherIcon` at `bottom-8 right-8` on the home page)
2. **Write vs Read mode** — explains the two editor modes
3. **Floating buttons** — describes all 4 FABs with their colors and purpose
4. **Story levels** — Draft → Pending → Published explained with colored badges
5. **Card shortcuts** — amber submit button on Draft cards, blue revert button on Pending cards
6. **Filter bar** — the three filter buttons with their colors
7. **Tips** — isDirty save button, image upload patience, profile, dark mode

### LogoutButton

Red icon button in the Navbar. Calls `logout()` via `useTransition` to show a spinner while the cookie is deleted server-side.

---

## 13. Admin Components

### AdminGreeting (`components/admin/AdminGreeting.tsx`)

Shows `"Wassup, Victor 👋"` in the Navbar. Randomly picks from `["Hello", "Wassup", "How far", "Hi", "Halo", "Konnichiwa"]` on each load.

**Hydration-safe pattern:** Server renders `"Hi"` (fixed). After hydration, `useEffect` randomizes it. Without this, server and client would render different values, causing React hydration mismatch errors.

The 👋 emoji uses the `custom-shake` CSS animation defined in `globals.css`.

### Navbar (`components/admin/Navbar.tsx`)

Fixed top bar on all admin pages under the home layout. **Server component** — fetches the admin profile server-side so name and avatar appear immediately.

**Layout:**
- Left: Avatar circle (opens ProfileModal) + AdminGreeting
- Right: HelpTrigger (`?` icon) + ThemeToggle + LogoutButton

Height: `h-[14vh]`. All pages below it use `pt-[14vh]` to push content below it.

`getProfile()` returns `null` on error — the Navbar shows fallback values and doesn't crash.

### FilterBar (`components/admin/stories/FilterBar.tsx`)

Three toggle buttons — **Draft**, **Pending**, **Published** — one is always active. No "show all" state.

- Active button gets its status-family color (blue/amber/green) with `shadow-md cursor-default`
- Inactive button is neutral gray (`bg-slate-200 text-slate-500 dark:bg-[#1e2130] dark:text-slate-400`)
- Clicking the active button does nothing
- Updates `?status=` in the URL — filter survives page refresh and Back navigation
- Default (no `?status` param) → Draft

Wrapped in `<Suspense>` by the home page because `useSearchParams()` requires it.

Position: `fixed top-[14vh]` — sits just below the Navbar. Home page content has `pt-[60px]` to avoid being hidden behind it.

### StoryCard (`components/admin/stories/StoryCard.tsx`)

**Client component.** Card for a single story. The entire card is a Next.js `<Link>` to the edit page.

**Visual structure (top to bottom):**
1. Reading time + status badge (status-family color)
2. Cover image — `h-[200px] sm:h-[240px]`, "No cover image" placeholder if none
3. Title — `text-lg sm:text-xl`, `line-clamp-1`
4. Subtitle — italic, `text-sm sm:text-base`, `line-clamp-1`
5. Excerpt — `text-xs sm:text-sm`, `line-clamp-2`
6. Bottom row: dates on the left + quick-action button on the right

**Date display (bottom-left):**
- `"Last updated X ago"` — relative, `text-sm font-semibold` (more prominent)
- `"Created Jun 7, 2026"` — full date, `text-[11px]` (subtler, hierarchy)

**Quick-action buttons (bottom-right):**
- **Draft card** — amber `SendHorizonal` button → `submitStoryForReviewFromCard()` → success toast
- **Pending card** — blue `RotateCcw` button → `updateStory(..., [])` with empty blocks → reverts to draft → success toast
- **Published card** — no quick-action button

Both button handlers use `e.preventDefault()` + `e.stopPropagation()` to prevent the card's `<Link>` from navigating when the button is clicked.

### StoriesList (`components/admin/stories/StoriesList.tsx`)

**Server component.** Fetches all stories from `GET /stories/adminstories`, then filters by the `status` prop.

**EmptyState logic:** Accepts `status` and `hasAnyStories: boolean`. The `hasAnyStories` flag distinguishes "this filter is empty but other stories exist" from "no stories at all":

| Condition | Heading | Sub-text |
|---|---|---|
| `status === "Published"` | "No published stories yet" | "Publish a draft to see it here" |
| `status === "Pending"` | "No pending stories" | "Stories submitted for review will appear here" |
| Filter empty but `hasAnyStories` | "No drafts yet" | "create a new draft" link |
| Truly no stories | "You have no stories yet" | "create one" link |

Grid: CSS `auto-fill` with `minmax(350px, 1fr)` — adapts from 1 column on mobile to 2–3 on desktop without media queries.

---

## 14. Editor Components

### The Write/Read Mode System

Every editor component accepts a `mode: "write" | "read"` prop.

- **Write mode** — interactive inputs, upload buttons, insert/delete controls
- **Read mode** — clean rendered HTML, looks like a finished article

Admins toggle between modes using the FABs on the editor pages.

### MetaFields (`components/admin/editor/MetaFields.tsx`)

Four components for story metadata:

| Component | Write mode | Read mode |
|---|---|---|
| `TitleField` | Transparent input with bottom border | `<h1>` |
| `SubTitleField` | Transparent input with bottom border | `<p>` |
| `ExcerptField` | Italic textarea with bottom border | Light blue card (`bg-[#F0F5FF]`) |
| `ReadTimeField` | Clock icon + text input | Clock icon + text |

Write mode uses `border-b-2 border-secondary` — feels like typing directly on the page.

### CoverImage (`components/admin/editor/CoverImage.tsx`)

Full-width rounded image at the top of the story. Height: `clamp(320px, 55vw, 480px)`. Uses CSS `background-image` (not `<img>`) for `background-size: cover`. In write mode: shows "Upload / Change / Uploading…" button.

### ImageUploader (`components/admin/editor/ImageUploader.tsx`)

Inline image block (16:9 `aspect-video`). Uses Next.js `<Image fill>` with `unoptimized` (images are from Cloudinary which has its own CDN).

### RichTextEditor (`components/admin/editor/RichTextEditor.tsx`)

TipTap-based rich text editor for paragraph and quote blocks. Toolbar: Bold, Italic, Underline, Strikethrough.

Key details:
- **`onMouseDown` + `e.preventDefault()` on toolbar buttons** — prevents editor blur before the formatting toggle fires
- **Scoped CSS via `<style>` tag** — Tailwind can't reach TipTap's internal ProseMirror DOM nodes; a `rte-box` wrapper class + `<style>` is the only clean solution
- **`forceUpdate` via `useReducer`** — TipTap's `isActive("bold")` state changes inside ProseMirror without triggering a React re-render; `forceUpdate()` in `onTransaction` keeps the toolbar in sync
- **Empty output normalization** — TipTap's `"<p></p>"` is normalized to `""` in `onChange`

### EditorBlock (`components/admin/editor/EditorBlock.tsx`)

Routes to the correct sub-component by `block.block_type`:

| block_type | Write mode | Read mode |
|---|---|---|
| `heading` | `<input type="text">` | `<h2>` |
| `paragraph` | `RichTextEditor` | `dangerouslySetInnerHTML` |
| `quote` | `FaQuoteLeft` + `RichTextEditor` (italic) | Large `FaQuoteLeft` + `dangerouslySetInnerHTML` |
| `image` | `ImageUploader` | `ImageUploader` (read mode, no upload button) |

`dangerouslySetInnerHTML` is safe here because content is only ever authored by the admin, never by public users.

### BlockControls (`components/admin/editor/BlockControls.tsx`)

Insert row between blocks in write mode.
- **Collapsed** — thin horizontal line with `+` icon, 35% opacity, full opacity on hover
- **Expanded** — pill buttons for Heading, Paragraph, Quote, Image + Cancel

One `BlockControls` appears before the first block and after every block, allowing insertion at any position.

### StoryEditor (`components/admin/editor/StoryEditor.tsx`)

Renders the full block list.

**Read mode:** `flex-col gap-6` stack of `EditorBlock` components.

**Write mode:** Each block is wrapped in a flex row with a trash icon. `BlockControls` rows are inserted before the first block and after every block.

---

## 15. Routes & Pages

### `app/admin/(auth)/login/page.tsx`

Client component. Login form inside `AuthCard`. Uses `useTransition` → `login()` server action. On success the server action redirects. Link to `/admin/signup` and `/admin/forgot-password`.

### `app/admin/(auth)/signup/page.tsx`

Client component. Signup form. Client-side validation order:
1. Name, email, password not empty
2. Passwords match
3. `validatePassword()` passes
4. `avatarUrl` is not null

Avatar URL is managed as separate state (not in the form) because `AvatarPicker` uploads asynchronously. The URL is appended to `FormData` just before calling `signUp()`.

### `app/admin/(auth)/forgot-password/page.tsx`

Client component. Admin enters email → `requestOtp()` → toast + redirect to `/admin/reset-password?email=...`.

### `app/admin/(auth)/reset-password/page.tsx` + `ResetPasswordForm.tsx`

Server component shell reads `?email` from `searchParams`, passes it to `ResetPasswordForm` (client component). Form collects OTP (via `OtpInput`) + new password → `resetPassword()` → toast + redirect to login. 60-second resend cooldown for OTP.

### `app/admin/home/page.tsx`

Server component. Reads `?status` from `searchParams` (defaults to `"Draft"`). Renders `FilterBar` (in `<Suspense>`) and `StoriesList`. The floating `FeatherIcon` link at `fixed bottom-8 right-8` is the entry point for creating stories.

### `app/admin/home/layout.tsx`

Renders `Navbar` and offsets content below it with `pt-[14vh]`.

### `app/admin/stories/create/page.tsx`

Client component. Reads all state from `useStoryEditor()`. Two independent `useTransition` hooks — one for drafting (`isDrafting`), one for submitting (`isSubmitting`).

**Floating Action Buttons (right side, only in read mode):**
- **Amber** — Submit for review (`SendHorizonal` icon): calls `submitForReview()`, redirects on success
- **Teal** — Save as draft (`BookCheck` icon): calls `createStory()`, redirects on success
- **Violet** (write mode) / **Blue** (read mode) — Toggle mode (`Eye` ↔ `Pencil`)

The violet/blue toggle button is always visible. Submit and save only show in read mode (preview first, then act).

`busy = isDrafting || uploadingCount > 0` — disables Save while action is in flight or images are uploading.

### `app/admin/stories/create/action.tsx` — `createStory()`

Server action. POSTs to `/stories/create`. The client-only `id` field is stripped from blocks before sending. On success: `redirect("/admin/home")`. On failure: returns `ApiResult<void>` with `ok: false`.

### `app/admin/stories/create/submitForReview.tsx` — `submitForReview()`

Server action for the amber FAB on the create page. Two-step:
1. POST `/stories/create` → extract `storiId` from `{ data: "uuid" }` response
2. PATCH `/stories/submit/:storiId`
3. `redirect("/admin/home")`

Both steps have their own try/catch so the error message correctly identifies which step failed.

### `app/admin/stories/[storiId]/page.tsx`

**Server component.** Fetches the story with `getStori(storiId)`:
- Returns `null` on 404 → calls `notFound()` → renders `not-found.tsx`
- Otherwise passes the data to `EditStoryEditor` as props

### `app/admin/stories/[storiId]/EditStoryEditor.tsx`

**Client component.** Receives server-fetched story as props, seeds context on mount.

Key differences from the create page:
- Opens in **read mode** by default
- Has a "Go back" link to the home page
- Shows a **status badge** (Draft / Published) next to ReadTimeField
- **Submit for review FAB** — amber, only shown when `stori.status === "Draft"`
- **Save FAB** — teal, only shown when `isDirty === true`
- **Edit FAB** — blue, enters write mode
- Wider content area (`maxWidth: 1100px` vs create's `800px`)
- Save shows a success toast and stays on the page (doesn't redirect)

#### isDirty — change detection

The save button is hidden until the admin actually changes something. Prevents no-op saves.

**How it works:**

On mount, the seeding `useEffect` snapshots the story's initial values into `useRef` variables (one per field). Refs don't trigger re-renders — they're a silent reference point.

On every render, `isDirty` is recomputed:

```ts
// Simple string fields — direct comparison
const simpleFieldsChanged =
  title     !== initialTitleRef.current    ||
  subTitle  !== initialSubTitleRef.current ||
  excerpt   !== initialExcerptRef.current  ||
  readTime  !== initialReadTimeRef.current ||
  coverImage !== initialCoverRef.current;

// Blocks — JSON.stringify comparison (arrays can't be === compared)
// The `id` field is stripped before comparison — it's a client-only UUID.
// Without stripping, adding then deleting a block would change UUIDs and
// falsely mark the story dirty even though content is identical.
const blockWithoutId = ({ id: _id, ...rest }: EditorBlock) => rest;
const blocksChanged =
  JSON.stringify(blocks.map(blockWithoutId)) !==
  JSON.stringify(initialBlocksRef.current.map(blockWithoutId));

const isDirty = simpleFieldsChanged || blocksChanged;
```

The save FAB renders only when `isDirty`:
```tsx
{isDirty && <button ...>Save</button>}
```

### `app/admin/stories/[storiId]/action.tsx`

Four server actions:

**`getStori(storiId)`** — Fetches a single story. Returns `null` on 404, re-throws everything else.

**`updateStory(storiId, ...fields, blocks)`** — PATCH `/stories/:storiId`. Returns `ApiResult<void>`. Also calls `revalidatePath("/admin/home")`. Used by the edit page (toast on success) and by the card's revert button (passing `[]` for blocks signals the backend to reset to draft).

**`submitStoryForReview(storiId)`** — Called from the edit page. PATCH `/stories/submit/:storiId`, then `redirect("/admin/home")`. Appropriate for the edit page context (admin is done and leaves).

**`submitStoryForReviewFromCard(storiId)`** — Called from the story card on the home page. PATCH `/stories/submit/:storiId`, then `revalidatePath("/admin/home")`, returns `{ ok: true }`. Uses `revalidatePath` instead of `redirect` because the admin is already on `/admin/home` — returning `ok: true` lets the client show a success toast.

---

## 16. Server Actions Pattern

### What a server action is

An `async function` in a file marked `"use server"` at the top. Runs on the server but callable directly from client components.

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

  // redirect() must be OUTSIDE try/catch — it throws internally.
  // If inside catch, the catch intercepts and swallows it.
  redirect("/admin/home")
}
```

### When to use redirect vs revalidatePath

| Context | Use |
|---|---|
| Editor pages (create/edit) | `redirect("/admin/home")` — navigate admin away |
| Story card quick actions | `revalidatePath("/admin/home")` + return `{ ok: true }` — stay on page, show toast |

### Calling from client components with useTransition

```ts
const [isPending, startTransition] = useTransition()

const handleClick = () => {
  startTransition(async () => {
    const result = await someAction(data)
    if (!result.ok) toast.error(result.message)
  })
}
```

---

## 17. Public Pages

The `components/admincomponent/` folder still exists but is **only used by public user-facing pages**. These four files must never be deleted:

| File | Used by |
|---|---|
| `Button.tsx` | `app/page.tsx`, `app/stories/page.tsx`, usercomponent files |
| `HeroText.tsx` | `app/stories/page.tsx`, `usercomponent/HeroSection.tsx` |
| `Tornsection.tsx` | `app/stories/page.tsx`, `usercomponent/PeepSection.tsx` |
| `FloatingCards.tsx` | `usercomponent/HeroSection.tsx` |

These are not part of the admin panel. They are legacy components from before the admin rewrite that serve the public-facing site.

---

## 18. Key Patterns & Decisions

### Functional updater for setBlocks

```ts
// ❌ Stale closure — `blocks` might be outdated
setBlocks([...blocks, newBlock])

// ✅ Always reads the latest state
setBlocks((prev) => [...prev, newBlock])
```

Used in `insertBlock` and `deleteBlock` to prevent lost updates when multiple state changes fire in the same render cycle.

### Card button inside Link

Story card quick-action buttons sit inside a Next.js `<Link>`. Without stopping propagation, clicking the button would also trigger the link navigation.

```ts
const handleSubmit = (e: React.MouseEvent) => {
  e.preventDefault()       // stop link navigation
  e.stopPropagation()      // stop event from reaching the Link
  // ... call server action
}
```

### submitStoryForReview vs submitStoryForReviewFromCard

Same endpoint (`PATCH /stories/submit/:storiId`), different post-action behavior:
- From edit page → `redirect()` (admin leaves page)
- From card → `revalidatePath()` + return `ok: true` (admin stays, toast shows)

This split is necessary because `redirect()` throws internally and never returns to the client — so the client could never receive `ok: true` and show a toast.

### isDirty without false positives

The `blockWithoutId` helper strips the client-only `id` UUID from blocks before the `JSON.stringify` comparison. Without this, adding a block and then deleting it would produce a different UUID array even though the content is identical — a false dirty signal.

### Server component + client component split (edit page)

```
page.tsx (server)             EditStoryEditor.tsx (client)
    │                                 │
    ├── getStori()                     ├── useStoryEditor() (reads context)
    ├── notFound() if null             ├── useEffect() seeds context once
    └── <EditStoryEditor               └── useTransition() for save/submit
         stori={data}
         storiId={id} />
```

Server fetches cleanly, hands data to the client as props. Client handles all interactivity.

### Hydration-safe random values

```ts
const [greeting, setGreeting] = useState("Hi")  // fixed server-side value

useEffect(() => {
  setGreeting(randomPick(GREETINGS))  // randomize after hydration
}, [])
```

Server and client must match on first render. Randomize in `useEffect` after hydration.

### @source "../" in globals.css

```css
@source "../";
```

Without this, Tailwind v4 only scans `app/` (where `globals.css` lives). Classes used in `components/admin/` would be missing from the generated CSS.

### onMouseDown instead of onClick for RichText toolbar

```tsx
<button
  onMouseDown={(e) => {
    e.preventDefault()  // prevents editor blur
    editor.chain().focus().toggleBold().run()
  }}
>
```

Clicking normally blurs the editor first, clearing the selection. `onMouseDown` + `preventDefault` keeps focus through the click so formatting toggles have something to act on.

### Turbopack stale cache fix

If the dev server throws "Failed to load chunk" errors after significant changes:

```powershell
Remove-Item -Recurse -Force .next; npm run dev
```

---

*Last updated: 2026-06-07*
*Updated by: Full codebase review — added Pending status, three-filter bar, card quick-action buttons (submit/revert), isDirty save logic, submitForReview on create page, submitStoryForReviewFromCard, formatFullDate, date display on cards, HelpModal, HelpTrigger, OtpInput, forgot-password and reset-password flows, ProfileModal updateProfile wiring, ThemeToggle, ThemedToaster, dark mode across all pages, FAB color system.*
