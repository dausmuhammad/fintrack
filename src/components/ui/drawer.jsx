"use client";
import { createContext, useContext } from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import { cn } from "@/lib/utils";
import { useInertWhenHidden } from "@/hooks/use-inert-when-hidden";
const DrawerScope = createContext(0);
export function Drawer({ children, ...props }) {
  const depth = useContext(DrawerScope);
  const Root = depth > 0 ? DrawerPrimitive.NestedRoot : DrawerPrimitive.Root;
  return (
    <DrawerScope.Provider value={depth + 1}>
      <Root {...props}>{children}</Root>
    </DrawerScope.Provider>
  );
}
export const DrawerTitle = DrawerPrimitive.Title;
export const DrawerDescription = DrawerPrimitive.Description;
export const DrawerClose = DrawerPrimitive.Close;
export function DrawerContent({ className, children, style, ...props }) {
  const depth = useContext(DrawerScope);
  const inertRef = useInertWhenHidden();
  return (
    <DrawerPrimitive.Portal>
      <DrawerPrimitive.Overlay
        data-slot="drawer-overlay"
        className="overlay"
        style={{ zIndex: 50 + depth * 10 }}
      />
      <DrawerPrimitive.Content
        ref={inertRef}
        data-slot="drawer-content"
        className={cn("app-drawer", className)}
        style={{ zIndex: 51 + depth * 10, ...style }}
        {...props}
      >
        {children}
      </DrawerPrimitive.Content>
    </DrawerPrimitive.Portal>
  );
}
