import { cn } from "@/lib/utils";

function Textarea({ className, ...props }) {
    return (
        <textarea
            data-slot="textarea"
            className={cn(
                "w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-black placeholder:text-gray-400 resize-y",
                "focus:outline-none focus:ring-2 focus:ring-black/5 transition-all",
                "disabled:cursor-not-allowed disabled:opacity-60",
                className
            )}
            {...props}
        />
    );
}

export { Textarea };
