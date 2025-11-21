import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const DEFAULT_CATEGORIES = [
    { name: "Food & Dining", type: "EXPENSE" },
    { name: "Transportation", type: "EXPENSE" },
    { name: "Housing & Rent", type: "EXPENSE" },
    { name: "Utilities", type: "EXPENSE" },
    { name: "Entertainment", type: "EXPENSE" },
    { name: "Shopping", type: "EXPENSE" },
    { name: "Healthcare", type: "EXPENSE" },
    { name: "Salary", type: "INCOME" },
    { name: "Freelance", type: "INCOME" },
    { name: "Investments", type: "INCOME" },
    { name: "Other", type: "EXPENSE" },
];

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Check if user has any categories
        const count = await prisma.category.count({
            where: { userId: session.user.id },
        });

        // If no categories, seed defaults
        if (count === 0) {
            await prisma.category.createMany({
                data: DEFAULT_CATEGORIES.map((c) => ({
                    ...c,
                    userId: session.user.id,
                })),
            });
        }

        const categories = await prisma.category.findMany({
            where: { userId: session.user.id },
            orderBy: { name: "asc" },
        });

        return NextResponse.json(categories);
    } catch (error) {
        return NextResponse.json(
            { error: "Error fetching categories" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { name, type } = await req.json();

        const category = await prisma.category.create({
            data: {
                name,
                type,
                userId: session.user.id,
            },
        });

        return NextResponse.json(category);
    } catch (error) {
        return NextResponse.json(
            { error: "Error creating category" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "ID required" }, { status: 400 });
        }

        // Verify ownership
        const category = await prisma.category.findUnique({
            where: { id },
        });

        if (!category || category.userId !== session.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await prisma.category.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: "Error deleting category" },
            { status: 500 }
        );
    }
}

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id, name } = await req.json();

        if (!id || !name) {
            return NextResponse.json({ error: "ID and name required" }, { status: 400 });
        }

        // Verify ownership
        const category = await prisma.category.findUnique({
            where: { id },
        });

        if (!category || category.userId !== session.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const updatedCategory = await prisma.category.update({
            where: { id },
            data: { name },
        });

        return NextResponse.json(updatedCategory);
    } catch (error) {
        return NextResponse.json(
            { error: "Error updating category" },
            { status: 500 }
        );
    }
}
