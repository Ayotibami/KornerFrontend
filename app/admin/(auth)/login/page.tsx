"use client";
import Button from "@/components/admincomponent/ui/Button";
import Input from "@/components/admincomponent/ui/Input";
import React, { useState, useTransition } from "react";
import Login from "./actions";
import Link from "next/link";

export default function page() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const formSubmit = (formdata: FormData) => {
    setError(null);
    startTransition(async () => {
      const res = await Login(formdata);

      if (res?.error) {
        setError(res.error);
      }
    });
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        gap: 10,
        height: "100vh",
        width: "100vw",
      }}
    >
      <h1
        style={{
          fontSize: 25,
          fontWeight: 600,
        }}
      >
        Howfar? You don land for admin corner!{" "}
      </h1>
      <form
        action={formSubmit}
        style={{
          width: "40%",
          gap: 30,
          flexDirection: "column",
          display: "flex",

          alignItems: "stretch",
          // backgroundColor: "pink",
          justifyContent: "center",
        }}
      >
        <p
          style={{
            color: "#dc2626",
          }}
        >
          {error}
        </p>
        <Input
          label="Email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Password"
          name="password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />

        <Button type="submit" disabled={isPending}>
          {isPending ? "Loading..." : "Login"}
        </Button>
        <p>
          Not an admin?{" "}
          <Link
            href={"/admin/signUp"}
            style={{
              color: "#165ABF",
            }}
          >
            You can be sha!
          </Link>
        </p>
      </form>
    </div>
  );
}
