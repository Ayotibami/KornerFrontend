import type { Metadata } from "next";

export const revalidate = 60;
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
import ViewTracker from "@/components/ViewTracker";
const extractUuid = (slug: string) => {
  const match = slug.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
  return match ? match[0] : slug;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ storiId: string }>;
}): Promise<Metadata> {
  const { storiId: slug } = await params;
  const storiId = extractUuid(slug);
  const story = await getPublicStory(storiId);

  if (!story) {
    return { title: "Story not found" };
  }

  const base = process.env.NEXT_PUBLIC_BASE_URL!;
  const coverImage = story.cover_image
    ? [{ url: story.cover_image, width: 1200, height: 630, alt: story.title }]
    : [{ url: `${base}/images/og-default.png`, width: 1200, height: 630, alt: "The Korner" }];

  return {
    title: `${story.title} | The Korner`,
    description: story.excerpt,
    openGraph: {
      title: `${story.title} | The Korner`,
      description: story.excerpt,
      url: `${base}/stories/${story.slug}`,
      type: "article",
      images: coverImage,
      authors: [story.author_name],
      publishedTime: story.created_at,
    },
    twitter: {
      card: "summary_large_image",
      title: story.title,
      description: story.excerpt,
      images: story.cover_image ? [story.cover_image] : [`${base}/images/og-default.png`],
    },
    alternates: {
      canonical: `${base}/stories/${story.slug}`,
    },
  };
}

export default async function StoriPage({
  params,
}: {
  params: Promise<{ storiId: string }>;
}) {
  const { storiId: slug } = await params;
  const storiId = extractUuid(slug);
  const story = await getPublicStory(storiId);

  if (!story) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: story.title,
    description: story.excerpt,
    image: story.cover_image || undefined,
    author: { "@type": "Person", name: story.author_name },
    publisher: { "@type": "Organization", name: "The Korner" },
    datePublished: story.created_at,
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/stories/${story.slug}`,
  };

  return (
    <>
      <ViewTracker storiId={storiId} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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

        <h1 style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
          {story.title}
        </h1>

        <StoriCover
          title={story.title}
          subtitle={story.subtitle}
          authorName={story.author_name}
          authorAvatar={story.author_avatar}
          coverImage={story.cover_image}
          readingTime={story.reading_time}
          date={formatFullDate(story.created_at)}
        />

        <StoriBody blocks={story.blocks} title={story.title} />

        <StoriBottom
          authorName={story.author_name}
          authorAvatar={story.author_avatar}
          authorBio={story.author_bio ?? ""}
          title={story.title}
          excerpt={story.excerpt}
        />

        <OtherStories excludeStoriId={story.stori_id} />

        <ActivationForm />
      </div>
      <Footer />
    </>
  );
}
