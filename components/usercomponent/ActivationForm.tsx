"use client";

import { useState } from "react";
import OneSignal from "react-onesignal";
import { oneSignalReady } from "@/components/usercomponent/OneSignalInit";
import Button from "@/components/admincomponent/Button";
import { nunito } from "@/lib/font";

// Email subscription form + push notification opt-in.
// Two-column layout: description text left, inputs + buttons right.
// auto-fit collapses to single column on mobile.
export default function ActivationForm() {
  const [notifEnabled, setNotifEnabled] = useState(false);

  const handleEnableNotifications = async () => {
    // Wait for OneSignal to finish initializing before doing anything.
    // Without this await, clicking the button too early silently does nothing.
    await oneSignalReady;

    // requestPermission(true) shows the browser's native Allow/Block dialog
    // and returns true if the user clicked Allow, false if they clicked Block.
    const granted = await OneSignal.Notifications.requestPermission(true);

    if (granted) {
      // Register this device with OneSignal's servers so it can receive
      // notifications. Just having browser permission is not enough —
      // OneSignal needs to create a push subscription endpoint for this device.
      await OneSignal.User.PushSubscription.optIn();
      setNotifEnabled(true);
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

      {/* Right: name + email inputs + buttons.
          boxSizing: "border-box" on inputs ensures padding is included in width
          so inputs don't overflow their container. */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <input
          placeholder="Full name"
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

        {/* width: fit-content stops buttons from stretching to full column width */}
        <div style={{ display: "flex", flexDirection: "row", gap: 12, flexWrap: "wrap" }}>
          <div style={{ width: "fit-content" }}>
            <Button>Email me</Button>
          </div>

          {/* Notify me button — triggers OneSignal permission flow.
              Swaps to a green "Notifications On" confirmation once subscribed. */}
          {!notifEnabled ? (
            <div style={{ width: "fit-content" }}>
              <Button onClick={handleEnableNotifications}>Notify me</Button>
            </div>
          ) : (
            <p
              style={{
                fontFamily: nunito.style.fontFamily,
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "#5ECFA8",
                margin: 0,
                alignSelf: "center",
              }}
            >
              Notifications On
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
