import { nunito } from "@/lib/font";
import {
  FaXTwitter,
  FaInstagram,
  FaWhatsapp,
  FaEnvelope,
} from "react-icons/fa6";
import Image from "next/image";
import Link from "next/link";

/* Korner has no pages of its own for these — they all live on the Kampos site,
   so every link is built from NEXT_PUBLIC_KAMPOS_URL. Set it in .env.local and
   in Vercel to repoint them without touching code. The NEXT_PUBLIC_ prefix
   means it resolves in Client Components too, so this keeps working if the
   footer ever becomes client-side. The trailing slash is stripped so we never
   produce a double slash like "...//privacy". */
const KAMPOS = (
  process.env.NEXT_PUBLIC_KAMPOS_URL || "https://kampos-website.vercel.app"
).replace(/\/+$/, "");

const linkColumns = [
  {
    heading: "Company",
    links: [
      { label: "Contact us", href: `${KAMPOS}/contactPage#contact-form` },
      { label: "About us", href: `${KAMPOS}/chefs` },
      { label: "Terms and conditions", href: `${KAMPOS}/terms` },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Bug report", href: `${KAMPOS}/report-bug` },
      { label: "Feature Requests", href: `${KAMPOS}/request-feature` },
      { label: "FAQ", href: `${KAMPOS}/contactPage#faq` },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: `${KAMPOS}/privacy` },
      {
        label: "Community Guidelines",
        href: `${KAMPOS}/community-guidelines`,
      },
    ],
  },
];

/* `title` shows the destination on hover — it matters most for Email, since
   mailto: silently does nothing on devices with no mail app registered. */
const socials = [
  {
    icon: FaXTwitter,
    label: "X",
    title: "Kampos on X (@Kamposapp)",
    href: "https://x.com/Kamposapp",
  },
  {
    icon: FaInstagram,
    label: "Instagram",
    title: "Kampos on Instagram (@Kamposapp)",
    href: "https://instagram.com/Kamposapp",
  },
  {
    icon: FaWhatsapp,
    label: "WhatsApp",
    title: "Chat with Kampos on WhatsApp",
    href: "https://wa.me/2349110210657?text=Hey%20Kappy%2C%20my%20name%20is%20",
  },
  {
    icon: FaEnvelope,
    label: "Email",
    title: "kamposkonnect@gmail.com",
    href: "mailto:kamposkonnect@gmail.com",
  },
];

export default function Footer() {
  // w-full below is required: pages wrap content in a flex column with
  // align-items:center, so without it the footer shrinks to its content
  // width instead of spanning the viewport.
  return (
    <footer
      className="relative mt-12 w-full bg-[#0b1020] text-white md:mt-20"
      style={{ fontFamily: nunito.style.fontFamily }}
    >
      {/* thin brand-blue glow line across the top */}
      <div className="h-[3px] bg-[linear-gradient(90deg,transparent,#165abf_25%,#4a90e2_50%,#165abf_75%,transparent)]" />

      {/* Full-bleed like the previous Korner footer — no centred max-width cap,
          just horizontal padding, so it spans the whole viewport. */}
      <div className="w-full px-5 pt-12 pb-8 sm:px-8 md:px-10 md:pt-[60px]">
        {/* ---- top: brand + link columns ---- */}
        <div className="flex flex-wrap justify-between gap-8 max-[700px]:flex-col md:gap-16">
          <div className="max-w-[320px]">
            <Link href="/" aria-label="Korner home" className="inline-block leading-[0]">
              <Image
                src="/images/Icon.png"
                alt="Korner"
                width={120}
                height={120}
                className="h-[clamp(72px,10vw,104px)] w-auto object-contain"
              />
            </Link>
            <p className="mt-5 text-base leading-[1.7] text-[#9aa1b0]">
              Korner — by Kampos. Your campus life in one app: gist, news, and
              vibes, all in one place.
            </p>
          </div>

          <div className="flex flex-wrap gap-8 md:gap-20">
            {linkColumns.map((col) => (
              <div key={col.heading}>
                <h4 className="mb-5 text-[0.85rem] font-extrabold uppercase tracking-[0.12em] text-[#5b7db8]">
                  {col.heading}
                </h4>
                <ul className="m-0 list-none p-0">
                  {col.links.map((link) => (
                    <li key={link.label} className="[&+li]:mt-[0.9rem]">
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[1.05rem] text-[#c7cddb] no-underline transition-colors hover:text-white"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ---- bottom bar ---- */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-6 border-t border-white/10 pt-7 max-[700px]:flex-col-reverse max-[700px]:justify-center max-[700px]:text-center md:mt-12">
          <p className="m-0 text-[0.95rem] text-[#9aa1b0]">
            © {new Date().getFullYear()} Ayoti. All rights reserved.
          </p>

          <div className="flex gap-[0.9rem]">
            {socials.map(({ icon: Icon, label, title, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                title={title}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-[1.15rem] text-[#c7cddb] transition-all duration-200 hover:-translate-y-1 hover:border-[#165abf] hover:bg-[#165abf] hover:text-white"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
