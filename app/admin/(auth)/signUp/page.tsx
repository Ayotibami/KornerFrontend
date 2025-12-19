"use client";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import React, { useState, useTransition } from "react";
import signUp from "./actions";
import { validatePassword } from "@/lib/validation";

export default function page() {
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const handleSubmit = (formdata: FormData) => {
    const name = formdata.get("name");
    const email = formdata.get("email");
    const password = formdata.get("password");
    const confirmPassword = formdata.get("confirmPassword");
    const avatar = formdata.get("avatar_url");
    if (!email || !password || !name) {
      setError("Email, password and name are required");
      return;
    }
    if (!validatePassword(password).isValid) {
      setError(validatePassword(password).message);
      return;
    }
  };
  return (
    <div>
      <form
        action={handleSubmit}
        style={{
          padding: 10,
          justifyContent: "center",
          alignItems: "center",
          width: "70%",
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
        <Input
          type="file"
          label="Avatar"
          name="avatar_url"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file.type !== "jpg") {
              setError("Only image uploads are allowed");
            }
          }}
        ></Input>
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
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        ></Input>
        <Input
          label="Confirm Password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
          }}
          type="password"
        ></Input>

        <Button type={"submit"}>Shine like Werey</Button>
      </form>
    </div>
  );
}
