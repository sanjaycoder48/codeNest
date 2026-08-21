import { cn } from "@/lib/utils";

// Matches the existing input styling: gray-50 fill, gray-100 hairline,
// rounded-xl, and the soft black focus ring.
function Input({ className, type = "text", ...props }) {
    return (
        <input
            type={type}
            data-slot="input"
            className={cn(
                "w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-black placeholder:text-gray-400",
                "focus:outline-none focus:ring-2 focus:ring-black/5 transition-all",
                "disabled:cursor-not-allowed disabled:opacity-60",
                "aria-invalid:border-red-300 aria-invalid:focus:ring-red-100",
                className
            )}
            {...props}
        />
    );
}

export { Input };
