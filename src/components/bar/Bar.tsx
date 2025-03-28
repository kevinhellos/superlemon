
type BarVariant = "red" | "blue";

export default function Bar({ variant, message, cn } : { variant: BarVariant, message: string, cn?: string }) {
    if (variant === "red") {
        return (
            <div className={`
                mx-auto rounded-md px-3 py-1.5 bg-red-50 border border-red-400 text-red-700 text-sm
                ${cn && cn}
            `}>
                {message}
            </div>
        );
    }
    if (variant === "blue") {
        return (
            <div className={`
                mx-auto rounded-md px-3 py-1.5 bg-blue-50 border border-blue-400 text-blue-700 text-sm
                ${cn && cn}
            `}>
                {message}
            </div>
        );
    }
}
