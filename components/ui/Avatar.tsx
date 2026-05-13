import Image from "next/image";
import React from "react";
export default async function Avatar({ url }) {
  return (
    <div
      style={{
        height: 70,
        width: 70,
        borderRadius: 35,
        borderColor: "#165ABF",
        borderWidth: 2,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Image src={url} fill alt="Avatar" objectFit="cover"></Image>
    </div>
  );
}
