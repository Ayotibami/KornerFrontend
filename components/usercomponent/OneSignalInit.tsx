"use client";

import { useEffect } from "react";
import OneSignal from "react-onesignal";

// Module-level promise so ActivationForm can await it before calling requestPermission.
// Without this, clicking the button too early would silently do nothing because
// OneSignal.init() is async and may not have finished yet.
export let oneSignalReady: Promise<void> | null = null;

export default function OneSignalInit() {
  useEffect(() => {
    oneSignalReady = OneSignal.init({
      appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID ?? "",
      // allows localhost (http) to be treated as secure for local testing
      allowLocalhostAsSecureOrigin: true,
      // do not auto-prompt — the button in ActivationForm handles this
      autoRegister: false,
    });
  }, []);

  return null;
}
