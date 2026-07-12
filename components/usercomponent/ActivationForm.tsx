"use client";

import { useState, useTransition } from "react";
import OneSignal from "react-onesignal";
import { oneSignalReady } from "@/components/usercomponent/OneSignalInit";
import Button from "@/components/admincomponent/Button";
import { nunito } from "@/lib/font";
import { subscribeToNewsletter } from "@/app/subscribe-action";

type NotifStatus = "idle" | "enabled" | "already-on" | "blocked";
type EmailStatus = "idle" | "success" | "already-subscribed" | "error";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

const TEXT = { fontFamily: nunito.style.fontFamily };

export default function ActivationForm() {
  const [notifStatus, setNotifStatus] = useState<NotifStatus>("idle");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState<EmailStatus>("idle");
  const [emailError, setEmailError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleEnableNotifications = async () => {
    if (Notification.permission === "denied") {
      setNotifStatus("blocked");
      return;
    }
    if (Notification.permission === "granted") {
      try {
        await oneSignalReady;
        await OneSignal.User.PushSubscription.optIn();
        setNotifStatus("already-on");
      } catch (err) {
        if (process.env.NODE_ENV === "development")
          console.error("OneSignal optIn failed:", err);
      }
      return;
    }
    try {
      await oneSignalReady;
      const granted = await OneSignal.Notifications.requestPermission();
      if (granted) {
        await OneSignal.User.PushSubscription.optIn();
        setNotifStatus("enabled");
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") console.error("OneSignal init or permission request failed", error);
    }
  };

  const handleEmailSubmit = () => {
    setEmailError("");

    if (!name.trim()) {
      setEmailError("Enter your nickname.");
      return;
    }
    if (!email.trim()) {
      setEmailError("Enter your email address.");
      return;
    }
    if (!isValidEmail(email)) {
      setEmailError("That doesn't look like a valid email.");
      return;
    }

    startTransition(async () => {
      const result = await subscribeToNewsletter(name, email);
      if (!result.ok) {
        if (result.alreadySubscribed) {
          setEmailStatus("already-subscribed");
        } else {
          setEmailStatus("error");
          setEmailError(result.message);
        }
        return;
      }
      setEmailStatus("success");
    });
  };

  return (
    <div
      style={{
        backgroundColor: "#0f1e3d",
        width: "95%",
        borderRadius: 20,
        padding: "clamp(24px, 5vw, 60px)",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 40,
        alignItems: "center",
        marginTop: 50,
      }}
    >
      {/* Left: heading + description */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <p
          style={{
            ...TEXT,
            fontSize: "clamp(1.25rem, 3vw, 1.875rem)",
            fontWeight: 800,
            color: "white",
          }}
        >
          Korner effect
        </p>
        <p
          style={{
            ...TEXT,
            fontSize: "0.9375rem",
            fontWeight: 500,
            color: "#C4C4C4",
            lineHeight: 1.7,
          }}
        >
          We no expect you to dey come here everyday dey refresh the page — only
          Kappy get that kind time. Tell us how to reach you — email, phone
          notification, or both — and we go find you whenever we drop a new
          stori.
        </p>
      </div>

      {/* Right: email section + or divider + notify section */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

        {/* ── Email section ── */}
        {emailStatus === "success" ? (
          <div
            style={{
              backgroundColor: "rgba(94,207,168,0.12)",
              border: "1px solid rgba(94,207,168,0.35)",
              borderRadius: 14,
              padding: "20px 24px",
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <p style={{ ...TEXT, fontSize: "0.9375rem", fontWeight: 700, color: "#5ECFA8", margin: 0 }}>
              You don land! 🎉
            </p>
            <p style={{ ...TEXT, fontSize: "0.85rem", fontWeight: 500, color: "rgba(255,255,255,0.6)", margin: 0, lineHeight: 1.6 }}>
              {name.trim() ? `${name.trim()}, we` : "We"} go send every new stori straight to{" "}
              <span style={{ color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>{email}</span>.
              No spam — only Korner.
            </p>
          </div>
        ) : emailStatus === "already-subscribed" ? (
          <div
            style={{
              backgroundColor: "rgba(180,207,246,0.1)",
              border: "1px solid rgba(180,207,246,0.25)",
              borderRadius: 14,
              padding: "20px 24px",
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <p style={{ ...TEXT, fontSize: "0.9375rem", fontWeight: 700, color: "#B4CFF6", margin: 0 }}>
              You don already dey our list!
            </p>
            <p style={{ ...TEXT, fontSize: "0.85rem", fontWeight: 500, color: "rgba(255,255,255,0.5)", margin: 0, lineHeight: 1.6 }}>
              <span style={{ color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>{email}</span>{" "}
              is already subscribed. We go find you when we drop a new stori.
            </p>
          </div>
        ) : (
          <>
            <input
              placeholder="Nickname"
              value={name}
              onChange={(e) => { setName(e.target.value); setEmailError(""); }}
              disabled={isPending}
              style={{
                backgroundColor: "white",
                border: "none",
                borderRadius: 14,
                padding: "16px 20px",
                fontSize: "0.9375rem",
                ...TEXT,
                color: "#0f1e3d",
                outline: "none",
                width: "100%",
                boxSizing: "border-box",
                opacity: isPending ? 0.6 : 1,
              }}
            />
            <input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
              disabled={isPending}
              onKeyDown={(e) => { if (e.key === "Enter") handleEmailSubmit(); }}
              style={{
                backgroundColor: "white",
                border: "2px solid transparent",
                borderRadius: 14,
                padding: "16px 20px",
                fontSize: "0.9375rem",
                ...TEXT,
                color: "#0f1e3d",
                outline: "none",
                width: "100%",
                boxSizing: "border-box",
                opacity: isPending ? 0.6 : 1,
              }}
            />

            {emailError && (
              <p style={{ ...TEXT, fontSize: "0.8rem", fontWeight: 500, color: "#FF6B6B", margin: 0 }}>
                {emailError}
              </p>
            )}

            <div style={{ width: "fit-content", pointerEvents: isPending ? "none" : "auto", opacity: isPending ? 0.6 : 1 }}>
              <Button onClick={handleEmailSubmit}>
                {isPending ? "Sending…" : "Email me"}
              </Button>
            </div>
          </>
        )}

        {/* "or" divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
          <div style={{ flex: 1, height: 1, backgroundColor: "rgba(255,255,255,0.15)" }} />
          <p style={{ ...TEXT, fontSize: "0.8rem", fontWeight: 600, color: "rgba(255,255,255,0.4)", margin: 0 }}>
            or
          </p>
          <div style={{ flex: 1, height: 1, backgroundColor: "rgba(255,255,255,0.15)" }} />
        </div>

        {/* ── Notify section ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {notifStatus === "idle" && (
            <div style={{ width: "fit-content" }}>
              <Button onClick={handleEnableNotifications}>Notify me</Button>
            </div>
          )}

          {notifStatus === "enabled" && (
            <p style={{ ...TEXT, fontSize: "0.875rem", fontWeight: 600, color: "#5ECFA8", margin: 0 }}>
              Notifications on — we go ping you directly!
            </p>
          )}

          {notifStatus === "already-on" && (
            <p style={{ ...TEXT, fontSize: "0.875rem", fontWeight: 600, color: "#5ECFA8", margin: 0 }}>
              You don already subscribe — we go find you when we drop a new stori
            </p>
          )}

          {notifStatus === "blocked" && (
            <p style={{ ...TEXT, fontSize: "0.8rem", fontWeight: 500, color: "#FF6B6B", margin: 0, lineHeight: 1.6 }}>
              You don block notifications for this site. To fix am, click the
              lock icon for your address bar, go to Site settings, change
              Notifications back to Allow, then reload the page.
            </p>
          )}

          <p style={{ ...TEXT, fontSize: "0.8rem", fontWeight: 500, color: "rgba(255,255,255,0.4)", margin: 0, lineHeight: 1.6 }}>
            No time to dey check mail? Click Notify me and we go ping you
            directly on your device whenever we drop a new stori — no inbox, no
            wahala. iPhone users, you go need to add this site to your home
            screen first: open in Safari, tap the share icon, select &ldquo;Add
            to Home Screen&rdquo;, then come back and click the button.
          </p>
        </div>
      </div>
    </div>
  );
}
