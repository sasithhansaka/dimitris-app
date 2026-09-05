import { cn } from "@/lib/utils";

export function Wordmark({
    className,
    size = "md",
}: {
    className?: string;
    size?: "sm" | "md" | "lg" | "responsive";
}) {
    const scale = {
        sm: "text-[1.05rem] pb-[3px] border-b-[2px]",
        md: "text-[1.3rem] pb-[4px] border-b-[2.5px]",
        lg: "text-[2rem] pb-[6px] border-b-[3px]",
        responsive:
            "text-[1.05rem] pb-[3px] border-b-[2px] lg:text-[1.3rem] lg:pb-[4px] lg:border-b-[2.5px]",
    }[size];

    return (
        <span
            className={cn(
                "inline-block border-primary font-extrabold tracking-[-0.045em] text-foreground",
                scale,
                className,
            )}
        >
            <img
                src="/perkLogo.png"
                alt="Logo"
                className="h-7 w-7 mt-2 object-cover"
            />
        </span>
    );
}
