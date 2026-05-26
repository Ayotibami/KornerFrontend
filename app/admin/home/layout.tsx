import isAuthenticated from "@/lib/auth";
import React from "react";
import Navbar from "@/components/admincomponent/Navbar";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  await isAuthenticated();
  return (
    <div>
      <Navbar></Navbar>
      <div
        style={{
          paddingTop: "14vh",
          paddingBottom: "20px",
        }}
      >
        {children}
      </div>
    </div>
  );
}
