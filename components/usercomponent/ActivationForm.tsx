"use client";

import { useState } from "react";
import OneSignal from "react-onesignal";
import { oneSignalReady } from "@/components/usercomponent/OneSignalInit";
import Button from "@/components/admincomponent/Button";
import { nunito } from "@/lib/font";

export default function ActivationForm() {
  // "idle" = not yet clicked, "enabled" = just subscribed, "already-on" = was already subscribed, "blocked" = browser denied
  const [notifStatus, setNotifStatus] = useState<
    "idle" | "enabled" | "already-on" | "blocked"
  >("idle");

  const handleEnableNotifications = async () => {
    if (Notification.permission === "denied") {
      setNotifStatus("blocked");
      return;
    }
    if (Notification.permission === "granted") {
      // call optIn() even if already granted — covers the case where the user
      // enabled notifications directly in browser settings without going through
      // our button, meaning OneSignal may have no record of them yet.
      // optIn() is safe to call multiple times — OneSignal upserts, no duplicates.
      try {
        await oneSignalReady;
        await OneSignal.User.PushSubscription.optIn();
        const subscriptionId = OneSignal.User.PushSubscription.id;

        console.log(subscriptionId);
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
      console.error("OneSignal init or permission request failed", error);
    }
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
            fontFamily: nunito.style.fontFamily,
            fontSize: "clamp(1.25rem, 3vw, 1.875rem)",
            fontWeight: 800,
            color: "white",
          }}
        >
          Korner effect
        </p>
        <p
          style={{
            fontFamily: nunito.style.fontFamily,
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
        {/* Email section */}
        <input
          placeholder="Nickname"
          style={{
            backgroundColor: "white",
            border: "none",
            borderRadius: 14,
            padding: "16px 20px",
            fontSize: "0.9375rem",
            fontFamily: nunito.style.fontFamily,
            color: "#0f1e3d",
            outline: "none",
            width: "100%",
            boxSizing: "border-box",
          }}
        />
        <input
          placeholder="Email"
          type="email"
          style={{
            backgroundColor: "white",
            border: "none",
            borderRadius: 14,
            padding: "16px 20px",
            fontSize: "0.9375rem",
            fontFamily: nunito.style.fontFamily,
            color: "#0f1e3d",
            outline: "none",
            width: "100%",
            boxSizing: "border-box",
          }}
        />
        <div style={{ width: "fit-content" }}>
          <Button>Email me</Button>
        </div>

        {/* "or" divider — two lines with "or" centred between them */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginTop: 8,
          }}
        >
          <div
            style={{
              flex: 1,
              height: 1,
              backgroundColor: "rgba(255,255,255,0.15)",
            }}
          />
          <p
            style={{
              fontFamily: nunito.style.fontFamily,
              fontSize: "0.8rem",
              fontWeight: 600,
              color: "rgba(255,255,255,0.4)",
              margin: 0,
            }}
          >
            or
          </p>
          <div
            style={{
              flex: 1,
              height: 1,
              backgroundColor: "rgba(255,255,255,0.15)",
            }}
          />
        </div>

        {/* Notify section */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {notifStatus === "idle" && (
            <div style={{ width: "fit-content" }}>
              <Button onClick={handleEnableNotifications}>Notify me</Button>
            </div>
          )}

          {notifStatus === "enabled" && (
            <p
              style={{
                fontFamily: nunito.style.fontFamily,
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "#5ECFA8",
                margin: 0,
              }}
            >
              Notifications On
            </p>
          )}

          {notifStatus === "already-on" && (
            <p
              style={{
                fontFamily: nunito.style.fontFamily,
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "#5ECFA8",
                margin: 0,
              }}
            >
              You don already subscribe — we go find you when we drop a new
              stori
            </p>
          )}

          {notifStatus === "blocked" && (
            <p
              style={{
                fontFamily: nunito.style.fontFamily,
                fontSize: "0.8rem",
                fontWeight: 500,
                color: "#FF6B6B",
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              You don block notifications for this site. To fix am, click the
              lock icon for your address bar, go to Site settings, change
              Notifications back to Allow, then reload the page.
            </p>
          )}

          <p
            style={{
              fontFamily: nunito.style.fontFamily,
              fontSize: "0.8rem",
              fontWeight: 500,
              color: "rgba(255,255,255,0.4)",
              margin: 0,
              lineHeight: 1.6,
            }}
          >
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
