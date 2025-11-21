import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const description = searchParams.get("description");

    if (!description || description.length < 3) {
        return NextResponse.json({ categoryId: null });
    }

    try {
        // Find the most recent transaction with a similar description
        const transaction = await prisma.transaction.findFirst({
            where: {
                userId: session.user.id,
                description: {
                    contains: description,
                },
                categoryId: { not: null }
            },
            orderBy: { date: 'desc' },
            select: { categoryId: true }
        });

        return NextResponse.json({ categoryId: transaction?.categoryId || null });
    } catch (error) {
        return NextResponse.json({ error: "Error fetching suggestion" }, { status: 500 });
    }
}
