import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/libs/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-all disabled:pointer-events-none disabled:bg-gray-100 disabled:text-white [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-primary-200 focus-visible:ring-offset-2 aria-invalid:ring-destructive/20 aria-invalid:border-alert cursor-pointer w-[165px] h-[44px] rounded-3.5",
  {
    variants: {
      variant: {
        primary: "bg-primary-100 text-white hover:bg-primary-200",
        secondary: "bg-primary-20 text-primary-200 hover:bg-primary-50",
        tertiary: "bg-primary-50 text-gray-300 hover:bg-primary-60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",

        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 w -[165px] px-6 py-3.5 has-[>svg]:px-5",
        icon: "size-11 rounded-3.5",
        "icon-xs": "size-6 rounded-3.5 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-9 rounded-3.5",
        "icon-lg": "size-12 rounded-3.5",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "primary",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(
        "text-body-3-2",
        buttonVariants({ variant, size, className }),
      )}
      {...props}
    />
  );
}

export { Button, buttonVariants };
