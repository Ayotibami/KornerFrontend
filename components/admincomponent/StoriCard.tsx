import Image from "next/image";

import { primaryColor, secondaryColor } from "@/app/constants/color";
import { Clock } from "lucide-react";
import { capitalize } from "@/lib/stringFormatting";
import { formatDate } from "@/lib/dateFormatter";
import Link from "next/link";
export default function StoriCard({ stori }) {
  return (
    <Link href={`/admin/stories/${stori.stori_id}`}>
      <div
        className="transition transform hover:-translate-y-1 hover:scale-102 hover:shadow-xl"
        style={{
          padding: 20,
          height: 500,
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            alignSelf: "stretch",
          }}
        >
          <div>
            <Clock
              color={primaryColor}
              size={12}
              style={{
                display: "inline-block",
                marginRight: "3px",
              }}
            ></Clock>
            <p
              style={{
                fontSize: 12,
                color: "#6B7280",
                display: "inline-block",
              }}
            >
              {stori.reading_time}
            </p>
          </div>

          <p
            style={{
              padding: "5px 10px",
              color: stori.status == "Draft" ? "#0E3E87" : "white",
              backgroundColor:
                stori.status == "Draft" ? secondaryColor : primaryColor,
              borderRadius: 12,
              fontSize: 12,
            }}
          >
            {capitalize(stori.status)}
          </p>
        </div>

        <div
          style={{
            position: "relative",
            overflow: "hidden",
            height: 300,
            borderRadius: 20,
            backgroundColor: "#e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {stori.cover_image ? (
            <Image
              src={stori.cover_image}
              alt="cover image"
              fill
              style={{ objectFit: "cover" }}
            />
          ) : (
            <p style={{ color: "#9CA3AF", fontSize: 13, margin: 0 }}>
              No cover image
            </p>
          )}
        </div>

        <p
          style={{
            fontWeight: "bold",
            fontSize: 20,
          }}
        >
          {stori.title}
        </p>
        <p style={{ fontSize: 16, fontStyle: "italic" }}> {stori.subtitle}</p>
        <p
          style={{
            color: "grey",
            fontSize: 14,
          }}
        >
          {stori.excerpt}
        </p>

        <p
          style={{
            fontSize: 14,
            color: "#6B7270",
          }}
        >
          {formatDate(stori.created_at)}
        </p>
      </div>
    </Link>
  );
}
