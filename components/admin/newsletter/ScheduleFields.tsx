"use client";

// Shared date + time picker for scheduling a newsletter — used by both the
// compose form (NewsletterForm) and the edit modal (NewsletterEditModal) so a
// scheduled time always looks and behaves the same everywhere.

import React, { useRef, useMemo, useEffect } from "react";
import { useTimescape } from "timescape/react";
import { DayPicker } from "react-day-picker";
import { CalendarClock } from "lucide-react";

// ─── Calendar classNames ──────────────────────────────────────────────────────

const CALENDAR_CLASSES = {
  root:            "relative w-full font-nunito select-none",
  months:          "w-full",
  month:           "w-full",
  month_caption:   "h-10 flex items-center justify-center mb-3",
  caption_label:   "relative z-10 text-sm font-extrabold text-[#0f1e3d] dark:text-gray-50 font-nunito",
  nav:             "absolute inset-x-0 top-0 h-10 flex items-center justify-between",
  button_previous: "w-9 h-9 flex items-center justify-center rounded-full bg-secondary dark:bg-[#1e3a5f] text-primary dark:text-[#93b8f0] hover:opacity-80 transition-opacity cursor-pointer",
  button_next:     "w-9 h-9 flex items-center justify-center rounded-full bg-secondary dark:bg-[#1e3a5f] text-primary dark:text-[#93b8f0] hover:opacity-80 transition-opacity cursor-pointer",
  chevron:         "fill-current",
  month_grid:      "w-full",
  weekdays:        "",
  weekday:         "text-center text-xs font-bold text-gray-400 dark:text-gray-500 py-2.5 font-nunito",
  weeks:           "",
  week:            "",
  day:             "text-center align-middle p-0.5 group",
  day_button: [
    "w-9 h-9 mx-auto rounded-full flex items-center justify-center",
    "text-sm font-semibold font-nunito text-[#0f1e3d] dark:text-gray-200",
    "transition-all duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
    "hover:bg-[#F0F5FF] dark:hover:bg-[#1e2a3a] hover:text-primary dark:hover:text-[#93b8f0]",
    "group-data-[selected]:!bg-primary group-data-[selected]:!text-white",
    "group-data-[selected]:hover:!bg-primary group-data-[selected]:hover:!text-white",
    "group-data-[today]:font-extrabold group-data-[today]:text-primary dark:group-data-[today]:text-[#93b8f0]",
    "group-data-[today]:ring-2 group-data-[today]:ring-primary/30 dark:group-data-[today]:ring-[#93b8f0]/20",
    "group-data-[disabled]:opacity-30 group-data-[disabled]:pointer-events-none",
    "group-data-[outside]:opacity-25",
  ].join(" "),
  selected: "",
  today:    "",
  disabled: "",
  outside:  "",
  hidden:   "invisible",
};

// ─── Time picker ──────────────────────────────────────────────────────────────

const SEG =
  "w-12 text-center bg-transparent text-4xl font-extrabold font-nunito text-[#0f1e3d] dark:text-gray-100 outline-none focus:bg-secondary dark:focus:bg-[#1e3a5f] rounded-xl py-1 caret-transparent tabular-nums transition-colors duration-150 select-none";

function TimePicker({ time, onTimeChange }: { time: string; onTimeChange: (time: string) => void }) {
  const hoursRef   = useRef<HTMLInputElement>(null);
  const minutesRef = useRef<HTMLInputElement>(null);

  // Block non-numeric keystrokes before timescape's bubble-phase listener sees them
  useEffect(() => {
    const block = (e: KeyboardEvent) => {
      const controls = new Set([
        "Backspace", "Delete", "Tab", "Enter",
        "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown",
      ]);
      if (!controls.has(e.key) && !/^\d$/.test(e.key)) {
        e.stopImmediatePropagation();
        e.preventDefault();
      }
    };
    const h = hoursRef.current;
    const m = minutesRef.current;
    h?.addEventListener("keydown", block, { capture: true });
    m?.addEventListener("keydown", block, { capture: true });
    return () => {
      h?.removeEventListener("keydown", block, { capture: true });
      m?.removeEventListener("keydown", block, { capture: true });
    };
  }, []);

  const initialDate = useMemo(() => {
    const d = new Date();
    if (time) {
      const [hours, minutes] = time.split(":").map(Number);
      d.setHours(hours, minutes, 0, 0);
    } else {
      d.setHours(12, 0, 0, 0);
    }
    return d;
    // Only used as timescape's initial value — re-running on every `time`
    // change would fight the user's own typing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { getRootProps, getInputProps, ampm } = useTimescape({
    date: initialDate,
    hour12: true,
    wrapAround: true,
    wheelControl: true,
    onChangeDate: (date) => {
      if (!date) { onTimeChange(""); return; }
      const h = date.getHours().toString().padStart(2, "0");
      const m = date.getMinutes().toString().padStart(2, "0");
      onTimeChange(`${h}:${m}`);
    },
  });

  const { ref: rootRef } = getRootProps();
  const currentAmpm = (ampm.value ?? "pm").toUpperCase();

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        ref={rootRef as React.RefCallback<HTMLDivElement>}
        className="flex items-center bg-[#F0F5FF] dark:bg-[#1e2a3a] border-2 border-secondary dark:border-[#2a4a7a] rounded-2xl px-4 py-3 gap-0"
      >
        <input
          {...getInputProps("hours", { ref: hoursRef })}
          className={SEG}
          placeholder="12"
          aria-label="Hours"
        />
        <span className="text-4xl font-extrabold text-primary dark:text-[#93b8f0] select-none leading-none pb-1 mx-0.5">:</span>
        <input
          {...getInputProps("minutes", { ref: minutesRef })}
          className={SEG}
          placeholder="00"
          aria-label="Minutes"
        />
        {/* Hidden am/pm input — gives timescape a segment to auto-advance into
            so focus never loops back to hours after minutes completes. */}
        <input
          {...getInputProps("am/pm")}
          tabIndex={-1}
          aria-hidden="true"
          className="w-0 h-0 opacity-0 absolute pointer-events-none"
        />
        <span className="w-px h-9 bg-secondary dark:bg-[#2a4a7a] mx-3 flex-shrink-0" />
        <button
          type="button"
          onClick={() => ampm.toggle()}
          aria-label={`Switch to ${currentAmpm === "AM" ? "PM" : "AM"}`}
          className="w-14 text-center text-2xl font-extrabold font-nunito text-primary dark:text-[#93b8f0] bg-transparent hover:bg-secondary dark:hover:bg-[#1e3a5f] active:scale-95 rounded-xl py-1 uppercase tracking-widest transition-all duration-150 cursor-pointer select-none flex-shrink-0"
        >
          {currentAmpm}
        </button>
      </div>
      <p className="text-xs text-gray-400 dark:text-gray-500 font-nunito text-center leading-relaxed">
        Tap hours or minutes to edit · tap{" "}
        <span className="font-bold text-primary/60 dark:text-[#93b8f0]/60">AM/PM</span>{" "}
        to toggle
      </p>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function formatScheduled(date: Date | undefined, time: string): string | null {
  if (!date || !time) return null;
  const [hours, minutes] = time.split(":").map(Number);
  const dt = new Date(date);
  dt.setHours(hours, minutes, 0, 0);
  if (isNaN(dt.getTime())) return null;
  const weekday = dt.toLocaleDateString("en-GB", { weekday: "long" });
  const dateStr = dt.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const timeStr = dt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  return `${weekday}, ${dateStr} at ${timeStr}`;
}

export function toScheduledAtIso(date: Date | undefined, time: string): string | null {
  if (!date || !time) return null;
  const [hours, minutes] = time.split(":").map(Number);
  const dt = new Date(date);
  dt.setHours(hours, minutes, 0, 0);
  if (isNaN(dt.getTime())) return null;
  return dt.toISOString();
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function ScheduleFields({
  selectedDate,
  onDateChange,
  time,
  onTimeChange,
  label = "Will send on",
}: {
  selectedDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  time: string;
  onTimeChange: (time: string) => void;
  label?: string;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const scheduledLabel = formatScheduled(selectedDate, time);

  return (
    <div className="flex flex-col gap-5">

      {/* Date */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-primary dark:text-[#93b8f0] font-nunito">
          Pick a date
        </label>
        <div className="rounded-2xl border-2 border-secondary dark:border-[#2a4a7a] bg-[#F0F5FF] dark:bg-[#1e2a3a] p-3 sm:p-4">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={onDateChange}
            disabled={{ before: today }}
            classNames={CALENDAR_CLASSES}
          />
        </div>
      </div>

      <div className="h-px bg-slate-100 dark:bg-slate-700" />

      {/* Time */}
      <div className="flex flex-col gap-3">
        <label className="text-xs font-bold text-primary dark:text-[#93b8f0] font-nunito">
          Pick a time
        </label>
        <TimePicker time={time} onTimeChange={onTimeChange} />
      </div>

      {/* Confirmed schedule */}
      {scheduledLabel && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#F0F5FF] dark:bg-[#1e2a3a] border-2 border-secondary dark:border-[#2a4a7a]">
          <CalendarClock size={15} className="text-primary dark:text-[#93b8f0] flex-shrink-0" />
          <p className="text-sm font-semibold text-[#0f1e3d] dark:text-gray-100 font-nunito">
            {label} {scheduledLabel}
          </p>
        </div>
      )}
    </div>
  );
}
