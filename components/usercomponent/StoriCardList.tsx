import StoriCard from "./StoriCard";

// Hardcoded story data — will be replaced with an API fetch when the backend is ready.
// Each story has a unique id (UUID) that matches the dynamic route /stories/[storiId].
const stories = [
  {
    id: "04e23ac7-3615-4cb5-aacc-2b470b156087",
    image: "",
    authorAvatar: "",
    authorName: "Tenuojo Favor",
    title: "The Night Reading Struggle No One Talks About",
    excerpt: "We write — you grab popcorn and read. It's your corner.",
    date: "24 Oct 2025",
  },
  {
    id: "1b2c3d4e-5f6a-7b8c-9d0e-1f2a3b4c5d6e",
    image: "",
    authorAvatar: "",
    authorName: "Amaka Obi",
    title: "How I Survived Finals Week on Jollof and Spite",
    excerpt: "A survival guide nobody asked for but everyone needs.",
    date: "18 Oct 2025",
  },
  {
    id: "2c3d4e5f-6a7b-8c9d-0e1f-2a3b4c5d6e7f",
    image: "",
    authorAvatar: "",
    authorName: "Chike Bello",
    title: "Campus Crushes and the Art of Saying Nothing",
    excerpt: "Eye contact across the library. A whole semester wasted.",
    date: "10 Oct 2025",
  },
  {
    id: "3d4e5f6a-7b8c-9d0e-1f2a-3b4c5d6e7f8a",
    image: "",
    authorAvatar: "",
    authorName: "Sade Yusuf",
    title: "Why Everyone Hates Group Work But Still Does It",
    excerpt: "One person does everything. You know who you are.",
    date: "2 Oct 2025",
  },
  {
    id: "4e5f6a7b-8c9d-0e1f-2a3b-4c5d6e7f8a9b",
    image: "",
    authorAvatar: "",
    authorName: "Emeka Nwachukwu",
    title: "The Unspoken Rules of the Campus Cafeteria",
    excerpt: "Don't sit there. No seriously, not that seat.",
    date: "25 Sep 2025",
  },
  {
    id: "5f6a7b8c-9d0e-1f2a-3b4c-5d6e7f8a9b0c",
    image: "",
    authorAvatar: "",
    authorName: "Zainab Musa",
    title: "Midnight Thoughts From a Sleep-Deprived 300L Student",
    excerpt: "Is it too late to switch to mass comm?",
    date: "15 Sep 2025",
  },
  {
    id: "6a7b8c9d-0e1f-2a3b-4c5d-6e7f8a9b0c1d",
    image: "",
    authorAvatar: "",
    authorName: "Biodun Adeyemi",
    title: "NEPA, Generator Fuel and the GPA That Could Have Been",
    excerpt: "Light went. I was in the middle of my assignment. Classic.",
    date: "5 Sep 2025",
  },
];

// limit is optional — if passed, only that many stories are shown.
// If not passed, all stories are shown.
// Usage: <StoriCardList limit={3} /> shows 3, <StoriCardList /> shows all.
export default function StoriCardList({ limit }: { limit?: number } = {}) {
  const visible = limit ? stories.slice(0, limit) : stories;

  return (
    // Responsive grid: repeat(auto-fill, minmax(clamp(250px, 30%, 400px), 1fr))
    // - auto-fill: always creates as many columns as fit, even if some are empty
    // - clamp(250px, 30%, 400px): each column is at least 250px, max 400px, ideally 30% of container
    // - 30% as the preferred width caps columns at 3 (4 × 30% = 120% > 100%, impossible)
    // - 1fr: columns share leftover space equally after the minimum is met
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fill, minmax(clamp(250px, 30%, 400px), 1fr))",
        gap: 30,
        width: "100%",
      }}
    >
      {visible.map((story) => (
        // href is passed to StoriCard so it can handle navigation itself
        // after the click-expand animation finishes (see StoriCard.tsx)
        <StoriCard
          key={story.id}
          href={`/stories/${story.id}`}
          image={story.image}
          authorAvatar={story.authorAvatar}
          authorName={story.authorName}
          title={story.title}
          excerpt={story.excerpt}
          date={story.date}
        />
      ))}
    </div>
  );
}
