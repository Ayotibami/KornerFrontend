"use client";
import Button from "@/components/admincomponent/ui/Button";
import Input from "@/components/admincomponent/ui/Input";
import React, { useState, useTransition } from "react";
import signUp from "./actions";
import { validatePassword } from "@/lib/validation";
import Link from "next/link";
import Avatar from "@/components/admincomponent/ui/AvatarPicker";

export default function Signup() {
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const handleSubmit = (formdata: FormData) => {
    const name = formdata.get("name");
    const email = formdata.get("email");
    const password = formdata.get("password");
    const confirmPassword = formdata.get("confirmPassword");
    formdata.append("avatar_url", avatarUrl as File);
    setError("");
    if (!email || !password || !name) {
      setError("Email, password and name are required abeg.");
      return;
    }
    if (password != confirmPassword) {
      setError("Passwords do not match abeg.");
      return;
    }
    if (!validatePassword(password).isValid) {
      setError(validatePassword(password).message);
      return;
    }
    if (avatarUrl?.size == 0) {
      setError("Avatar is required abeg.");
      return;
    }

    if (avatarUrl?.type !== "image/jpeg") {
      setError("Only image uploads are allowed");
      return;
    }
    startTransition(async () => {
      const res = await signUp(formdata);
      if (res?.error) {
        setError(res.error);
      }
    });
  };
  return (
    <div
      style={{
        backgroundColor: "red",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // height: "100vh",
        // width: "100vw",
      }}
    >
      <form
        action={handleSubmit}
        style={{
          padding: 10,
          backgroundColor: "yellow",
          justifyContent: "center",
          alignItems: "center",
          width: "50%",
          gap: 30,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h1
          className="font-bold"
          style={{
            fontSize: 25,
          }}
        >
          Sign up
        </h1>
        <p
          style={{
            color: "#dc2626",
          }}
        >
          {error}
        </p>
        {/* <Avatar setAvatarUrl={setAvatarUrl}></Avatar> */}
        <Input
          name="name"
          label="Name"
          placeholder="werey"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        ></Input>
        <Input
          label="Email"
          name="email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          value={email}
          type="email"
          placeholder="werey@gmail.com"
        ></Input>
        <Input
          label="Password"
          name="password"
          type="text"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        ></Input>
        <Input
          label="Confirm Password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
          }}
          type="text"
        ></Input>

        <Button type={"submit"} disabled={isPending}>
          Shine like Werey
        </Button>
        <p>
          Are you an admin?{" "}
          <Link
            href="/admin/login"
            style={{
              color: "#165ABF",
            }}
          >
            Just login na
          </Link>
        </p>
      </form>
    </div>
  );
}
