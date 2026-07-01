import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GoBackButton from "@/components/usercomponent/GoBackButton";
import StoriCover from "@/components/usercomponent/StoriCover";
import StoriBody from "@/components/usercomponent/StoriBody";
import StoriBottom from "@/components/usercomponent/StoriBottom";
import OtherStories from "@/components/usercomponent/OtherStories";
import ActivationForm from "@/components/usercomponent/ActivationForm";
import Footer from "@/components/usercomponent/Footer";
import { getPublicStory } from "@/lib/publicApi";
import { formatFullDate } from "@/lib/utils";

// Next.js automatically memoizes identical fetch() calls within a single
// render pass (regardless of the no-store cache option used inside
// getPublicStory), so calling it here AND in the page body below still only
// hits the backend — and increments the view counter — once per visit.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ storiId: string }>;
}): Promise<Metadata> {
  const { storiId } = await params;
  const story = await getPublicStory(storiId);

  if (!story) {
    return { title: "Story not found" };
  }

  return {
    title: story.title,
    description: story.subtitle,
    openGraph: {
      title: story.title,
      description: story.subtitle,
      url: `https://thekorner.com/stories/${storiId}`,
      type: "article",
      images: story.cover_image ? [story.cover_image] : undefined,
    },
  };
}

export default async function StoriPage({
  params,
}: {
  params: Promise<{ storiId: string }>;
}) {
  const { storiId } = await params;
  const story = await getPublicStory(storiId);

  if (!story) notFound();

  return (
    <>
      <div
        style={{
          display: "flex",
          padding: 20,
          flexDirection: "column",
          backgroundColor: "white",
          alignItems: "center",
          gap: 20,
        }}
      >
        <GoBackButton href="/stories" />

        <StoriCover
          title={story.title}
          subtitle={story.subtitle}
          authorName={story.author_name}
          authorAvatar={story.author_avatar}
          coverImage={story.cover_image}
          readingTime={story.reading_time}
          date={formatFullDate(story.created_at)}
        />

        <StoriBody blocks={story.blocks} />

        <StoriBottom
          authorName={story.author_name}
          authorAvatar={story.author_avatar}
          authorBio={story.author_bio ?? ""}
          title={story.title}
        />

        <OtherStories excludeStoriId={storiId} />

        <ActivationForm />
      </div>
      <Footer />
    </>
  );
}
