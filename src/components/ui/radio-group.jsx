"use client";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Circle } from "lucide-react";
import { cn } from "@/lib/utils";
export function RadioGroup({ className, ...props }) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("ui-radio-group", className)}
      {...props}
    />
  );
}
export function RadioGroupItem({ className, ...props }) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn("ui-radio-item", className)}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="ui-radio-indicator">
        <Circle size={8} fill="currentColor" aria-hidden="true" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}
