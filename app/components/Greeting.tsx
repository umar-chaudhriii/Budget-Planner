"use client";

import { useEffect, useState } from "react";

export default function Greeting({ name }: { name: string }) {
    const [greeting, setGreeting] = useState("");

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour >= 0 && hour < 6) setGreeting("Good Night");
        else if (hour >= 6 && hour < 12) setGreeting("Good Morning");
        else if (hour >= 12 && hour < 14) setGreeting("Good Noon");
        else if (hour >= 14 && hour < 17) setGreeting("Good Afternoon");
        else if (hour >= 17 && hour < 21) setGreeting("Good Evening");
        else setGreeting("Good Night");
    }, []);

    // Prevent hydration mismatch by rendering nothing initially or a default
    if (!greeting) return (
        <>
            <p className="text-blue-100 text-sm font-medium mb-2 opacity-0">Loading...</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
                {name}
            </h1>
        </>
    );

    return (
        <>
            <p className="text-blue-100 text-sm font-medium mb-2">{greeting}</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
                {name}
            </h1>
        </>
    );
}
