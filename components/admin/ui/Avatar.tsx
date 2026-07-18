// Admin avatar circle shown in the Navbar.
// If `url` is provided (from the admin profile), displays the profile image.
// If not, the circle shows empty with a light blue background — a safe empty state.
// Border uses brand primary color; background uses brand secondary.

import Image from "next/image";
import { cloudinaryUrl } from "@/lib/utils";

export default function Avatar({ url }: { url?: string }) {
  return (
    <div className="relative w-[50px] h-[50px] rounded-full border-2 border-primary bg-secondary overflow-hidden flex-shrink-0">
      {url && (
        <Image src={cloudinaryUrl(url, 100)} fill alt="Admin avatar" className="object-cover" sizes="50px" />
      )}
    </div>
  );
}
