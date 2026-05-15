import { primaryColor } from "@/app/constants/color";
import { Feather, FeatherIcon, Pen, Pencil } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function CreateStoriBtn() {
  return (
    <Link href={"/admin/stories/create"}>
      <div>
        <FeatherIcon size={30} color={primaryColor}></FeatherIcon>
      </div>
    </Link>
  );
}
