"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import Button from "@/components/admincomponent/ui/Button";
import Input from "@/components/admincomponent/ui/Input";
import AvatarPicker from "@/components/admincomponent/ui/AvatarPicker";
import { primaryColor } from "@/app/constants/color";
import AuthBranding from "@/components/admincomponent/ui/AuthBranding";
import AuthCard from "@/components/admincomponent/ui/AuthCard";
import { validatePassword } from "@/lib/validation";
import signUp from "./actions";

export default function Signup() {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<File | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = (formdata: FormData) => {
    setError("");

    if (!name || !email || !password) {
      setError("Name, email and password are required.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    const passwordCheck = validatePassword(password);
    if (!passwordCheck.isValid) {
      setError(passwordCheck.message);
      return;
    }
    if (!avatarUrl) {
      setError("Please select a profile picture.");
      return;
    }
    if (!avatarUrl.type.startsWith("image/")) {
      setError("Only image uploads are allowed.");
      return;
    }

    formdata.append("avatar_url", avatarUrl);

    startTransition(async () => {
      const res = await signUp(formdata);
      if (res?.error) {
        setError(res.error);
      }
    });
  };

  return (
    <AuthCard>
        <AuthBranding
          title="Create Account"
          subtitle="Join the Korner admin team"
        />

        {/* Avatar picker */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <AvatarPicker setAvatarUrl={setAvatarUrl} />
        </div>

        {/* Form */}
        <form action={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {error && (
            <p style={{ color: "#dc2626", fontSize: "0.875rem", margin: 0, textAlign: "center" }}>
              {error}
            </p>
          )}

          <Input
            name="name"
            label="Name"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isPending}
          />
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isPending}
          />
          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isPending}
          />
          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isPending}
          />

          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <Loader2 size={16} className="animate-spin" /> Creating account...
              </span>
            ) : (
              "Sign up"
            )}
          </Button>
        </form>

        {/* Footer link */}
        <p style={{ textAlign: "center", fontSize: "0.875rem", color: "#6B7280", margin: 0 }}>
          Already an admin?{" "}
          <Link href="/admin/login" style={{ color: primaryColor, fontWeight: 700 }}>
            Login
          </Link>
        </p>
    </AuthCard>
  );
}
