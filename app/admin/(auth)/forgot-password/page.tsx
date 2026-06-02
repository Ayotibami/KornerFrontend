"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import AuthCard from "@/components/admin/ui/AuthCard";
import AuthBranding from "@/components/admin/ui/AuthBranding";
import Button from "@/components/admin/ui/Button";
import Input from "@/components/admin/ui/Input";
import { requestOtp } from "./action";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (formData: FormData) => {
    const email = formData.get("email") as string;
    setError(null);
    startTransition(async () => {
      const result = await requestOtp(email);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      toast.success("OTP sent! Check your email.");
      router.push(`/admin/reset-password?email=${encodeURIComponent(email)}`);
    });
  };

  return (
    <AuthCard>
      <AuthBranding
        title="Forgot Password?"
        subtitle="Enter your email and we'll send you an OTP to reset your password."
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

        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 size={16} className="animate-spin" /> Sending OTP...
            </span>
          ) : (
            "Send OTP"
          )}
        </Button>
      </form>
    </AuthCard>
  );
}
