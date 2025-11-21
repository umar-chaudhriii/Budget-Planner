"use client";

import { useSession } from "next-auth/react";

export function useUserCurrency() {
    const { data: session } = useSession();
    return session?.user?.currency || "USD";
}
