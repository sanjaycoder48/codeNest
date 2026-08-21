import { cn } from "@/lib/utils";

// Defaults to the existing .anti-gravity-card look; pass `flat` styling via
// className where the lift-on-hover is not wanted.
function Card({ className, ...props }) {
    return (
        <div
            data-slot="card"
            className={cn("anti-gravity-card bg-white p-6 flex flex-col", className)}
            {...props}
        />
    );
}

function CardHeader({ className, ...props }) {
    return <div data-slot="card-header" className={cn("flex items-start justify-between gap-3 mb-2", className)} {...props} />;
}

function CardTitle({ className, ...props }) {
    return <h3 data-slot="card-title" className={cn("text-xl font-bold", className)} {...props} />;
}

function CardDescription({ className, ...props }) {
    return <p data-slot="card-description" className={cn("text-gray-500 text-sm", className)} {...props} />;
}

function CardContent({ className, ...props }) {
    return <div data-slot="card-content" className={cn("flex-1", className)} {...props} />;
}

function CardFooter({ className, ...props }) {
    return <div data-slot="card-footer" className={cn("flex flex-wrap gap-2", className)} {...props} />;
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
