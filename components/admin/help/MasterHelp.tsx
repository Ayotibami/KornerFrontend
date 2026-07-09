import {
  LayoutDashboard,
  PenSquare,
  Layers,
  Eye,
  Clock,
  BookCheck,
  Rocket,
  CheckSquare,
  Trash2,
  BarChart2,
  Mail,
  Newspaper,
  Bell,
  Users,
  UserCheck,
  ScrollText,
  User,
  AlignLeft,
  Heading1,
  Quote,
  ImageIcon,
  Bookmark,
  Pencil,
  SendHorizonal,
  EyeOff,
  XCircle,
  CheckCircle2,
  Bold,
  Italic,
  List,
  ListOrdered,
  RotateCcw,
} from "lucide-react";
import {
  Section,
  P,
  Sub,
  Tip,
  Note,
  Steps,
  Bullets,
  BlockCard,
  ActionRow,
  StatusRow,
} from "./ui";

export const MASTER_NAV = [
  { id: "dashboard", title: "Your Dashboard" },
  { id: "creating-story", title: "Creating a Story" },
  { id: "block-editor", title: "The Block Editor" },
  { id: "write-preview", title: "Write vs Preview Mode" },
  { id: "autosave", title: "Autosave & Recovery" },
  { id: "all-stories", title: "Managing All Stories" },
  { id: "reviewing", title: "Reviewing Pending Stories" },
  { id: "publish", title: "Publishing & Unpublishing" },
  { id: "bulk-actions", title: "Bulk Actions" },
  { id: "delete-story", title: "Deleting a Story" },
  { id: "story-analytics", title: "Per-Story Analytics" },
  { id: "story-mail", title: "Story Mail" },
  { id: "newsletter", title: "Newsletter" },
  { id: "push", title: "Push Notifications" },
  { id: "subscribers", title: "Subscribers" },
  { id: "managing-writers", title: "Managing Writers" },
  { id: "activity-log", title: "Activity Log" },
  { id: "profile", title: "Your Profile" },
];

export default function MasterHelp() {
  return (
    <div className="flex flex-col gap-5">

      {/* ── 1. Dashboard ── */}
      <Section id="dashboard" icon={<LayoutDashboard size={16} />} title="Your Dashboard">
        <P>
          Your home page is the platform control centre. Each card gives you a different view of
          what's happening. Here's what each one shows:
        </P>

        <div className="flex flex-col gap-3">
          <div className="p-4 bg-gray-50 dark:bg-[#1e2130] rounded-xl border border-gray-100 dark:border-white/[0.04]">
            <p className="text-sm font-bold text-[#0f1e3d] dark:text-gray-50 mb-1">
              Needs Attention <span className="ml-1 text-xs text-red-500 font-normal">(check this first)</span>
            </p>
            <P>
              Shows two counts that need your action: stories waiting for review (Pending) and
              admin accounts that haven't been verified yet. If either number is greater than zero,
              the card pulses to catch your eye. Click the links inside to go act on them directly.
            </P>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-[#1e2130] rounded-xl border border-gray-100 dark:border-white/[0.04]">
            <p className="text-sm font-bold text-[#0f1e3d] dark:text-gray-50 mb-1">Stories</p>
            <P>
              A quick overview of story counts: yours specifically, plus Draft, Pending, and
              Published counts across the whole platform. Click any number to jump to that filtered
              list.
            </P>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-[#1e2130] rounded-xl border border-gray-100 dark:border-white/[0.04]">
            <p className="text-sm font-bold text-[#0f1e3d] dark:text-gray-50 mb-1">Writers</p>
            <P>
              Total number of admin accounts, shown with a bubble of their avatars. Click the card
              to go to the Writers management page.
            </P>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-[#1e2130] rounded-xl border border-gray-100 dark:border-white/[0.04]">
            <p className="text-sm font-bold text-[#0f1e3d] dark:text-gray-50 mb-1">Subscribers</p>
            <P>
              Total subscriber count, how many are new this week, when the last subscriber joined,
              and when the last newsletter was sent. Click to go to the full subscriber list.
            </P>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-[#1e2130] rounded-xl border border-gray-100 dark:border-white/[0.04]">
            <p className="text-sm font-bold text-[#0f1e3d] dark:text-gray-50 mb-1">Push</p>
            <P>
              How many devices are subscribed to push notifications and how many are reachable right
              now. Click to go to the Push broadcast page.
            </P>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-[#1e2130] rounded-xl border border-gray-100 dark:border-white/[0.04]">
            <p className="text-sm font-bold text-[#0f1e3d] dark:text-gray-50 mb-1">Top Writers</p>
            <P>
              A ranked leaderboard of writers by published story count. Gold, silver, and bronze
              trophies for the top three. Click any writer's name to see all their published
              stories.
            </P>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-[#1e2130] rounded-xl border border-gray-100 dark:border-white/[0.04]">
            <p className="text-sm font-bold text-[#0f1e3d] dark:text-gray-50 mb-1">Activity</p>
            <P>
              A preview of the most recent actions taken on the platform — publishes, submissions,
              role changes, and more. Click the card to see the full Activity Log.
            </P>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-[#1e2130] rounded-xl border border-gray-100 dark:border-white/[0.04]">
            <p className="text-sm font-bold text-[#0f1e3d] dark:text-gray-50 mb-1">Metrics</p>
            <P>
              Platform-wide numbers: total views of all time, total published stories, new stories
              this month, subscriber growth (this month vs last month), and the top story by
              total views.
            </P>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-[#1e2130] rounded-xl border border-gray-100 dark:border-white/[0.04]">
            <p className="text-sm font-bold text-[#0f1e3d] dark:text-gray-50 mb-1">Trends</p>
            <P>
              Two line charts at the bottom of the dashboard: daily site views over 30 days and
              daily new subscribers over 30 days. Use these to spot traffic trends and measure
              growth over time.
            </P>
          </div>
        </div>
      </Section>

      {/* ── 2. Creating Your Own Story ── */}
      <Section id="creating-story" icon={<PenSquare size={16} />} title="Creating a Story">
        <P>
          As a Master, you create stories using the same editor as writers — but you can publish
          your own stories directly without going through the review process.
        </P>

        <Steps
          items={[
            <>
              Tap the <strong>+</strong> floating button at the bottom-right corner of any admin
              page and choose <strong>Create new story</strong>.
            </>,
            <>The story editor opens. Fill in the details at the top.</>,
            <>Build your story body using content blocks (see the Block Editor section).</>,
            <>
              Switch to Preview Mode. You'll see the <strong>Publish</strong> button (green
              rocket) — click it to make the story live immediately.
            </>,
          ]}
        />

        <Sub>Story detail fields</Sub>
        <div className="flex flex-col gap-3">
          {[
            {
              label: "Cover Image",
              desc: "Click to upload. The main image shown at the top of the story page and on story cards across the site. Not required but strongly recommended.",
            },
            {
              label: "Title",
              desc: "The name of your story. Required — autosave won't start until you have a title.",
            },
            {
              label: "Subtitle",
              desc: "A supporting line below the title. Optional but adds context.",
            },
            {
              label: "Excerpt",
              desc: "A 1–2 sentence summary of your story. Shown on story cards across the website. Make it a hook.",
            },
            {
              label: "Reading Time",
              desc: 'Type this yourself. Example: "5 min read". Helps readers decide before they start.',
            },
          ].map(({ label, desc }) => (
            <div
              key={label}
              className="p-4 bg-gray-50 dark:bg-[#1e2130] rounded-xl border border-gray-100 dark:border-white/[0.04]"
            >
              <p className="text-sm font-bold text-[#0f1e3d] dark:text-gray-50 mb-1">{label}</p>
              <P>{desc}</P>
            </div>
          ))}
        </div>
      </Section>

      {/* ── 3. Block Editor ── */}
      <Section id="block-editor" icon={<Layers size={16} />} title="The Block Editor">
        <P>
          Your story body is built from content blocks. Each block is one piece of content — a
          paragraph, heading, quote, or image. Stack them together to build the full story.
        </P>

        <Sub>Adding & deleting blocks</Sub>
        <Bullets
          items={[
            <>Click the <strong>+</strong> button between blocks (or below the last block) to add a new one. Choose a type from the menu.</>,
            <>Click the <strong>delete icon</strong> on the right side of any block to remove it.</>,
          ]}
        />

        <Sub>The four block types</Sub>
        <div className="flex flex-col gap-3">
          <BlockCard
            icon={<AlignLeft size={16} />}
            name="Paragraph"
            description={
              <>
                Main writing tool. Supports <strong>Bold</strong>, <strong>Italic</strong>,{" "}
                <strong>Bullet list</strong>, and <strong>Numbered list</strong> via a formatting
                toolbar. Highlight any text inside the block to see the toolbar.
              </>
            }
            usage="Story body text, narrative, explanations"
          />
          <BlockCard
            icon={<Heading1 size={16} />}
            name="Heading"
            description="A section title rendered as large, bold text. Type directly into the field — no rich text formatting, just the heading itself."
            usage="Section titles, topic transitions, chapter breaks"
          />
          <BlockCard
            icon={<Quote size={16} />}
            name="Quote"
            description="A standout statement rendered with a large decorative quotation mark and italic styling. Also supports basic formatting (bold, italic)."
            usage="Key quotes, memorable lines, important insights"
          />
          <BlockCard
            icon={<ImageIcon size={16} />}
            name="Image"
            description="Upload a photo into the story body. Shows a local preview immediately — the actual upload to the server happens when you save or publish."
            usage="Inline photos, illustrations, screenshots"
          />
        </div>

        <Tip>
          For paragraph blocks: highlight any text to reveal the formatting toolbar. You can mix
          bold and italic freely in the same paragraph.
        </Tip>
      </Section>

      {/* ── 4. Write vs Preview Mode ── */}
      <Section id="write-preview" icon={<Eye size={16} />} title="Write vs Preview Mode">
        <P>
          The editor has two modes. The <strong>first button</strong> in the floating action panel
          on the right side always toggles between them — its position never changes.
        </P>

        <div className="flex flex-col gap-3">
          <div className="flex gap-3 items-start p-4 bg-secondary/20 dark:bg-[#1e3a5f]/30 border border-secondary dark:border-[#1e3a5f] rounded-xl">
            <div className="w-9 h-9 rounded-full bg-secondary dark:bg-[#1e3a5f] text-primary dark:text-[#93b8f0] flex items-center justify-center flex-shrink-0">
              <Pencil size={15} />
            </div>
            <div>
              <p className="text-sm font-bold text-[#0f1e3d] dark:text-gray-50">Write Mode — editing</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mt-1">
                All blocks are interactive. Type, format, add and remove blocks here. The first
                button shows a <strong>violet eye</strong> — click it to preview.
              </p>
            </div>
          </div>
          <div className="flex gap-3 items-start p-4 bg-purple-50/40 dark:bg-[#2E1065]/20 border border-purple-100 dark:border-[#2E1065] rounded-xl">
            <div className="w-9 h-9 rounded-full bg-purple-100 dark:bg-[#2E1065] text-purple-600 dark:text-[#C4B5FD] flex items-center justify-center flex-shrink-0">
              <Eye size={15} />
            </div>
            <div>
              <p className="text-sm font-bold text-[#0f1e3d] dark:text-gray-50">Preview Mode — read-only + actions</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mt-1">
                Exactly how the story looks to readers. This is where your action buttons appear:
                Save as Draft, Publish (for your own Draft stories), Approve/Reject (for Pending
                stories). The first button now shows a <strong>blue pencil</strong> to go back to
                editing.
              </p>
            </div>
          </div>
        </div>

        <Note>
          You can't save or publish from Write Mode. You must switch to Preview Mode first.
        </Note>
      </Section>

      {/* ── 5. Autosave & Recovery ── */}
      <Section id="autosave" icon={<Clock size={16} />} title="Autosave & Draft Recovery">
        <Sub>Autosave</Sub>
        <P>
          The editor saves automatically in the background as you type. Look at the{" "}
          <strong>top-left corner</strong> of the editor for the status:
        </P>
        <Bullets
          items={[
            <><strong>Saving…</strong> — autosave is running</>,
            <><strong>Saved</strong> — changes are backed up on the server</>,
            <><strong>Failed</strong> — save didn't go through. Check your connection.</>,
          ]}
        />
        <Tip>
          Autosave only starts after you've typed a title. On new stories, type your title
          first — everything else will save automatically from there.
        </Tip>

        <Sub>Local draft recovery</Sub>
        <P>
          The editor also keeps a local backup in your browser. If you close the tab, lose
          connection, or your browser crashes, your work is backed up locally.
        </P>
        <P>
          When you reopen the story, a <strong>yellow recovery banner</strong> may appear at the
          top — click <strong>Restore</strong> to apply the backed-up content, or{" "}
          <strong>Dismiss</strong> to keep the last server-saved version.
        </P>
      </Section>

      {/* ── 6. Managing All Stories ── */}
      <Section id="all-stories" icon={<BookCheck size={16} />} title="Managing All Stories">
        <P>
          The All Stories page shows every story from every writer on the platform. This is your
          main content moderation view.
        </P>

        <Sub>How to get there</Sub>
        <P>
          Click the <strong>Stories</strong> stat card on your dashboard, or use any filtered link
          (e.g. the Needs Attention pending count).
        </P>

        <Sub>Filtering and searching</Sub>
        <Bullets
          items={[
            <><strong>Status tabs</strong> (Draft / Pending / Published) — switch between them to see stories in that status.</>,
            <><strong>Search box</strong> — type any part of a story title. Results update as you type (with a short delay).</>,
          ]}
        />

        <Sub>What each story card shows</Sub>
        <Bullets
          items={[
            "Author name and avatar",
            "Story title and subtitle",
            "Status badge (Draft / Pending / Published)",
            "Creation date and last updated date",
            "View count (published stories)",
          ]}
        />
        <P>Click any card to open and edit the story.</P>

        <Sub>Story card action buttons</Sub>
        <P>
          Each card has action buttons that change depending on the story's status:
        </P>
        <div className="flex flex-col gap-2.5">
          <ActionRow
            colorClass="bg-green-100 text-green-700 dark:bg-[#022C22] dark:text-[#6EE7B7]"
            icon={<Rocket size={14} />}
            label="Draft — Publish"
            description="Publishes the story immediately after a confirmation popup."
          />
          <ActionRow
            colorClass="bg-green-100 text-green-700 dark:bg-[#022C22] dark:text-[#6EE7B7]"
            icon={<CheckCircle2 size={14} />}
            label="Pending — Approve"
            description="Approves and publishes the story. Sends email + push to subscribers."
          />
          <ActionRow
            colorClass="bg-blue-100 text-blue-700 dark:bg-[#1e3a5f] dark:text-[#93c5fd]"
            icon={<XCircle size={14} />}
            label="Pending — Reject"
            description="Returns the story to Draft. You can optionally leave feedback for the writer."
          />
          <ActionRow
            colorClass="bg-blue-100 text-blue-700 dark:bg-[#1e3a5f] dark:text-[#93c5fd]"
            icon={<EyeOff size={14} />}
            label="Published — Unpublish"
            description="Takes the story offline immediately. Single click, no confirm needed."
          />
          <ActionRow
            colorClass="bg-purple-100 text-purple-700 dark:bg-[#2E1065] dark:text-[#C4B5FD]"
            icon={<BarChart2 size={14} />}
            label="Published — Analytics"
            description="Opens the per-story view analytics page."
          />
          <ActionRow
            colorClass="bg-red-100 text-red-700 dark:bg-[#3b0f0f] dark:text-[#fca5a5]"
            icon={<Trash2 size={14} />}
            label="Any status — Delete"
            description="Permanently deletes the story. Requires typing DELETE to confirm."
          />
        </div>
      </Section>

      {/* ── 7. Reviewing Pending Stories ── */}
      <Section id="reviewing" icon={<CheckSquare size={16} />} title="Reviewing Pending Stories">
        <P>
          Pending stories are ones writers have submitted for your review. Check the{" "}
          <strong>Needs Attention</strong> card on your dashboard — it shows the count and links
          directly to the Pending list.
        </P>

        <Sub>Approve</Sub>
        <P>
          Click the <strong>green checkmark</strong> button on any Pending story. A confirmation
          popup appears. Confirm to publish the story immediately.
        </P>
        <P>
          After approving: the story goes live on the website, all email subscribers receive the
          Story Mail (if it was written), and all subscribed devices receive a push notification.
        </P>
        <Note>
          If no Story Mail is attached, a warning appears in the confirmation popup. You can still
          approve — the story will publish, but subscribers won't be emailed about it.
        </Note>

        <Sub>Reject</Sub>
        <P>
          Click the <strong>blue X</strong> button. A popup appears where you can optionally type
          feedback explaining why the story is being sent back. The writer sees this message as a
          yellow banner inside their story editor when they reopen it.
        </P>
        <P>
          After rejecting: the story returns to Draft status and the writer can revise and resubmit.
        </P>
      </Section>

      {/* ── 8. Publishing & Unpublishing ── */}
      <Section id="publish" icon={<Rocket size={16} />} title="Publishing & Unpublishing">
        <div className="flex flex-col gap-4">
          <div className="flex gap-3 items-start p-4 bg-green-50/50 dark:bg-[#022C22]/20 border border-green-100 dark:border-[#022C22] rounded-xl">
            <div className="w-9 h-9 rounded-full bg-green-100 dark:bg-[#022C22] text-green-700 dark:text-[#6EE7B7] flex items-center justify-center flex-shrink-0">
              <Rocket size={15} />
            </div>
            <div>
              <p className="text-sm font-bold text-[#0f1e3d] dark:text-gray-50">Publish (green rocket)</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mt-1">
                Available on Draft stories. A confirmation popup appears first. If no Story Mail is
                attached, a warning appears in the popup — you can still proceed, but no email goes
                out to subscribers.
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start p-4 bg-blue-50/50 dark:bg-[#1e3a5f]/20 border border-blue-100 dark:border-[#1e3a5f] rounded-xl">
            <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-[#1e3a5f] text-blue-700 dark:text-[#93c5fd] flex items-center justify-center flex-shrink-0">
              <EyeOff size={15} />
            </div>
            <div>
              <p className="text-sm font-bold text-[#0f1e3d] dark:text-gray-50">Unpublish (eye-off icon)</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mt-1">
                Available on Published stories. Single click — no confirmation popup. The story
                is immediately taken offline, returns to Draft status, and disappears from the
                public site. Subscribers are not notified.
              </p>
            </div>
          </div>
        </div>

        <Sub>What publishing triggers</Sub>
        <Bullets
          items={[
            "Story appears on the public website immediately",
            "Email sent to all subscribers (if Story Mail is attached)",
            "Push notification sent to all subscribed devices",
          ]}
        />
      </Section>

      {/* ── 9. Bulk Actions ── */}
      <Section id="bulk-actions" icon={<CheckSquare size={16} />} title="Bulk Actions">
        <P>
          When you need to act on multiple stories at once — bulk publish, approve, reject,
          unpublish, or delete.
        </P>

        <Sub>How to select stories</Sub>
        <Steps
          items={[
            "Hover any story card — a checkbox appears in the corner.",
            "Click the checkbox to select that story.",
            "Select one or more stories and the Bulk Action Bar slides up from the bottom of the screen.",
          ]}
        />

        <Sub>Bulk Action Bar controls</Sub>
        <Bullets
          items={[
            <><strong>Select All</strong> — selects every card visible on the current page.</>,
            <><strong>Deselect All</strong> — clears all selections.</>,
            <><strong>Bulk Publish</strong> — appears when you're on the Draft tab.</>,
            <><strong>Bulk Approve / Bulk Reject</strong> — appears on the Pending tab.</>,
            <><strong>Bulk Unpublish</strong> — appears on the Published tab.</>,
            <><strong>Bulk Delete</strong> — always visible. Two-click safety: first click turns the button red, second click confirms. All selected stories are permanently deleted.</>,
            <><strong>Dismiss (X)</strong> — exits selection mode and clears selections.</>,
          ]}
        />

        <Tip>
          Bulk actions on the Pending tab let you review multiple stories at once — very useful
          when a lot of content has been submitted.
        </Tip>
      </Section>

      {/* ── 10. Deleting a Story ── */}
      <Section id="delete-story" icon={<Trash2 size={16} />} title="Deleting a Story">
        <P>
          You can delete any story regardless of status — Draft, Pending, or Published. Deletion
          is available from story cards and from inside the story editor.
        </P>

        <Steps
          items={[
            "Click the red trash icon on the story card or in the floating panel inside the editor.",
            'A popup appears. Type "DELETE" (all caps, exactly) into the field.',
            "The Delete button becomes active — click it to confirm.",
          ]}
        />

        <Note>
          Deletion is permanent. There is no undo and no way to recover a deleted story.
        </Note>
      </Section>

      {/* ── 11. Per-Story Analytics ── */}
      <Section id="story-analytics" icon={<BarChart2 size={16} />} title="Per-Story Analytics">
        <P>
          See detailed view data for any published story. Available via the purple chart icon on
          Published story cards, or from the floating panel inside the story editor.
        </P>

        <Sub>What the analytics page shows</Sub>
        <div className="flex flex-col gap-2.5">
          {[
            {
              label: "Total views",
              desc: "How many times this story has been read in total, across all time.",
            },
            {
              label: "Peak day",
              desc: "The single day with the highest view count — shows when the story was at its most popular.",
            },
            {
              label: "Daily views chart",
              desc: "A 30-day line graph showing view counts per day. Helps you see traffic spikes, growth trends, and how a story performs over time.",
            },
          ].map(({ label, desc }) => (
            <div
              key={label}
              className="p-3.5 bg-gray-50 dark:bg-[#1e2130] rounded-xl border border-gray-100 dark:border-white/[0.04]"
            >
              <p className="text-sm font-bold text-[#0f1e3d] dark:text-gray-50">{label}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── 12. Story Mail ── */}
      <Section id="story-mail" icon={<Mail size={16} />} title="Story Mail">
        <P>
          Story Mail is the email that goes out to all subscribers when a story is published. As
          a Master, you can access and edit Story Mail on <strong>any story</strong> — not just
          your own.
        </P>

        <Sub>Where to find it</Sub>
        <P>
          Click the <strong>red mail icon</strong> on any story card, or on the floating panel
          in the story editor. This opens the Story Mail editor for that story.
        </P>

        <Sub>What to fill in</Sub>
        <Bullets
          items={[
            <><strong>Subject</strong> — the email subject line. Subscribers see this first in their inbox.</>,
            <><strong>Body</strong> — the email content. A short, warm intro and teaser that links through to the story.</>,
          ]}
        />

        <Sub>Personalisation</Sub>
        <P>
          Click the <strong>+ name</strong> button to insert{" "}
          <code className="text-xs bg-gray-100 dark:bg-[#1e2130] px-1.5 py-0.5 rounded font-mono">
            {`{{name}}`}
          </code>{" "}
          anywhere in the subject or body. This is replaced with each subscriber's actual name
          when the email sends.
        </P>

        <Sub>Use Template</Sub>
        <P>
          Click <strong>Use Template</strong> to fill in a ready-made Korner-branded email. Only
          visible when no mail exists for the story yet.
        </P>

        <Note>
          When you try to publish or approve a story with no Story Mail attached, a warning appears
          in the confirmation popup. You can still proceed — the story publishes, but subscribers
          won't be emailed about it.
        </Note>
      </Section>

      {/* ── 13. Newsletter ── */}
      <Section id="newsletter" icon={<Newspaper size={16} />} title="Newsletter">
        <P>
          Newsletter lets you send a standalone email to all subscribers — not tied to any specific
          story. Use it for platform updates, announcements, or curated content roundups.
        </P>

        <Sub>Access</Sub>
        <P>
          Tap the <strong>+</strong> floating button on any admin page → <strong>Newsletter</strong>.
        </P>

        <Sub>Compose tab</Sub>
        <Bullets
          items={[
            <><strong>Header Image</strong> — optional image at the top of the email.</>,
            <><strong>Subject</strong> — email subject line. Supports {`{{name}}`} personalisation.</>,
            <><strong>Body</strong> — email content. Supports {`{{name}}`} personalisation and basic formatting.</>,
            <>
              <strong>Send mode:</strong>
              <ul className="mt-1 space-y-1">
                <li><em>Send now</em> — sends immediately after confirmation.</li>
                <li><em>Schedule</em> — pick a date and time for it to go out automatically.</li>
              </ul>
            </>,
          ]}
        />

        <Sub>History tab</Sub>
        <Bullets
          items={[
            <><strong>Sent:</strong> Resend (loads content into Compose as a fresh draft) or Delete from history (does not unsend).</>,
            <><strong>Scheduled:</strong> Edit (change content or timing before it sends) or Cancel (stops it from sending).</>,
          ]}
        />
      </Section>

      {/* ── 14. Push Notifications ── */}
      <Section id="push" icon={<Bell size={16} />} title="Push Notifications">
        <P>
          Send real-time push notifications to all subscribed devices — phones and browsers that
          have opted in. Go to Push from the navigation or via the Push stat card on your dashboard.
        </P>

        <Sub>Stats at the top</Sub>
        <Bullets
          items={[
            <><strong>Subscribed devices</strong> — total number of devices that have ever opted in.</>,
            <><strong>Reachable right now</strong> — devices that are currently active and will receive the broadcast.</>,
          ]}
        />

        <Sub>Composing a broadcast</Sub>
        <Bullets
          items={[
            <><strong>Title</strong> (required) — the bold headline of the notification.</>,
            <><strong>Message</strong> (required) — the body text.</>,
            <><strong>Link</strong> (optional) — a URL that opens when a subscriber taps the notification. Use a story URL to drive traffic directly to a piece of content.</>,
            <><strong>Image</strong> (optional) — an image shown alongside the notification on devices that support it.</>,
          ]}
        />

        <Sub>Two-click send (safety measure)</Sub>
        <Steps
          items={[
            <>Click <strong>Send broadcast</strong>. A notification preview appears showing exactly how it'll look, plus the exact reach count.</>,
            <>Click <strong>Click again to confirm</strong> to send.</>,
          ]}
        />
        <Tip>
          Editing any field while in the confirm state resets it back to step one. You'll need to
          click "Send broadcast" again to re-enter confirm state.
        </Tip>

        <Sub>Broadcast history & stats</Sub>
        <P>
          Below the composer is a list of recent broadcasts. Click{" "}
          <strong>Check stats</strong> on any past send to see:
        </P>
        <Bullets
          items={[
            "How many devices received it (delivered count)",
            "How many devices tapped it (click-through count)",
          ]}
        />
      </Section>

      {/* ── 15. Subscribers ── */}
      <Section id="subscribers" icon={<Users size={16} />} title="Subscribers">
        <P>
          Your full list of email subscribers. Access from the Subscribers stat card on your
          dashboard.
        </P>

        <Sub>What each row shows</Sub>
        <Bullets
          items={[
            "Subscriber name (or — if they didn't provide one)",
            "Email address",
            "Join date",
          ]}
        />

        <Sub>Search</Sub>
        <P>
          Use the search bar at the top to filter by name or email. The list updates as you type.
        </P>

        <Sub>Removing a subscriber</Sub>
        <Steps
          items={[
            "Click the remove icon on a subscriber's row.",
            "Two buttons appear: Cancel and Confirm (red).",
            "Click Confirm to complete the removal.",
          ]}
        />
        <Note>
          Removing a subscriber unsubscribes them from all future emails immediately. This cannot
          be undone from the panel.
        </Note>
      </Section>

      {/* ── 16. Managing Writers ── */}
      <Section id="managing-writers" icon={<UserCheck size={16} />} title="Managing Writers">
        <P>
          The Writers page lists every admin account on the platform, split into two sections:
          Masters (gold heading) and Writers (gray heading). Your own account is always listed
          first in the Masters section.
        </P>

        <Sub>Verification status</Sub>
        <Bullets
          items={[
            <><strong>Green ring</strong> on avatar — verified. Active team member.</>,
            <><strong>Red pulsing ring</strong> — not verified yet. New accounts start unverified.</>,
          ]}
        />
        <P>
          New accounts created via sign-up are unverified by default. They can use the panel but
          aren't confirmed as part of the team until you verify them.
        </P>

        <Sub>Verify / Unverify</Sub>
        <P>
          Click the <strong>green Verify</strong> button on an unverified writer to mark them as
          verified. Click <strong>Unverify</strong> to reverse this.
        </P>

        <Sub>View a writer's stories</Sub>
        <P>
          Click anywhere on a writer's card (other than the action buttons) to go to a filtered
          list of all their stories.
        </P>

        <Sub>Open a writer's detail card</Sub>
        <P>
          Click their <strong>avatar</strong> to open a popup with their full profile and management
          options.
        </P>

        <Sub>Promote to Master</Sub>
        <P>
          From a writer's detail card, click <strong>Promote to Master</strong>. They immediately
          gain full Master access — the full dashboard, publishing rights, bulk actions, subscriber
          management, push notifications, Writers page, and Activity Log. No confirmation popup.
          Reversible at any time.
        </P>

        <Sub>Demote to Writer</Sub>
        <P>
          From a Master's detail card, click <strong>Demote to Writer</strong>. They lose all
          master-level access immediately and are moved back to the Writers section. No confirmation
          popup.
        </P>

        <Sub>Delete an admin</Sub>
        <Steps
          items={[
            "Open the admin's detail card (click their avatar).",
            'Click "Delete Admin".',
            'Type "DELETE" (all caps) into the field to unlock the delete button.',
            "Click Delete to confirm.",
          ]}
        />
        <Note>
          You cannot delete an admin who still has stories. Their stories must be deleted first.
        </Note>

        <Sub>Protected account</Sub>
        <P>
          The founder/CEO account has a <strong>Protected</strong> badge. This account cannot be
          demoted or deleted by anyone — including other Masters. The management options are hidden
          for this account.
        </P>
      </Section>

      {/* ── 17. Activity Log ── */}
      <Section id="activity-log" icon={<ScrollText size={16} />} title="Activity Log">
        <P>
          The Activity Log is a full, timestamped record of every important action taken on the
          platform by any admin. Access it from the navigation or from the Activity card on your
          dashboard.
        </P>

        <Sub>Colour coding</Sub>
        <div className="flex flex-col gap-2">
          {[
            { color: "bg-green-500", label: "Green", desc: "Something published or approved" },
            { color: "bg-red-500", label: "Red", desc: "Something deleted, rejected, or unpublished" },
            { color: "bg-blue-500", label: "Blue", desc: "A story submitted, or a newsletter/push sent" },
            { color: "bg-purple-500", label: "Purple", desc: "An admin's role changed (promoted or demoted)" },
            { color: "bg-amber-500", label: "Amber", desc: "A subscriber removed" },
          ].map(({ color, label, desc }) => (
            <div key={label} className="flex gap-2.5 items-center">
              <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${color}`} />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                <strong className="text-[#0f1e3d] dark:text-gray-100">{label}</strong> — {desc}
              </span>
            </div>
          ))}
        </div>

        <Sub>What each entry shows</Sub>
        <Bullets
          items={[
            "Who performed the action (admin name in bold)",
            "What they did and to what",
            "Exact date and time, plus a relative timestamp (e.g. 2 hours ago)",
          ]}
        />

        <P>The log shows 30 entries per page. Use the page controls at the bottom to go further back in history.</P>
      </Section>

      {/* ── 18. Profile ── */}
      <Section id="profile" icon={<User size={16} />} title="Your Profile">
        <P>
          Click your avatar or name at the <strong>top-left corner</strong> of the navbar to open
          your profile.
        </P>
        <Sub>What you can update</Sub>
        <Bullets
          items={[
            <><strong>Name</strong> — how your name appears across the admin panel and on your published stories.</>,
            <><strong>Bio</strong> — shown at the bottom of your published stories.</>,
            <><strong>Profile photo</strong> — upload a new avatar.</>,
          ]}
        />
        <Sub>Changing your password</Sub>
        <P>
          Click <strong>Change password</strong> inside your profile. You'll need your current
          password first.
        </P>
        <Note>
          Your email address cannot be changed from the profile panel. If it needs updating,
          it requires direct database access or technical support.
        </Note>
      </Section>

    </div>
  );
}
