import { FeatherIcon } from "lucide-react";
import Link from "next/link";
import { primaryColor } from "@/app/constants/color";

export default function CreateStoriBtn() {
  return (
    <Link href="/admin/stories/create">
      <FeatherIcon size={28} color={primaryColor} />
    </Link>
  );
}
