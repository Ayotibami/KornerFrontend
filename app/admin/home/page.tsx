import StoriesList from "@/components/admincomponent/StoriesList";
import FilterBar from "@/components/admincomponent/FilterBar";
import { Suspense } from "react";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* FilterBar is a client component — wrap in Suspense because useSearchParams needs it */}
      <Suspense>
        <FilterBar />
      </Suspense>

      {/* Extra paddingTop so stories start below the filter bar (~60px tall) */}
      <div style={{ paddingTop: 60 }}>
        <StoriesList status={status} />
      </div>
    </div>
  );
}
