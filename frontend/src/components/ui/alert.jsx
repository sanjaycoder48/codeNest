import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const alertVariants = cva(
    "flex items-center gap-3 rounded-xl text-sm",
    {
        variants: {
            variant: {
                destructive: "bg-red-50 text-red-500 p-3",
                default: "bg-gray-50 text-gray-600 p-3",
            },
        },
        defaultVariants: { variant: "destructive" },
    }
);

// role="alert" so the message is announced when it appears.
function Alert({ className, variant, ...props }) {
    return <div data-slot="alert" role="alert" className={cn(alertVariants({ variant }), className)} {...props} />;
}

function AlertDescription({ className, ...props }) {
    return <div data-slot="alert-description" className={cn("flex-1", className)} {...props} />;
}

export { Alert, AlertDescription, alertVariants };
