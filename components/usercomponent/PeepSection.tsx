import TornSection from "@/components/admincomponent/Tornsection";
import StoriCardList from "@/components/usercomponent/StoriCardList";
import { nunito } from "@/lib/font";
import Button from "../admincomponent/Button";
import Link from "next/link";

export default function PeepSection() {
  return (
    <TornSection>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
        }}
      >
        <h1
          style={{
            color: "white",
            fontFamily: nunito.style.fontFamily,
            fontWeight: 800,
            marginBottom: 30,
          }}
        >
          Peep at this one fess
        </h1>

        {/* Responsive grid of story cards */}
        <StoriCardList />
      </div>

      <div
        style={{
          marginTop: 50,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Link href="/stories" style={{ textDecoration: "none" }}>
          <Button>Hop into Korner</Button>
        </Link>
      </div>
    </TornSection>
  );
}
