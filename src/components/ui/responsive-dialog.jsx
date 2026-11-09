"use client";
import { useRef } from "react";
import { useMobile } from "@/hooks/use-mobile";
import { X } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "./drawer";
import { Button } from "./button";
export function ResponsiveDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
}) {
  const mobile = useMobile();
  const previousFocus = useRef(null);
  function capture(event) {
    previousFocus.current = document.activeElement;
    event.preventDefault();
    const firstField =
      event.target.querySelector(
        'input:not([type="file"]), [role="combobox"]',
      ) ?? event.target.querySelector("button");
    firstField?.focus();
  }
  function restore(event) {
    event.preventDefault();
    requestAnimationFrame(() => previousFocus.current?.focus());
  }
  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      direction={mobile ? "bottom" : "right"}
      autoFocus
    >
      <DrawerContent
        className={mobile ? "drawer drawer-bottom" : "drawer drawer-right"}
        onOpenAutoFocus={capture}
        onCloseAutoFocus={restore}
      >
        <div className="drawer-header">
          {mobile && <div className="drawer-handle" />}
          <DrawerTitle className="modal-title">{title}</DrawerTitle>
          <DrawerDescription className="muted modal-description">
            {description}
          </DrawerDescription>
          <DrawerClose asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="modal-close"
              aria-label="Tutup drawer"
            >
              <X aria-hidden="true" size={20} />
            </Button>
          </DrawerClose>
        </div>
        <div className="drawer-body">{children}</div>
      </DrawerContent>
    </Drawer>
  );
}
