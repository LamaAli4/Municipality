import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-12 w-full rounded-lg border border-[#545F71] bg-white px-3",
        className,
      )}
      {...props}
    />
  );
}

export { Input }
