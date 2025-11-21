import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const goals = await prisma.goal.findMany({
            where: { userId: session.user.id },
            orderBy: { deadline: 'asc' }
        });
        return NextResponse.json(goals);
    } catch (error) {
        return NextResponse.json({ error: "Error fetching goals" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await req.json();
        const { name, targetAmount, currentAmount, deadline } = body;

        const goal = await prisma.goal.create({
            data: {
                name,
                targetAmount: parseFloat(targetAmount),
                currentAmount: parseFloat(currentAmount || 0),
                deadline: deadline ? new Date(deadline) : null,
                userId: session.user.id
            }
        });

        return NextResponse.json(goal);
    } catch (error) {
        return NextResponse.json({ error: "Error creating goal" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await req.json();
        const { id, currentAmount } = body;

        const goal = await prisma.goal.update({
            where: { id, userId: session.user.id },
            data: { currentAmount: parseFloat(currentAmount) }
        });

        return NextResponse.json(goal);
    } catch (error) {
        return NextResponse.json({ error: "Error updating goal" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    try {
        await prisma.goal.delete({
            where: { id, userId: session.user.id }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Error deleting goal" }, { status: 500 });
    }
}
