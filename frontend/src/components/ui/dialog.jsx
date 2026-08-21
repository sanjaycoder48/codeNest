import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

// Radix handles what the hand-rolled modal did not: focus trap, focus restore
// on close, ESC to dismiss, scroll lock, portalling out of the layout, and
// aria-modal wiring via Title/Description.
const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

function DialogOverlay({ className, ...props }) {
    return (
        <DialogPrimitive.Overlay
            data-slot="dialog-overlay"
            className={cn(
                "fixed inset-0 z-50 bg-black/40 backdrop-blur-sm",
                "data-[state=open]:animate-in data-[state=open]:fade-in-0",
                "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
                className
            )}
            {...props}
        />
    );
}

function DialogContent({ className, children, showCloseButton = true, ...props }) {
    return (
        <DialogPortal>
            <DialogOverlay />
            <DialogPrimitive.Content
                data-slot="dialog-content"
                className={cn(
                    "fixed left-1/2 top-1/2 z-50 w-[calc(100%-3rem)] max-w-lg -translate-x-1/2 -translate-y-1/2",
                    "bg-white rounded-2xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto",
                    "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
                    "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
                    className
                )}
                {...props}
            >
                {children}
                {showCloseButton && (
                    <DialogPrimitive.Close
                        aria-label="Close"
                        className="absolute right-6 top-6 p-2 text-gray-400 hover:text-black rounded-lg hover:bg-gray-50 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-black/20"
                    >
                        <X size={20} />
                    </DialogPrimitive.Close>
                )}
            </DialogPrimitive.Content>
        </DialogPortal>
    );
}

function DialogHeader({ className, ...props }) {
    return <div data-slot="dialog-header" className={cn("mb-6 pr-10", className)} {...props} />;
}

function DialogFooter({ className, ...props }) {
    return <div data-slot="dialog-footer" className={cn("flex items-center gap-3 pt-2", className)} {...props} />;
}

function DialogTitle({ className, ...props }) {
    return <DialogPrimitive.Title data-slot="dialog-title" className={cn("text-2xl font-bold", className)} {...props} />;
}

function DialogDescription({ className, ...props }) {
    return (
        <DialogPrimitive.Description
            data-slot="dialog-description"
            className={cn("text-gray-500 text-sm mt-1", className)}
            {...props}
        />
    );
}

export {
    Dialog,
    DialogTrigger,
    DialogPortal,
    DialogClose,
    DialogOverlay,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
};
