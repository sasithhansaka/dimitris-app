import { useCallback } from "react";

export type GetInitialsFn = (fullName: string) => string;

function getInitial(name: string): string {
    return Array.from(name)[0] ?? "";
}

export function useInitials(): GetInitialsFn {
    return useCallback((fullName: string): string => {
        const names = fullName.trim().split(/\s+/u).filter(Boolean);

        if (names.length === 0) {
            return "";
        }

        if (names.length === 1) {
            return Array.from(names[0]).slice(0, 2).join("").toUpperCase();
        }

        const firstInitial = getInitial(names[0]);
        const lastInitial = getInitial(names[names.length - 1]);

        return `${firstInitial}${lastInitial}`.toUpperCase();
    }, []);
}
