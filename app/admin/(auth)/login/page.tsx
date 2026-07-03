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

      <form action={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-xl px-4 py-3">
            <p className="text-red-600 dark:text-red-400 text-sm text-center">{error}</p>
          </div>
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

        <Link
          href="/admin/forgot-password"
          className="text-xs text-primary dark:text-[#93b8f0] font-semibold hover:opacity-70 transition-opacity self-end -mt-1"
        >
          Forgot password?
        </Link>

        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 size={16} className="animate-spin" /> Logging in…
            </span>
          ) : (
            "Log in"
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
        Not a Werey?{" "}
        <Link href="/admin/signup" className="text-primary dark:text-[#93b8f0] font-semibold hover:opacity-70 transition-opacity">
          Sign up
        </Link>
      </p>
    </AuthCard>
  );
}
