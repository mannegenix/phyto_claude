"use client";

import { useEffect, type RefObject } from "react";

/**
 * Horizontal carousels: drag with the mouse to scroll (touch and trackpad swipes scroll
 * natively). Snapping is paused while dragging; on release `onRelease` gets the chance to
 * settle on the nearest slide. A drag never triggers the link or button under the pointer.
 */
export function useDragScroll(ref: RefObject<HTMLElement | null>, onRelease?: () => void) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let down = false;
    let moved = false;
    let startX = 0;
    let startLeft = 0;

    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      down = true;
      moved = false;
      startX = e.clientX;
      startLeft = el.scrollLeft;
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) < 6) return;
      if (!moved) {
        moved = true;
        el.classList.add("is-dragging");
        el.setPointerCapture?.(e.pointerId);
      }
      el.scrollLeft = startLeft - dx;
    };
    const onUp = (e: PointerEvent) => {
      if (!down) return;
      down = false;
      if (moved) {
        el.classList.remove("is-dragging");
        el.releasePointerCapture?.(e.pointerId);
        onRelease?.();
      }
    };
    // Swallow the click that ends a drag, so links and buttons do not fire.
    const onClick = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    };
    const noDrag = (e: DragEvent) => e.preventDefault();

    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    el.addEventListener("click", onClick, true);
    el.addEventListener("dragstart", noDrag);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      el.removeEventListener("click", onClick, true);
      el.removeEventListener("dragstart", noDrag);
    };
  }, [ref, onRelease]);
}
