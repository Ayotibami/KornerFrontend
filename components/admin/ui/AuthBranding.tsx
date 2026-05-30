// Branding header shown at the top of both auth pages (login and signup).

import Image from "next/image";

export default function AuthBranding({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2">
        <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 bg-primary">
          <Image
            src="/images/logo.png"
            alt="Kampos logo"
            width={28}
            height={28}
            className="object-contain"
          />
        </div>
        <p className="text-[clamp(0.6rem,2vw,0.75rem)] font-semibold text-black/40 dark:text-white/40">
          by Kampos
        </p>
      </div>

      <h1 className="text-[clamp(1.4rem,4vw,1.875rem)] font-extrabold text-primary text-center">
        {title}
      </h1>
      <p className="text-[clamp(0.85rem,2vw,0.95rem)] font-medium text-gray-500 dark:text-gray-400 text-center">
        {subtitle}
      </p>
    </div>
  );
}
