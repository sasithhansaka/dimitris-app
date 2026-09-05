import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/** The 1340px shell every page sits inside. */
export function Container({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "header" | "footer" | "nav" | "main";
}) {
  return (
    <Tag className={cn("mx-auto w-full max-w-335 px-5 sm:px-8 lg:px-10", className)}>
      {children}
    </Tag>
  );
}
