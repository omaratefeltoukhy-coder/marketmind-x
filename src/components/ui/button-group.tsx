import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonGroupVariants = cva("inline-flex items-center", {
  variants: {
    variant: {
      default: "divide-border border",
      outline: "divide-border border",
      ghost: "divide-border",
    },
    size: {
      default: "",
      sm: "",
      lg: "",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

interface ButtonGroupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof buttonGroupVariants> {}

function ButtonGroup({ className, variant, size, ...props }: ButtonGroupProps) {
  return (
    <div
      className={cn(buttonGroupVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { ButtonGroup, buttonGroupVariants }
