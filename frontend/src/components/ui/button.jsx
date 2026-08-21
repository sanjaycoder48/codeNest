import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Variants mirror the existing .btn-primary / .btn-secondary classes so the
// Radix-backed button is visually identical to the hand-written one.
const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-black/20 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 [&_svg]:pointer-events-none [&_svg]:shrink-0",
    {
        variants: {
            variant: {
                default:
                    "bg-black text-white rounded-full hover:bg-gray-800 hover:scale-105 active:scale-95",
                outline:
                    "bg-white text-black border-2 border-black rounded-full hover:bg-gray-100 hover:scale-105 active:scale-95",
                ghost:
                    "text-gray-500 rounded-xl hover:bg-gray-50 hover:text-black",
                destructive:
                    "text-red-500 rounded-xl hover:bg-red-50",
                link:
                    "text-black underline-offset-4 hover:underline",
                nav:
                    "text-sm font-semibold px-5 py-2 hover:text-gray-600 transition-colors",
            },
            size: {
                default: "px-8 py-3",
                sm: "px-5 py-2 text-sm",
                lg: "px-10 py-4 text-lg",
                icon: "p-2",
                none: "",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

function Button({ className, variant, size, asChild = false, ...props }) {
    const Comp = asChild ? Slot : "button";
    return (
        <Comp
            data-slot="button"
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        />
    );
}

export { Button, buttonVariants };
