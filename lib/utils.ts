import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
    }).format(amount);
}

export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    // Always use 'en-US' locale for consistent formatting across all devices
    return dateObj.toLocaleDateString('en-US', options || {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

export function useCurrency() {
    // This is a helper to get currency from session client-side
    // We can't use hooks here directly if this is a utility file, 
    // but we can export a hook if we move this to a hooks file.
    // For now, we'll keep it simple and pass currency as an argument.
    return 'USD';
}
