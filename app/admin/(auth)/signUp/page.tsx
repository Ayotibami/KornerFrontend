"use client";

// Signup page — creates a new admin account.
// Validation is done client-side before calling the server action:
//   1. Name, email, password are required
//   2. Passwords must match
//   3. Password must pass validatePassword() (length, uppercase, number)
//   4. Avatar must be uploaded (avatarUrl must be a Cloudinary URL, not null)
//
// avatarUrl is managed as separate state (not inside the form) because
// AvatarPicker uploads asynchronously to Cloudinary. The URL is appended
// to the FormData just before calling signUp().
//
// The submit button is also disabled while the avatar is uploading
// (avatarUploading === true) to prevent submitting with a null avatar.

import { useState, useTransition } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import Button from "@/components/admin/ui/Button";
import Input from "@/components/admin/ui/Input";
import AvatarPicker from "@/components/admin/ui/AvatarPicker";
import AuthBranding from "@/components/admin/ui/AuthBranding";
import AuthCard from "@/components/admin/ui/AuthCard";
import { validatePassword } from "@/lib/validation";
import signUp from "./actions";

export default function SignupPage() {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (formData: FormData) => {
    setError("");

    // Client-side validation before hitting the server
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

    // Attach the Cloudinary URL to the form before sending to the server
    formData.append("avatar_url", avatarUrl);

    startTransition(async () => {
      const result = await signUp(formData);
      if (!result.ok) {
        setError(result.message);
      }
      // On success, the server action redirects to login.
    });
  };

  return (
    <AuthCard>
      <AuthBranding
        title="Create Account"
        subtitle="Join the Korner admin team"
      />

      {/* Avatar picker is outside the form so its async upload doesn't block form submit */}
      <div className="flex justify-center">
        <AvatarPicker setAvatarUrl={setAvatarUrl} onUploadingChange={setAvatarUploading} />
      </div>

      <form action={handleSubmit} className="flex flex-col gap-5">
        {error && (
          <p className="text-red-600 text-sm text-center">{error}</p>
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

        {/* Also disabled while avatar is uploading — prevents submitting with null avatar_url */}
        <Button type="submit" disabled={isPending || avatarUploading}>
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 size={16} className="animate-spin" /> Creating account...
            </span>
          ) : (
            "Sign up"
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500">
        Already an admin?{" "}
        <Link href="/admin/login" className="text-primary font-bold">
          Login
        </Link>
      </p>
    </AuthCard>
  );
}
