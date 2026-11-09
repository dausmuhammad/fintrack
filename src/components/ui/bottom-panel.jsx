"use client";
import { useRef } from "react";
import { X } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "./drawer";
import { Button } from "./button";
export function BottomPanel({
  open,
  onOpenChange,
  title,
  description = "Pilih opsi yang sesuai, lalu kembali ke catatanmu.",
  children,
  className = "",
}) {
  const previousFocus = useRef(null);
  function capture(event) {
    previousFocus.current = document.activeElement;
    event.preventDefault();
    const target =
      event.target.querySelector('[role="option"][aria-selected="true"]') ??
      event.target.querySelector('[role="option"]:not(:disabled)') ??
      event.target.querySelector(".picker-panel-body button:not(:disabled)");
    target?.focus();
  }
  function restore(event) {
    event.preventDefault();
    requestAnimationFrame(() => previousFocus.current?.focus());
  }
  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      direction="bottom"
      autoFocus
    >
      <DrawerContent
        data-picker-panel
        className={`drawer-bottom picker-panel ${className}`}
        onOpenAutoFocus={capture}
        onCloseAutoFocus={restore}
      >
        <div className="drawer-header">
          <div className="drawer-handle" />
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
              aria-label={`Tutup ${title.toLowerCase()}`}
            >
              <X size={20} aria-hidden="true" />
            </Button>
          </DrawerClose>
        </div>
        <div className="drawer-body picker-panel-body" data-vaul-no-drag>
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
