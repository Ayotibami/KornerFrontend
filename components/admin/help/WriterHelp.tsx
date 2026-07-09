import {
  Home,
  PenSquare,
  Layers,
  Eye,
  Clock,
  Send,
  Mail,
  Newspaper,
  User,
  AlignLeft,
  Heading1,
  Quote,
  ImageIcon,
  Bookmark,
  RotateCcw,
  Pencil,
  Bold,
  Italic,
  List,
  ListOrdered,
  Plus,
  Trash2,
  SendHorizonal,
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

export const WRITER_NAV = [
  { id: "home-page", title: "Your Home Page" },
  { id: "creating-story", title: "Creating a Story" },
  { id: "block-editor", title: "The Block Editor" },
  { id: "write-preview", title: "Write vs Preview Mode" },
  { id: "autosave", title: "Autosave & Recovery" },
  { id: "save-submit", title: "Saving & Submitting" },
  { id: "story-statuses", title: "Story Statuses" },
  { id: "story-mail", title: "Story Mail" },
  { id: "newsletter", title: "Newsletter" },
  { id: "profile", title: "Your Profile" },
];

export default function WriterHelp() {
  return (
    <div className="flex flex-col gap-5">

      {/* ── 1. Home Page ── */}
      <Section id="home-page" icon={<Home size={16} />} title="Your Home Page">
        <P>
          When you log in, your home page is your personal writing dashboard. Everything here is
          scoped to your own stories — nothing from other writers.
        </P>

        <Sub>Stats banner</Sub>
        <P>
          At the top of the page you'll see five numbers: <strong>Total</strong> (all your stories
          combined), <strong>Draft</strong>, <strong>Pending</strong>, <strong>Published</strong>,
          and <strong>Views</strong> (total reads across all your published stories).
        </P>

        <Sub>Story tabs</Sub>
        <P>
          Below the stats are three filter tabs — Draft, Pending, and Published. Click any of them
          to see only your stories in that category. The active tab is highlighted. Your stories are
          always grouped by their current status.
        </P>

        <Sub>Story cards</Sub>
        <P>
          Each card shows the story title, subtitle, status badge, when it was last updated, and
          (if published) total view count. Click a card to open the story editor.
        </P>

        <Sub>Quick actions on cards</Sub>
        <P>
          You don't always need to open a story to act on it. Each card has buttons at the bottom:
        </P>
        <div className="flex flex-col gap-2.5">
          <ActionRow
            colorClass="bg-amber-100 text-amber-700 dark:bg-[#422006] dark:text-[#FDE68A]"
            icon={<SendHorizonal size={14} />}
            label="Draft card — Submit for review"
            description="One tap sends the story to Pending. No need to open it."
          />
          <ActionRow
            colorClass="bg-blue-100 text-blue-700 dark:bg-[#1e3a5f] dark:text-[#93c5fd]"
            icon={<RotateCcw size={14} />}
            label="Pending card — Revert to Draft"
            description="Changed your mind? Pull the story back to Draft so you can keep editing."
          />
          <ActionRow
            colorClass="bg-red-100 text-red-700 dark:bg-[#3b0f0f] dark:text-[#fca5a5]"
            icon={<Mail size={14} />}
            label="Any card — Story Mail"
            description="Opens the Story Mail editor for that story without opening the full editor."
          />
        </div>

        <Sub>The + button (Speed Dial)</Sub>
        <P>
          A floating + button lives at the bottom-right corner of every admin page. Tap it to open
          a quick menu with two options: <strong>Create new story</strong> and{" "}
          <strong>Newsletter</strong>.
        </P>
      </Section>

      {/* ── 2. Creating a Story ── */}
      <Section id="creating-story" icon={<PenSquare size={16} />} title="Creating a Story">
        <Steps
          items={[
            <>
              Tap the <strong>+</strong> floating button at the bottom-right corner of any admin
              page and choose <strong>Create new story</strong>.
            </>,
            <>The story editor opens. Fill in the details at the top of the page.</>,
            <>Build the story body below using content blocks (see the Block Editor section).</>,
            <>
              When you're ready, switch to Preview Mode and save as draft or submit for review.
            </>,
          ]}
        />

        <Sub>Story detail fields</Sub>
        <div className="flex flex-col gap-3">
          <div className="p-4 bg-gray-50 dark:bg-[#1e2130] rounded-xl border border-gray-100 dark:border-white/[0.04]">
            <p className="text-sm font-bold text-[#0f1e3d] dark:text-gray-50 mb-1">Cover Image</p>
            <P>
              Click to upload the main image. This is the first thing readers see — it appears at
              the top of the story page and on story cards across the website. Not required, but
              strongly recommended.
            </P>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-[#1e2130] rounded-xl border border-gray-100 dark:border-white/[0.04]">
            <p className="text-sm font-bold text-[#0f1e3d] dark:text-gray-50 mb-1">Title</p>
            <P>The name of your story. This is required — autosave won't start until you have a title.</P>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-[#1e2130] rounded-xl border border-gray-100 dark:border-white/[0.04]">
            <p className="text-sm font-bold text-[#0f1e3d] dark:text-gray-50 mb-1">Subtitle</p>
            <P>A supporting line that appears below the title. Optional but adds context.</P>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-[#1e2130] rounded-xl border border-gray-100 dark:border-white/[0.04]">
            <p className="text-sm font-bold text-[#0f1e3d] dark:text-gray-50 mb-1">Excerpt</p>
            <P>
              A 1–2 sentence summary of your story. This is what shows up on story cards across the
              website. Write it like a hook — give readers a reason to click.
            </P>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-[#1e2130] rounded-xl border border-gray-100 dark:border-white/[0.04]">
            <p className="text-sm font-bold text-[#0f1e3d] dark:text-gray-50 mb-1">Reading Time</p>
            <P>Type this yourself. Example: "5 min read". Gives readers an idea of the commitment before they start.</P>
          </div>
        </div>
      </Section>

      {/* ── 3. Block Editor ── */}
      <Section id="block-editor" icon={<Layers size={16} />} title="The Block Editor">
        <P>
          Your story body is made up of content blocks. Each block is one piece of content — a
          paragraph, a heading, a quote, or an image. You stack these together to build your full
          story.
        </P>

        <Sub>Adding blocks</Sub>
        <P>
          Click the <strong>+</strong> button that appears between existing blocks (or at the bottom
          when no blocks exist yet) to insert a new block at that position. Choose a block type from
          the menu that appears.
        </P>

        <Sub>Deleting blocks</Sub>
        <P>
          Each block has a <strong>delete icon</strong> on its right side. Click it to remove that
          block. The remaining blocks automatically shift up to fill the gap.
        </P>

        <Sub>The four block types</Sub>
        <div className="flex flex-col gap-3">
          <BlockCard
            icon={<AlignLeft size={16} />}
            name="Paragraph"
            description={
              <>
                Your main writing tool. Use this for regular story text. The paragraph block has a
                rich text toolbar at the top that gives you:{" "}
                <strong>Bold</strong>, <strong>Italic</strong>, <strong>Bullet list</strong>, and{" "}
                <strong>Numbered list</strong>. Highlight any text to reveal the formatting toolbar.
              </>
            }
            usage="Story body text, descriptions, explanations, narrative"
          />
          <BlockCard
            icon={<Heading1 size={16} />}
            name="Heading"
            description={
              <>
                A section title. Renders as large, bold text that visually separates parts of your
                story. Type directly into the field — no rich text formatting here, just the heading
                text itself.
              </>
            }
            usage="Section titles, chapter breaks, topic transitions"
          />
          <BlockCard
            icon={<Quote size={16} />}
            name="Quote"
            description={
              <>
                A standout statement. Renders with a large decorative quotation mark and italic
                styling — visually distinct from regular paragraphs. The quote block also supports
                basic formatting (bold, italic) via a text toolbar.
              </>
            }
            usage="Key quotes, memorable lines, important insights you want to highlight"
          />
          <BlockCard
            icon={<ImageIcon size={16} />}
            name="Image"
            description={
              <>
                Upload a photo directly into your story body. Click the block to open your file
                picker and choose an image from your device. The image shows a local preview
                immediately — the actual upload to the server happens when you save or submit.
              </>
            }
            usage="Inline photos, illustrations, screenshots within the story body"
          />
        </div>

        <Sub>Paragraph formatting — full breakdown</Sub>
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            {[
              { icon: <Bold size={13} />, label: "Bold" },
              { icon: <Italic size={13} />, label: "Italic" },
              { icon: <List size={13} />, label: "Bullet list" },
              { icon: <ListOrdered size={13} />, label: "Numbered list" },
            ].map(({ icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-[#1e2130] rounded-lg border border-gray-100 dark:border-white/[0.06] text-sm font-medium text-[#0f1e3d] dark:text-gray-200"
              >
                {icon}
                {label}
              </div>
            ))}
          </div>
          <Tip>
            Highlight any text inside a paragraph block to see the formatting toolbar appear. You
            can mix bold and italic in the same paragraph freely.
          </Tip>
        </div>
      </Section>

      {/* ── 4. Write vs Preview Mode ── */}
      <Section id="write-preview" icon={<Eye size={16} />} title="Write vs Preview Mode">
        <P>
          The story editor has two modes. You switch between them using the <strong>first button</strong>{" "}
          in the floating action panel on the right side of the screen. It's always the first button
          regardless of which mode you're in — so you always know where to tap to toggle.
        </P>

        <div className="flex flex-col gap-3">
          <div className="flex gap-3 items-start p-4 bg-secondary/20 dark:bg-[#1e3a5f]/30 border border-secondary dark:border-[#1e3a5f] rounded-xl">
            <div className="w-9 h-9 rounded-full bg-secondary dark:bg-[#1e3a5f] text-primary dark:text-[#93b8f0] flex items-center justify-center flex-shrink-0">
              <Pencil size={15} />
            </div>
            <div>
              <p className="text-sm font-bold text-[#0f1e3d] dark:text-gray-50">
                Write Mode — where you edit
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mt-1">
                All your blocks are interactive. Type, format, add or delete blocks here. Only the{" "}
                <strong>violet eye button</strong> appears in the panel — click it to switch to
                preview.
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start p-4 bg-purple-50/40 dark:bg-[#2E1065]/20 border border-purple-100 dark:border-[#2E1065] rounded-xl">
            <div className="w-9 h-9 rounded-full bg-purple-100 dark:bg-[#2E1065] text-purple-600 dark:text-[#C4B5FD] flex items-center justify-center flex-shrink-0">
              <Eye size={15} />
            </div>
            <div>
              <p className="text-sm font-bold text-[#0f1e3d] dark:text-gray-50">
                Preview Mode — how readers see it
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mt-1">
                Read-only view of your story exactly as it will appear to readers. No editing here.
                This is where the <strong>Save as Draft</strong> and{" "}
                <strong>Submit for Review</strong> buttons appear. The first button now shows a{" "}
                <strong>blue pencil</strong> — click to go back to editing.
              </p>
            </div>
          </div>
        </div>

        <Note>
          You cannot save or submit from Write Mode. You must switch to Preview Mode first. This
          is intentional — it makes sure you see how the story looks before sending it out.
        </Note>
      </Section>

      {/* ── 5. Autosave & Recovery ── */}
      <Section id="autosave" icon={<Clock size={16} />} title="Autosave & Draft Recovery">
        <Sub>Autosave</Sub>
        <P>
          The editor saves your work automatically in the background as you type. You don't need
          to manually save to avoid losing progress.
        </P>
        <P>
          Look at the <strong>top-left corner</strong> of the editor for the save status indicator:
        </P>
        <Bullets
          items={[
            <><strong>Saving…</strong> — autosave is running right now</>,
            <><strong>Saved</strong> — your latest changes are backed up on the server</>,
            <><strong>Failed</strong> — the save didn't go through. Check your connection and try again.</>,
          ]}
        />
        <Tip>
          Autosave only kicks in once you've typed a title. On a brand new story, type your title
          first and the rest will save automatically as you write.
        </Tip>

        <Sub>Local draft recovery</Sub>
        <P>
          In addition to autosave, the editor keeps a local backup of your changes in your browser.
          If your internet cuts out, your browser crashes, or you accidentally close the tab, your
          content is not necessarily lost.
        </P>
        <P>
          When you reopen the story, a <strong>yellow recovery banner</strong> may appear at the
          top:
        </P>
        <Bullets
          items={[
            <><strong>Restore</strong> — applies your backed-up local content</>,
            <><strong>Dismiss</strong> — ignores the backup and keeps the last server-saved version</>,
          ]}
        />
        <Note>
          The local backup is tied to your browser and device. If you switch to a different
          browser or device, the backup won't be there — but autosave will have already saved
          everything to the server.
        </Note>
      </Section>

      {/* ── 6. Saving & Submitting ── */}
      <Section id="save-submit" icon={<Send size={16} />} title="Saving & Submitting">
        <P>
          Both actions are available in <strong>Preview Mode</strong>. Switch to it using the first
          floating button on the right side of the screen.
        </P>

        <div className="flex flex-col gap-3">
          <div className="flex gap-3 items-start p-4 bg-teal-50/50 dark:bg-[#022C22]/20 border border-teal-100 dark:border-[#022C22] rounded-xl">
            <div className="w-9 h-9 rounded-full bg-teal-100 dark:bg-[#022C22] text-teal-700 dark:text-[#6EE7B7] flex items-center justify-center flex-shrink-0">
              <Bookmark size={15} />
            </div>
            <div>
              <p className="text-sm font-bold text-[#0f1e3d] dark:text-gray-50">
                Save as Draft (teal bookmark icon)
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mt-1">
                Saves your story privately. No one can see it yet — it stays in your Draft list
                on the home page. Come back and keep editing whenever you want.
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                On the edit page (not a new story), this button only appears when you've actually
                made changes. If you haven't changed anything, there's nothing to save.
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start p-4 bg-amber-50/50 dark:bg-[#422006]/20 border border-amber-100 dark:border-[#422006] rounded-xl">
            <div className="w-9 h-9 rounded-full bg-amber-100 dark:bg-[#422006] text-amber-700 dark:text-[#FDE68A] flex items-center justify-center flex-shrink-0">
              <SendHorizonal size={15} />
            </div>
            <div>
              <p className="text-sm font-bold text-[#0f1e3d] dark:text-gray-50">
                Submit for Review (amber paper-plane icon)
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mt-1">
                Sends your story to the Masters for approval. The story moves to Pending status.
                You can still see it on your home page, but you can no longer edit it while
                it's waiting for a decision.
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                Changed your mind? Go to your home page → Pending tab → click the blue rotate
                icon on the story card to pull it back to Draft.
              </p>
            </div>
          </div>
        </div>

        <Sub>What happens after you submit</Sub>
        <P>
          A Master reviews your story. They will either:
        </P>
        <Bullets
          items={[
            <>
              <strong>Approve</strong> — the story goes live immediately on the website. If you
              wrote a Story Mail, all subscribers get an email. A push notification also goes out
              to subscribed devices.
            </>,
            <>
              <strong>Reject</strong> — the story goes back to Draft. If the Master left feedback,
              you'll see a yellow banner inside the story editor when you reopen it explaining what
              to change. Revise and resubmit when ready.
            </>,
          ]}
        />
      </Section>

      {/* ── 7. Story Statuses ── */}
      <Section id="story-statuses" icon={<Layers size={16} />} title="Story Statuses">
        <P>
          Every story is always in one of three states. Here's what each one means and what you
          can do in it:
        </P>
        <div className="flex flex-col gap-3">
          <StatusRow
            label="Draft"
            colorClass="bg-blue-50/50 dark:bg-[#1e3a5f]/20 border-blue-100 dark:border-[#1e3a5f]"
            badgeClass="bg-blue-100 text-blue-700 dark:bg-[#1e3a5f] dark:text-[#93c5fd]"
            description="Your story is private. Only you can see it. You have full editing access. Take your time — there's no pressure at this stage. You can also submit for review directly from the story card on your home page."
          />
          <StatusRow
            label="Pending"
            colorClass="bg-amber-50/50 dark:bg-[#422006]/20 border-amber-100 dark:border-[#422006]"
            badgeClass="bg-amber-100 text-amber-700 dark:bg-[#422006] dark:text-[#FDE68A]"
            description="You've submitted the story for review. A Master is looking at it. You cannot edit it while it's in this state. If you need to make changes, use the blue rotate button on its card to pull it back to Draft."
          />
          <StatusRow
            label="Published"
            colorClass="bg-green-50/50 dark:bg-[#022C22]/20 border-green-100 dark:border-[#022C22]"
            badgeClass="bg-green-100 text-green-700 dark:bg-[#022C22] dark:text-[#6EE7B7]"
            description="Your story is live on the website. Anyone can read it. Subscribers were emailed and push-notified when it went live. Once published, only a Master can unpublish it."
          />
        </div>
      </Section>

      {/* ── 8. Story Mail ── */}
      <Section id="story-mail" icon={<Mail size={16} />} title="Story Mail">
        <P>
          Story Mail is the email that goes out to all subscribers when your story is published.
          It's your story's announcement — it's what shows up in people's inboxes and gives
          them a reason to click through and read.
        </P>

        <Sub>Where to find it</Sub>
        <P>
          Click the <strong>red mail icon</strong> on any story card on your home page, or on the
          floating action panel in the story editor.
        </P>

        <Sub>What to fill in</Sub>
        <div className="flex flex-col gap-3">
          <div className="p-4 bg-gray-50 dark:bg-[#1e2130] rounded-xl border border-gray-100 dark:border-white/[0.04]">
            <p className="text-sm font-bold text-[#0f1e3d] dark:text-gray-50 mb-1">Subject</p>
            <P>
              The email subject line subscribers see in their inbox. This is what gets them to
              open the email — make it interesting.
            </P>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-[#1e2130] rounded-xl border border-gray-100 dark:border-white/[0.04]">
            <p className="text-sm font-bold text-[#0f1e3d] dark:text-gray-50 mb-1">Body</p>
            <P>
              The email content. A short, warm intro and a teaser that makes people want to click
              through. Keep it concise — the full story is just one click away.
            </P>
          </div>
        </div>

        <Sub>Personalisation with {`{{name}}`}</Sub>
        <P>
          Click the <strong>+ name</strong> button anywhere in the subject or body to insert the{" "}
          <code className="text-xs bg-gray-100 dark:bg-[#1e2130] px-1.5 py-0.5 rounded font-mono">
            {`{{name}}`}
          </code>{" "}
          token. When the email goes out, this is automatically replaced with each subscriber's
          actual name. For example: <em>"Hey {`{{name}}`}, something new just dropped"</em> becomes{" "}
          <em>"Hey Amaka, something new just dropped"</em> for each recipient.
        </P>

        <Sub>Use Template</Sub>
        <P>
          Don't want to write the email from scratch? Click <strong>Use Template</strong> to
          auto-fill a ready-made Korner-branded email you can customise. This button only
          appears when no mail has been written for the story yet.
        </P>

        <Tip>
          Write your Story Mail before you submit for review. When a Master tries to publish
          your story, they'll be warned if no mail is attached. The story will still publish,
          but subscribers won't be emailed about it.
        </Tip>
      </Section>

      {/* ── 9. Newsletter ── */}
      <Section id="newsletter" icon={<Newspaper size={16} />} title="Newsletter">
        <P>
          Newsletter lets you send a standalone email to all subscribers — not tied to any specific
          story. Use it for platform updates, announcements, or general content you want to share.
        </P>

        <Sub>How to get there</Sub>
        <P>
          Tap the <strong>+</strong> floating button at the bottom-right of any admin page, then
          choose <strong>Newsletter</strong>.
        </P>

        <Sub>Compose tab</Sub>
        <Bullets
          items={[
            <><strong>Header Image</strong> — an optional image displayed at the very top of the email. Upload from your device.</>,
            <><strong>Subject</strong> — the email subject line (supports {`{{name}}`} personalisation).</>,
            <><strong>Body</strong> — the full email content (supports {`{{name}}`} personalisation and basic formatting).</>,
            <>
              <strong>Send mode toggle:</strong>
              <ul className="mt-1 space-y-1">
                <li><em>Send now</em> — sends immediately when you confirm in the popup.</li>
                <li><em>Schedule</em> — pick a date and time. The email sends automatically at that time.</li>
              </ul>
            </>,
          ]}
        />

        <Sub>History tab</Sub>
        <P>
          Shows every newsletter that has been sent or is scheduled to send. Two types of entries:
        </P>
        <div className="flex flex-col gap-2.5">
          <div className="p-3.5 bg-gray-50 dark:bg-[#1e2130] rounded-xl border border-gray-100 dark:border-white/[0.04]">
            <p className="text-sm font-bold text-[#0f1e3d] dark:text-gray-50">Sent newsletters</p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
              <strong>Resend</strong> — loads the content into Compose as a fresh draft. Does not
              re-use the old schedule. <strong>Delete</strong> — removes the entry from history.
              Does not unsend.
            </p>
          </div>
          <div className="p-3.5 bg-gray-50 dark:bg-[#1e2130] rounded-xl border border-gray-100 dark:border-white/[0.04]">
            <p className="text-sm font-bold text-[#0f1e3d] dark:text-gray-50">Scheduled newsletters</p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
              <strong>Edit</strong> — opens a popup to change the subject, body, image, or
              scheduled time before it sends. <strong>Cancel</strong> — stops it from sending.
            </p>
          </div>
        </div>
      </Section>

      {/* ── 10. Profile ── */}
      <Section id="profile" icon={<User size={16} />} title="Your Profile">
        <P>
          Click your avatar or name at the <strong>top-left corner</strong> of the navbar to open
          your profile.
        </P>
        <Sub>What you can update</Sub>
        <Bullets
          items={[
            <><strong>Name</strong> — how your name appears on your published stories and across the admin panel.</>,
            <><strong>Bio</strong> — a short description about you, shown at the bottom of your published stories.</>,
            <><strong>Profile photo</strong> — upload a new avatar image.</>,
          ]}
        />
        <Sub>Changing your password</Sub>
        <P>
          Click <strong>Change password</strong> inside your profile. You'll need to enter your
          current password before you can set a new one.
        </P>
        <Note>
          Your email address cannot be changed from your profile. If it needs to be updated,
          contact a Master.
        </Note>
      </Section>

    </div>
  );
}
