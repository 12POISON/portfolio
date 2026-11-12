"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { OWNER } from "@/lib/content";

// SIGNAL islands — Framer Motion territory (copy toast, composer).
// GSAP never touches these nodes (ownership rule).

export function EmailCopy() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(OWNER.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard blocked — the mailto link still works */
    }
  };

  return (
    <div className="email-copy">
      <a className="email-link mono" data-hover href={`mailto:${OWNER.email}`}>
        {OWNER.email}
      </a>
      <motion.button
        type="button"
        className="email-btn mono"
        data-hover
        onClick={copy}
        whileTap={{ scale: 0.96 }}
        aria-live="polite"
      >
        {copied ? "COPIED ▓" : "COPY □"}
      </motion.button>
      <AnimatePresence>
        {copied && (
          <motion.span
            className="email-toast mono"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
          >
            COPIED TO CLIPBOARD — VERIFY BEFORE SEND.
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

export function MailTo() {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const href = `mailto:${OWNER.email}?subject=${encodeURIComponent(subject || "Signal from the 1-bit site")}&body=${encodeURIComponent(body)}`;

  return (
    <form className="mailto" onSubmit={(e) => e.preventDefault()}>
      <label className="mono mailto-label" htmlFor="mailto-subject">
        SUBJECT
      </label>
      <input
        id="mailto-subject"
        className="mailto-input"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="internship / build / question"
        maxLength={120}
      />
      <label className="mono mailto-label" htmlFor="mailto-body">
        MESSAGE
      </label>
      <textarea
        id="mailto-body"
        className="mailto-input"
        rows={4}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="no backend here — this composes your mail client, honestly."
        maxLength={2000}
      />
      <motion.a
        className="mailto-send mono"
        data-hover
        href={href}
        whileTap={{ scale: 0.97 }}
        aria-label="open email composer"
      >
        COMPOSE ↗
      </motion.a>
    </form>
  );
}
