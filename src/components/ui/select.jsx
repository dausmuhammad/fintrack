"use client";
import { useId, useState } from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";
import { BottomPanel } from "./bottom-panel";
import { Button } from "./button";
export const Select = SelectPrimitive.Root;
export const SelectValue = SelectPrimitive.Value;
export function SelectTrigger({ className, children, ...props }) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn("ui-select-trigger", className)}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown size={16} aria-hidden="true" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}
export function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        position={position}
        sideOffset={6}
        collisionPadding={12}
        className={cn("ui-select-content", className)}
        {...props}
      >
        <SelectPrimitive.ScrollUpButton className="ui-select-scroll">
          <ChevronUp size={16} aria-hidden="true" />
        </SelectPrimitive.ScrollUpButton>
        <SelectPrimitive.Viewport className="ui-select-viewport">
          {children}
        </SelectPrimitive.Viewport>
        <SelectPrimitive.ScrollDownButton className="ui-select-scroll">
          <ChevronDown size={16} aria-hidden="true" />
        </SelectPrimitive.ScrollDownButton>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}
export function SelectItem({ className, children, ...props }) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn("ui-select-item", className)}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="ui-select-check">
        <Check size={16} aria-hidden="true" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}
export function SelectField({
  id,
  value,
  onValueChange,
  options,
  label,
  placeholder = "Pilih opsi",
  className,
  ...props
}) {
  const mobile = useMobile();
  const [open, setOpen] = useState(false);
  const listId = useId();
  const title = label || props["aria-label"] || placeholder;
  function moveFocus(event) {
    const keys = ["ArrowDown", "ArrowUp", "Home", "End"];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    const items = [
      ...event.currentTarget.querySelectorAll('[role="option"]:not(:disabled)'),
    ];
    const index = items.indexOf(document.activeElement);
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? items.length - 1
          : (index + (event.key === "ArrowDown" ? 1 : -1) + items.length) %
            items.length;
    items[next]?.focus();
  }
  if (mobile)
    return (
      <>
        <Button
          id={id}
          type="button"
          variant="outline"
          role="combobox"
          aria-label={props["aria-label"]}
          aria-haspopup="listbox"
          aria-controls={listId}
          aria-expanded={open}
          data-slot="select-trigger"
          className={cn("ui-select-trigger", className)}
          onClick={() => setOpen(true)}
          {...props}
        >
          <span>
            {options.find((option) => option.value === value)?.label ||
              placeholder}
          </span>
          <ChevronDown size={16} aria-hidden="true" />
        </Button>
        <BottomPanel
          open={open}
          onOpenChange={setOpen}
          title={title}
          description="Ketuk salah satu pilihan untuk menerapkannya."
        >
          <div
            id={listId}
            role="listbox"
            aria-label={title}
            data-slot="select-content"
            className="mobile-options"
            onKeyDown={moveFocus}
          >
            {options.map((option, index) => (
              <button
                type="button"
                key={option.value}
                role="option"
                aria-selected={value === option.value}
                disabled={option.disabled}
                tabIndex={
                  value === option.value || (!value && index === 0) ? 0 : -1
                }
                className="mobile-option"
                onClick={() => {
                  onValueChange(option.value);
                  setOpen(false);
                }}
              >
                <span>{option.label}</span>
                {value === option.value && (
                  <Check size={18} aria-hidden="true" />
                )}
              </button>
            ))}
          </div>
        </BottomPanel>
      </>
    );
  return (
    <Select
      value={value}
      onValueChange={onValueChange}
      disabled={props.disabled}
    >
      <SelectTrigger id={id} className={className} {...props}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
