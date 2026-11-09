"use client";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";
export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;
export function PopoverContent({
  className,
  align = "start",
  sideOffset = 6,
  children,
  ...props
}) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        collisionPadding={12}
        data-vaul-no-drag
        className={cn("ui-popover-content", className)}
        {...props}
      >
        {children}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  );
}
