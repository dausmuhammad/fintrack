"use client";
import { useCallback } from "react";
export function useInertWhenHidden() {
  return useCallback((node) => {
    if (!node) return;
    const original = node.inert;
    const sync = () => {
      node.inert = original || node.getAttribute("aria-hidden") === "true";
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(node, {
      attributes: true,
      attributeFilter: ["aria-hidden"],
    });
    return () => {
      observer.disconnect();
      node.inert = original;
    };
  }, []);
}
