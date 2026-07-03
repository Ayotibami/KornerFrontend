import type { Metadata } from "next";
import UnsubscribeCard from "./UnsubscribeCard";

export const metadata: Metadata = {
  title: "Unsubscribe — Korner",
  robots: { index: false, follow: false },
};

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;
  const decoded = email ? decodeURIComponent(email) : null;

  return (
    <main className="min-h-screen bg-[#f8f9fb] flex flex-col items-center justify-center p-4">
      <UnsubscribeCard email={decoded} />
    </main>
  );
}
