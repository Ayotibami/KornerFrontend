"use client";

// Six individual digit boxes for OTP entry.
// Behaviours:
//   - Typing a digit auto-focuses the next box
//   - Backspace clears the current box and moves focus back
//   - Pasting a 6-digit string fills all boxes at once
//   - onChange fires with the joined 6-char string on every change

import { useRef, KeyboardEvent, ClipboardEvent, ChangeEvent } from "react";

const boxClass =
  "flex-1 min-w-0 max-w-[52px] h-14 text-center text-xl font-bold rounded-xl border-2 border-secondary dark:border-[#2a4a7a] bg-[#F0F5FF] dark:bg-[#1e2a3a] text-[#0f1e3d] dark:text-gray-50 outline-none focus:border-primary dark:focus:border-[#93b8f0] focus:ring-2 focus:ring-primary/10 transition-colors";

export default function OtpInput({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = Array.from({ length: 6 }, (_, i) => value[i] ?? "");

  const update = (index: number, char: string) => {
    const next = digits.map((d, i) => (i === index ? char : d));
    onChange(next.join(""));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const char = e.target.value.replace(/\D/g, "").slice(-1); // digits only
    update(index, char);
    if (char && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (digits[index]) {
        update(index, "");
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        update(index - 1, "");
      }
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    onChange(pasted.padEnd(6, "").slice(0, 6));
    const focusIndex = Math.min(pasted.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  return (
    <div className="flex gap-2 justify-center">
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => { inputRefs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onPaste={handlePaste}
          className={`${boxClass} ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
        />
      ))}
    </div>
  );
}
