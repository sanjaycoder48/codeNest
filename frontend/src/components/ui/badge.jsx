import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

// `default` reproduces the existing tech-stack pill exactly.
const badgeVariants = cva(
    "inline-flex items-center justify-center rounded-full font-bold uppercase whitespace-nowrap shrink-0",
    {
        variants: {
            variant: {
                default: "px-3 py-1 bg-gray-100 text-gray-600 text-xs",
                solid: "px-4 py-1.5 bg-black text-white text-xs tracking-widest",
                outline: "px-3 py-1 border border-gray-200 text-gray-600 text-xs",
            },
        },
        defaultVariants: { variant: "default" },
    }
);

function Badge({ className, variant, asChild = false, ...props }) {
    const Comp = asChild ? Slot : "span";
    return <Comp data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
