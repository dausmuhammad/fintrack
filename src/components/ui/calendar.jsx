"use client";
import { DayPicker } from "react-day-picker";
import { id as localeId } from "react-day-picker/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SelectField } from "./select";
import { cn } from "@/lib/utils";
function CalendarDropdown({
  options,
  value,
  onChange,
  "aria-label": label,
  disabled,
}) {
  return (
    <SelectField
      value={String(value)}
      disabled={disabled}
      onValueChange={(next) => onChange?.({ target: { value: next } })}
      aria-label={label}
      label={label}
      className="calendar-dropdown"
      options={
        options?.map((option) => ({
          ...option,
          value: String(option.value),
        })) ?? []
      }
    />
  );
}
export function Calendar({ className, ...props }) {
  return (
    <div data-slot="calendar" className={cn("ui-calendar", className)}>
      <DayPicker
        locale={localeId}
        showOutsideDays
        captionLayout="dropdown"
        navLayout="after"
        startMonth={new Date(1900, 0)}
        components={{
          Dropdown: CalendarDropdown,
          Chevron: ({ orientation }) =>
            orientation === "left" ? (
              <ChevronLeft size={16} aria-hidden="true" />
            ) : (
              <ChevronRight size={16} aria-hidden="true" />
            ),
        }}
        {...props}
      />
    </div>
  );
}
