"use client";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@/lib/utils";
export function Label({ className, ...props }) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn("ui-label", className)}
      {...props}
    />
  );
}
