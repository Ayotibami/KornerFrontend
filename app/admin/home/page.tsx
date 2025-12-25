"use client";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import React from "react";

export default function Page() {
  const router = useRouter();
  return (
    <div
      style={{
        backgroundColor: "red",
        display: "flex",
        height: "100vh",
        width: "100vw",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          position: "absolute",
          bottom: 10,
          left: 10,
          padding: 5,
        }}
      >
        <Button
          type={"button"}
          onClick={() => {
            router.push("/admin/stories/create");
          }}
        >
          Create Stori
        </Button>
      </div>
    </div>
  );
}
