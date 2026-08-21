import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

// Replaces window.confirm for destructive actions: styled, focus-trapped, and
// it does not block the whole browser tab.
const AlertDialog = AlertDialogPrimitive.Root;
const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

function AlertDialogContent({ className, children, ...props }) {
    return (
        <AlertDialogPrimitive.Portal>
            <AlertDialogPrimitive.Overlay
                className={cn(
                    "fixed inset-0 z-50 bg-black/40 backdrop-blur-sm",
                    "data-[state=open]:animate-in data-[state=open]:fade-in-0",
                    "data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
                )}
            />
            <AlertDialogPrimitive.Content
                className={cn(
                    "fixed left-1/2 top-1/2 z-50 w-[calc(100%-3rem)] max-w-md -translate-x-1/2 -translate-y-1/2",
                    "bg-white rounded-2xl shadow-2xl p-8",
                    "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
                    "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
                    className
                )}
                {...props}
            >
                {children}
            </AlertDialogPrimitive.Content>
        </AlertDialogPrimitive.Portal>
    );
}

function AlertDialogHeader({ className, ...props }) {
    return <div className={cn("mb-6", className)} {...props} />;
}

function AlertDialogFooter({ className, ...props }) {
    return <div className={cn("flex items-center gap-3", className)} {...props} />;
}

function AlertDialogTitle({ className, ...props }) {
    return <AlertDialogPrimitive.Title className={cn("text-xl font-bold", className)} {...props} />;
}

function AlertDialogDescription({ className, ...props }) {
    return <AlertDialogPrimitive.Description className={cn("text-gray-500 text-sm mt-2", className)} {...props} />;
}

function AlertDialogAction({ className, ...props }) {
    return (
        <AlertDialogPrimitive.Action
            className={cn(
                buttonVariants({ variant: "default", size: "sm" }),
                "bg-red-500 hover:bg-red-600",
                className
            )}
            {...props}
        />
    );
}

function AlertDialogCancel({ className, ...props }) {
    return (
        <AlertDialogPrimitive.Cancel
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), className)}
            {...props}
        />
    );
}

export {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogAction,
    AlertDialogCancel,
};
