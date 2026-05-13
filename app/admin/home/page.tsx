import StoriesList from "@/components/StoriesList";
import Button from "@/components/ui/Button";
// import { useRouter } from "next/navigation";
import React from "react";

export default function Page() {
  // const router = useRouter();
  return (
    <div
      style={{
        display: "flex",

        flexDirection: "column",

        alignItems: "flex-start",
      }}
    >
      <StoriesList></StoriesList>
    </div>
  );
}
