import Image from "next/image";
import { primaryColor, secondaryColor } from "@/app/constants/color";

export default function Avatar({ url }: { url?: string }) {
  return (
    <div
      style={{
        height: 50,
        width: 50,
        borderRadius: "50%",
        border: `2px solid ${primaryColor}`,
        overflow: "hidden",
        position: "relative",
        flexShrink: 0,
        backgroundColor: secondaryColor,
      }}
    >
      {url && (
        <Image src={url} fill alt="Avatar" style={{ objectFit: "cover" }} unoptimized />
      )}
    </div>
  );
}
