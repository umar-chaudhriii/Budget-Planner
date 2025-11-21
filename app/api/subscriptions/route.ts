import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const subscriptions = await prisma.subscription.findMany({
            where: { userId: session.user.id },
            orderBy: { nextPaymentDate: 'asc' }
        });
        return NextResponse.json(subscriptions);
    } catch (error) {
        return NextResponse.json({ error: "Error fetching subscriptions" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await req.json();
        const { name, amount, frequency, nextPaymentDate } = body;

        const subscription = await prisma.subscription.create({
            data: {
                name,
                amount: parseFloat(amount),
                frequency,
                nextPaymentDate: new Date(nextPaymentDate),
                userId: session.user.id
            }
        });

        return NextResponse.json(subscription);
    } catch (error) {
        return NextResponse.json({ error: "Error creating subscription" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    try {
        await prisma.subscription.delete({
            where: { id, userId: session.user.id }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Error deleting subscription" }, { status: 500 });
    }
}
