import Link from "next/link";
import StoriCard from "./StoriCard";

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
];

export default function StoriCardList() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        justifyContent: "center",
        gap: 30,
        width: "100%",
      }}
    >
      {stories.map((story) => (
        <Link
          key={story.id}
          href={`/stories/${story.id}`}
          style={{ textDecoration: "none" }}
        >
          <StoriCard
            image={story.image}
            authorAvatar={story.authorAvatar}
            authorName={story.authorName}
            title={story.title}
            excerpt={story.excerpt}
            date={story.date}
          />
        </Link>
      ))}
    </div>
  );
}
