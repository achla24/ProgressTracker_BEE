import React from "react";
import { NavLink as RouterNavLink, NavLinkProps } from "react-router-dom";
import { cn } from "@/lib/utils";

interface CustomNavLinkProps extends NavLinkProps {
  className?: string | ((state: { isActive: boolean; isPending: boolean }) => string);
  children: React.ReactNode;
}

export function NavLink({ className, children, ...props }: CustomNavLinkProps) {
  return (
    <RouterNavLink
      className={({ isActive, isPending }) => {
        if (typeof className === "function") {
          return className({ isActive, isPending });
        }
        return cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
          isActive
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        );
      }}
      {...props}
    >
      {children}
    </RouterNavLink>
  );
}
