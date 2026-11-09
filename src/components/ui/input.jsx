import { cn } from "@/lib/utils";
export function Input({ className, type = "text", ...props }) {
  return (
    <input
      data-slot="input"
      type={type}
      className={cn(type !== "file" && "ui-input", className)}
      {...props}
    />
  );
}
