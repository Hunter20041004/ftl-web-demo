import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "btn-brand hover:brightness-105 hover:-translate-y-px transition",
        outline: "rounded-full bg-white/85 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,.9),0_8px_20px_-12px_rgba(11,31,58,.25)] hover:bg-white",
        ghost: "rounded-full text-foreground hover:bg-secondary",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-10 px-3 md:h-9",   // 手機 40px 才好按，桌機維持 36px
        lg: "h-12 px-5 text-[15px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { buttonVariants };
