"use client";

// Login page — the entry point for the admin panel.
// Uses useTransition to call the login server action without a full page reload.
// Error messages are displayed inline above the form.
//
// The form uses `action={handleSubmit}` (a function, not a URL string) so Next.js
// routes the submit through the client handler instead of the default browser POST.

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import Button from "@/components/admin/ui/Button";
import Input from "@/components/admin/ui/Input";
import AuthBranding from "@/components/admin/ui/AuthBranding";
import AuthCard from "@/components/admin/ui/AuthCard";
import login from "./actions";

export default function LoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const result = await login(formData);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      toast.success("Welcome back!");
      router.push("/admin/home");
    });
  };

  return (
    <AuthCard>
      <AuthBranding
        title="Korner Admin"
        subtitle="Howfar? You don land for admin corner!"
      />

      <form action={handleSubmit} className="flex flex-col gap-5">
        {error && (
          <p className="text-red-600 text-sm text-center">{error}</p>
        )}

        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="your@email.com"
          disabled={isPending}
        />
        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="••••••••"
          disabled={isPending}
        />

        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 size={16} className="animate-spin" /> Logging in...
            </span>
          ) : (
            "Login"
          )}
        </Button>
      </form>

      <div className="flex flex-col items-center gap-2">
        <p className="text-center text-sm text-gray-500">
          Not a Werey??{" "}
          <Link href="/admin/signup" className="text-primary font-bold">
            Sign up
          </Link>
        </p>
        <Link
          href="/admin/forgot-password"
          className="text-sm text-primary dark:text-[#93b8f0] font-semibold hover:opacity-70 transition-opacity"
        >
          Forgot password?
        </Link>
      </div>
    </AuthCard>
  );
}
