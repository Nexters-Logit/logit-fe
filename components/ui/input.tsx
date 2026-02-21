import * as React from "react";

import { cn } from "@/libs/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground border-gray-70 focus:border-primary-200 caret-primary-100 h-11 w-full min-w-0 rounded-lg border bg-transparent px-5 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "aria-invalid:ring-alert/20 aria-invalid:border-alert",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
