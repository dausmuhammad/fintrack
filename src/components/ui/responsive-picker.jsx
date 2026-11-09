"use client";
import { cloneElement } from "react";
import { useMobile } from "@/hooks/use-mobile";
import { BottomPanel } from "./bottom-panel";
import { Popover, PopoverTrigger, PopoverContent } from "./popover";
export function ResponsivePicker({
  open,
  onOpenChange,
  title,
  description,
  trigger,
  children,
  className,
}) {
  const mobile = useMobile();
  if (mobile)
    return (
      <>
        {cloneElement(trigger, {
          onClick: () => onOpenChange(true),
          "aria-haspopup": "dialog",
          "aria-expanded": open,
        })}
        <BottomPanel
          open={open}
          onOpenChange={onOpenChange}
          title={title}
          description={description}
          className="calendar-panel"
        >
          {children}
        </BottomPanel>
      </>
    );
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent className={className} aria-label={title}>
        {children}
      </PopoverContent>
    </Popover>
  );
}
