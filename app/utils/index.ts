import type { ClassValue } from "clsx";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export function formatSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes: string[] = ["Bytes", "KB", "MB", "GB", "TB"];

    // Determine the unit index
    const i: number = Math.floor(Math.log(bytes) / Math.log(k));

    // Format the number with 2 decimal places
    const formatted = parseFloat((bytes / Math.pow(k, i)).toFixed(2));

    return `${formatted} ${sizes[i]}`;
}
export const generateUUID = () => crypto.randomUUID();

export const cn = (...inputs: ClassValue[]) => {
    return twMerge(clsx(inputs))
}
