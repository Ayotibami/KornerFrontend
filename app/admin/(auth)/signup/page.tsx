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
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Button from "@/components/admin/ui/Button";
import Input from "@/components/admin/ui/Input";
import AvatarPicker from "@/components/admin/ui/AvatarPicker";
import AuthBranding from "@/components/admin/ui/AuthBranding";
import AuthCard from "@/components/admin/ui/AuthCard";
import { validatePassword } from "@/lib/validation";
import signUp from "./actions";

export default function SignupPage() {
  const router = useRouter();
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
        return;
      }
      toast.success("Account created! Please log in.");
      router.push("/admin/login");
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

      <form action={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-xl px-4 py-3">
            <p className="text-red-600 dark:text-red-400 text-sm text-center">{error}</p>
          </div>
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

        <Button type="submit" disabled={isPending || avatarUploading}>
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 size={16} className="animate-spin" /> Creating account…
            </span>
          ) : (
            "Create account"
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
        Already an admin?{" "}
        <Link href="/admin/login" className="text-primary dark:text-[#93b8f0] font-semibold hover:opacity-70 transition-opacity">
          Log in
        </Link>
      </p>
    </AuthCard>
  );
}
