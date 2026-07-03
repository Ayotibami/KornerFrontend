"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import AuthBranding from "@/components/admin/ui/AuthBranding";
import Button from "@/components/admin/ui/Button";
import Input from "@/components/admin/ui/Input";
import OtpInput from "@/components/admin/ui/OtpInput";
import { resetPassword } from "./action";
import { requestOtp } from "@/app/admin/(auth)/forgot-password/action";

const RESEND_COOLDOWN = 60;

export default function ResetPasswordForm({ email }: { email: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isResending, startResending] = useTransition();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  // Tick the cooldown down every second
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleSubmit = (formData: FormData) => {
    const newPassword = formData.get("newPassword") as string;
    setError(null);
    setResendMessage(null);

    if (otp.length < 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }

    startTransition(async () => {
      const result = await resetPassword(email, otp, newPassword);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      toast.success("Password reset successfully! Please log in.");
      router.push("/admin/login");
    });
  };

  const handleResend = () => {
    setError(null);
    setResendMessage(null);
    startResending(async () => {
      const result = await requestOtp(email);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setResendMessage("OTP resent! Check your email.");
      setCooldown(RESEND_COOLDOWN);
    });
  };

  return (
    <>
      <AuthBranding
        title="Reset Password"
        subtitle={`Enter the OTP sent to ${email} and choose a new password.`}
      />

      <form action={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-xl px-4 py-3">
            <p className="text-red-600 dark:text-red-400 text-sm text-center">{error}</p>
          </div>
        )}
        {resendMessage && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/40 rounded-xl px-4 py-3">
            <p className="text-green-600 dark:text-green-400 text-sm text-center">{resendMessage}</p>
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            OTP Code
          </p>
          <OtpInput value={otp} onChange={setOtp} disabled={isPending} />
        </div>

        <Input
          label="New Password"
          name="newPassword"
          type="password"
          placeholder="••••••••"
          disabled={isPending}
        />

        <Button type="submit" disabled={isPending || otp.length < 6}>
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 size={16} className="animate-spin" /> Resetting…
            </span>
          ) : (
            "Reset Password"
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
        Didn&apos;t receive a code?{" "}
        {cooldown > 0 ? (
          <span className="text-gray-400 dark:text-gray-500">
            Resend in {cooldown}s
          </span>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            className="text-primary dark:text-[#93b8f0] font-semibold hover:opacity-70 transition-opacity disabled:opacity-50 cursor-pointer"
          >
            {isResending ? "Sending…" : "Resend OTP"}
          </button>
        )}
      </p>
    </>
  );
}
