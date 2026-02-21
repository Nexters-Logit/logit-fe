import * as React from "react";

import { cn } from "@/libs/utils";

function Textarea({
  className,
  onChange,
  ref,
  ...props
}: React.ComponentProps<"textarea">) {
  const innerRef = React.useRef<HTMLTextAreaElement | null>(null);

  const adjustHeight = React.useCallback((textarea: HTMLTextAreaElement) => {
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, []);

  React.useLayoutEffect(() => {
    if (innerRef.current) {
      adjustHeight(innerRef.current);
    }
  });

  return (
    <textarea
      ref={(node) => {
        innerRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
      data-slot="textarea"
      className={cn(
        "placeholder:text-body-5-3 placeholder:text-gray-200 flex w-full rounded-lg border border-gray-70 focus:border-primary-200 caret-primary-200 bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm aria-invalid:ring-alert/20 aria-invalid:border-alert resize-none overflow-hidden",
        className,
      )}
      onChange={(e) => {
        adjustHeight(e.target);
        onChange?.(e);
      }}
      {...props}
    />
  );
}

export { Textarea };
