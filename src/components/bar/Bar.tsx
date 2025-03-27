
type BarVariant = "red" | "yellow";

export default function Bar({ variant, message, cn } : { variant: string, message: string, cn?: string }) {
    if (variant === "red") {
        return (
            <div className={`
                mx-auto rounded-md px-3 py-1 bg-red-100 border border-red-300 text-red-700 text-sm
                ${cn && cn}
            `}>
                {message}
            </div>
        );
    }
    if (variant === "blue") {
        return (
            <div className={`
                mx-auto rounded-md px-3 py-1 bg-blue-50 border border-blue-300 text-blue-700 text-sm
                ${cn && cn}
            `}>
                {message}
            </div>
        );
    }
}
