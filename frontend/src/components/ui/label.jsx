import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@/lib/utils";

// Radix Label wires the control association properly, including for
// components that are not native inputs.
function Label({ className, ...props }) {
    return (
        <LabelPrimitive.Root
            data-slot="label"
            className={cn(
                "block text-sm font-bold mb-2 select-none",
                "peer-disabled:cursor-not-allowed peer-disabled:opacity-60",
                className
            )}
            {...props}
        />
    );
}

export { Label };
