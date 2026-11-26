"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { ConsentCopy } from "@/content/consent";
import { OPEN_SETTINGS_EVENT, readConsent, saveConsent } from "@/lib/consent";

/**
 * First-visit cookie banner (bottom bar) + settings dialog. Accept all and Reject all are the
 * same size; in Settings both optional groups start off. Nothing optional loads before a "yes"
 * (see consent/Trackers). The footer's "Cookie settings" reopens the dialog.
 */
export function ConsentBanner({ copy }: { copy: ConsentCopy }) {
  const [show, setShow] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const c = readConsent();
    // First visit: ask. A saved choice is shown in the dialog when it is reopened.
    const t = setTimeout(() => setShow(!c), 0);
    const open = () => {
      const now = readConsent();
      setAnalytics(Boolean(now?.analytics));
      setMarketing(Boolean(now?.marketing));
      dialog.current?.showModal();
    };
    window.addEventListener(OPEN_SETTINGS_EVENT, open);
    return () => {
      clearTimeout(t);
      window.removeEventListener(OPEN_SETTINGS_EVENT, open);
    };
  }, []);

  const decide = (a: boolean, m: boolean) => {
    dialog.current?.close();
    setShow(false);
    saveConsent(a, m);
  };

  const openSettings = () => {
    setAnalytics(false);
    setMarketing(false);
    dialog.current?.showModal();
  };

  return (
    <>
      {show && (
        <section className="cb-bar" aria-label="Cookie choices">
          <div className="cb-in">
            <div className="cb-txt">
              <h2>{copy.title}</h2>
              <p>
                {copy.body} <Link href="/cookies">Cookie Notice</Link>
              </p>
            </div>
            <div className="cb-row">
              <button type="button" className="cb-link" onClick={openSettings}>
                Settings
              </button>
              <button type="button" className="cb-b cb-rej" onClick={() => decide(false, false)}>
                Reject all
              </button>
              <button type="button" className="cb-b cb-acc" onClick={() => decide(true, true)}>
                Accept all
              </button>
            </div>
          </div>
        </section>
      )}

      <dialog ref={dialog} className="cb-dlg" aria-labelledby="cb-dlg-title">
        <h2 id="cb-dlg-title">{copy.settingsTitle}</h2>
        <p>{copy.settingsIntro}</p>
        <div className="cb-cats">
          <div className="cb-cat">
            <div>
              <b>{copy.groups.necessary.name}</b>
              <p>{copy.groups.necessary.text}</p>
            </div>
            <span className="cb-always">Always on</span>
          </div>
          {(
            [
              ["analytics", analytics, setAnalytics],
              ["marketing", marketing, setMarketing],
            ] as const
          ).map(([key, on, set]) => (
            <label className="cb-cat" key={key}>
              <div>
                <b>{copy.groups[key].name}</b>
                <p>{copy.groups[key].text}</p>
              </div>
              <input
                type="checkbox"
                role="switch"
                className="cb-sw"
                checked={on}
                onChange={(e) => set(e.target.checked)}
              />
            </label>
          ))}
        </div>
        <div className="cb-row cb-foot">
          <button type="button" className="cb-b cb-rej" onClick={() => decide(false, false)}>
            Reject all
          </button>
          <button type="button" className="cb-b cb-rej cb-save" onClick={() => decide(analytics, marketing)}>
            Save choices
          </button>
          <button type="button" className="cb-b cb-acc" onClick={() => decide(true, true)}>
            Accept all
          </button>
        </div>
      </dialog>
    </>
  );
}

/** Footer / Cookie Notice link that reopens the settings dialog. */
export function CookieSettingsLink({ className }: { className?: string }) {
  return (
    <button
      type="button"
      className={`cb-open ${className ?? ""}`}
      onClick={() => window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT))}
    >
      Cookie settings
    </button>
  );
}
