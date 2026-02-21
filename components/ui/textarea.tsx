import * as React from "react";

import { cn } from "@/libs/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "placeholder:text-body-5-3 placeholder:text-gray-200 flex w-full h-20 rounded-lg border border-gray-70 focus:border-primary-200 caret-primary-200 bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm aria-invalid:ring-alert/20 aria-invalid:border-alert",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
