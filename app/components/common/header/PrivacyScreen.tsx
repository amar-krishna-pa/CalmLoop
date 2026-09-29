"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { LuLock, LuLockOpen, LuWind } from "react-icons/lu";

type Props = {
  initiallyVisible: boolean;
};

const COOKIE_NAME = "calmloop_privacy_screen";

export default function PrivacyScreen({ initiallyVisible }: Props) {
  const [isVisible, setIsVisible] = useState(initiallyVisible);

  function showPrivacyScreen() {
    document.cookie = `${COOKIE_NAME}=visible; Path=/; SameSite=Lax`;
    setIsVisible(true);
  }

  function hidePrivacyScreen() {
    document.cookie = `${COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`;
    setIsVisible(false);
  }

  const overlay = (
    <AnimatePresence initial={false}>
      {isVisible && (
        <motion.div
          key="privacy-screen"
          role="dialog"
          aria-modal="true"
          aria-label="Privacy screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-100 flex items-center justify-center bg-modal/85 p-5 backdrop-blur-2xl"
        >
          <div className="text-center">
            <div
              aria-hidden="true"
              className="relative mx-auto flex size-36 items-center justify-center"
            >
              <motion.div
                animate={{ scale: [1, 1.5, 1] }}
                transition={{
                  duration: 10,
                  times: [0, 0.4, 1],
                  ease: "easeInOut",
                  repeat: Infinity,
                }}
                className="absolute size-24 rounded-full border-2 border-accent/30 bg-accent/5"
              />
              <LuWind size={22} className="text-accent/60" />
            </div>

            <div className="mt-4">
              <p className="text-sm font-medium text-accent">
                Breathe with the circle
              </p>
              <p className="mt-1 text-xs text-muted">
                Inhale as it grows. Exhale as it shrinks.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={hidePrivacyScreen}
            aria-label="Return to CalmLoop"
            className="icon-btn absolute right-4 top-3 cursor-pointer sm:right-6"
          >
            <LuLockOpen size={15} aria-hidden="true" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <button
        type="button"
        onClick={showPrivacyScreen}
        aria-label="Show privacy screen"
        className="icon-btn cursor-pointer"
      >
        <LuLock size={15} aria-hidden="true" />
      </button>

      {typeof document !== "undefined"
        ? createPortal(overlay, document.body)
        : null}
    </>
  );
}
