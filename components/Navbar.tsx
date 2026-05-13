import React from "react";

import AdminGreeting from "./AdminGreeting";
import Avatar from "./ui/Avatar";
import CreateStoriBtn from "./ui/CreateStoriBtn";
import UpdateAdmin from "./UpdateAdmin";
import getProfile from "@/app/admin/home/action";

export default async function Navbar() {
  const profile = await getProfile();
  console.log(profile, "fuckkk");

  return (
    <div
      style={{
        height: "14vh",
        padding: "10px 20px",
        alignItems: "center",
        display: "flex",
        flexDirection: "row",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        position: "fixed",
        justifyContent: "space-between",

        zIndex: 5,
        width: "100%",

        background: "rgba(255, 255, 255, 0.9)" /* 20% transparent */,
      }}
    >
      <div
        style={{
          flexDirection: "row",
          alignItems: "center",
          display: "flex",
          gap: 5,
        }}
      >
        <Avatar url={profile.avatar_url}></Avatar>
        <AdminGreeting name={profile.admin_name}></AdminGreeting>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
        }}
      >
        <CreateStoriBtn></CreateStoriBtn>
        <UpdateAdmin></UpdateAdmin>
      </div>
    </div>
  );
}
