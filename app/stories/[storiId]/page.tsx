import StoriCover from "@/components/usercomponent/StoriCover";
import StoriBody from "@/components/usercomponent/StoriBody";

export default async function StoriPage({
  params,
}: {
  params: { storiId: string };
}) {
  const { storiId } = await params;

  return (
    <div
      style={{
        display: "flex",
        padding: 20,
        flexDirection: "column",
        gap: 20,
      }}
    >
      <StoriCover
        title="The Night Reading Struggle No One Talks About"
        subtitle="Staying awake to finish just one more chapter can feel like a lonely battle against the clock. This exploration dives into the eye strain, the fading focus, and the unique mental fatigue that strikes when your love for literature clashes with your need for sleep."
        authorName="Tenuojo Favour"
        readingTime="5 min read"
        date="24 Oct 2025"
      />
      <StoriBody
        blocks={[
          {
            id: "1",
            position: 1,
            block_type: "heading",
            content: "The Setup Nobody Warns You About",
          },
          {
            id: "2",
            position: 2,
            block_type: "paragraph",
            content:
              "It starts innocently enough. One chapter before bed, you tell yourself. You're already in your bed, the fan is spinning at full speed, your roommate is snoring like he has no exams tomorrow, and the night is quiet in that specific way that makes reading feel like a sacred act. One chapter. That's all.",
          },
          {
            id: "3",
            position: 3,
            block_type: "paragraph",
            content:
              "But here's what nobody tells you about night reading — it has a personality. It pulls you in slowly. The first chapter ends on a cliffhanger. You say okay, one more. The second chapter ends even worse. By the third chapter, you've stopped making deals with yourself. You've surrendered. The book owns you now.",
          },
          {
            id: "4",
            position: 4,
            block_type: "image",
            content: "",
            image_url: "",
          },
          {
            id: "5",
            position: 5,
            block_type: "heading",
            content: "2AM and the Lies We Tell Ourselves",
          },
          {
            id: "6",
            position: 6,
            block_type: "paragraph",
            content:
              "You check your phone. 2:14AM. You have an 8 o'clock class. That's roughly five hours and forty-six minutes of sleep if you close the book right now. But you don't close the book. Instead, you do the thing every night reader does — you calculate. If I sleep at 3, I can still get four hours. Four hours is fine. Four hours is enough. Four hours is a lie, but it's a comfortable lie, and comfort is everything at 2AM.",
          },
          {
            id: "7",
            position: 7,
            block_type: "quote",
            content:
              "Sleep is for people who haven't discovered the last fifty pages of a good book.",
          },
          {
            id: "8",
            position: 8,
            block_type: "paragraph",
            content:
              "The real enemy isn't even the sleepiness. It's the light. Your phone torch starts dying around 1AM. You tilt it at increasingly creative angles — under your chin, propped against your pillow, balanced on your knee. At some point you're basically doing yoga just to read a paragraph. But you do it. You do it without hesitation because leaving the story now is unthinkable.",
          },
          {
            id: "9",
            position: 9,
            block_type: "heading",
            content: "The Roommate Problem",
          },
          {
            id: "10",
            position: 10,
            block_type: "paragraph",
            content:
              "If you have a roommate who sleeps early, you already know the politics. You've mastered the art of the silent page turn. You know exactly which position angles your torch away from their face. You've learned to hold your breath during the tense parts so you don't accidentally gasp out loud and wake them up. Night reading is a stealth mission. You are a reading ninja.",
          },
          {
            id: "11",
            position: 11,
            block_type: "paragraph",
            content:
              "The worst is when they wake up mid-read. Not because they're angry — though sometimes they are — but because of the conversation that follows. What are you still doing awake? Reading. Reading what? A novel. For school? No. They stare at you the way people stare at someone who has clearly lost their mind. Then they turn over and go back to sleep, and you return to your book, and the shame lasts exactly four seconds before the story swallows you whole again.",
          },
          {
            id: "12",
            position: 12,
            block_type: "image",
            content: "",
            image_url: "",
          },
          {
            id: "13",
            position: 13,
            block_type: "quote",
            content:
              "The book doesn't care about your 8AM class. The book has no mercy. And honestly? That's why you love it.",
          },
          {
            id: "14",
            position: 14,
            block_type: "heading",
            content: "Morning: The Consequences",
          },
          {
            id: "15",
            position: 15,
            block_type: "paragraph",
            content:
              "You finish the book at 4:37AM. You know this because you checked your phone one final time after the last page, that specific combination of satisfaction and emptiness that only exists when a good story ends. You put the book down. The ceiling stares back at you. You have approximately two hours and twenty-three minutes before your alarm goes off.",
          },
          {
            id: "16",
            position: 16,
            block_type: "paragraph",
            content:
              "Morning comes like a personal attack. The alarm is not a sound — it's a verdict. You drag yourself to the bathroom. Your eyes look like you've been crying. You haven't been crying, but try explaining that to your face. You wear whatever is closest to you. You eat nothing, or if you eat, you eat something that barely counts as food. You go to class. You sit down. The lecturer starts talking. And somewhere between the second slide and the third, sleep takes you — quickly, quietly, like it was waiting all along.",
          },
          {
            id: "17",
            position: 17,
            block_type: "paragraph",
            content:
              "The real struggle isn't the night. It's the morning after. It's sitting in that lecture hall knowing you wrecked yourself for a book, and knowing — with complete certainty — that if you could go back, you would do it again. Every single time.",
          },
          {
            id: "18",
            position: 18,
            block_type: "quote",
            content:
              "If loving books is wrong, I don't want to pass this semester.",
          },
          {
            id: "19",
            position: 19,
            block_type: "heading",
            content: "Why We Keep Doing It",
          },
          {
            id: "20",
            position: 20,
            block_type: "paragraph",
            content:
              "There's something about reading at night that feels different from reading during the day. During the day, the world has opinions. People knock on doors, generators come on and off, music plays from three different rooms. But at night, when the hostel finally quiets down and the only sound is the fan and maybe rain on the roof — reading becomes something else entirely. It becomes a conversation. Just you and the writer and the dark.",
          },
          {
            id: "21",
            position: 21,
            block_type: "paragraph",
            content:
              "That's the thing nobody warns you about. Night reading isn't a habit. It's a relationship. A slightly dysfunctional one that costs you sleep and occasionally your grades, but one that gives you whole worlds in return. And on a campus where everything is loud and everyone is running somewhere, sometimes a world between two covers at 2AM is the most peaceful place you can be.",
          },
          {
            id: "22",
            position: 22,
            block_type: "image",
            content: "",
            image_url: "",
          },
        ]}
      />
    </div>
  );
}
