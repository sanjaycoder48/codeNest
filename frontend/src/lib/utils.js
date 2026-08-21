import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Merges conditional class names and resolves conflicting Tailwind utilities,
// so a caller's `className` can always override a component's defaults.
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
