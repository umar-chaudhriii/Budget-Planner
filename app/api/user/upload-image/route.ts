import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { image } = await req.json();

        if (!image) {
            return NextResponse.json(
                { error: "No image provided" },
                { status: 400 }
            );
        }

        // Validate base64 image
        if (!image.startsWith('data:image/')) {
            return NextResponse.json(
                { error: "Invalid image format" },
                { status: 400 }
            );
        }

        // Extract the base64 data
        const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, 'base64');

        // Generate a unique filename
        const filename = `${session.user.id}-${uuidv4()}.png`;
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        const filePath = path.join(uploadDir, filename);

        // Ensure directory exists
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Write file to disk
        fs.writeFileSync(filePath, buffer);

        const imageUrl = `/uploads/${filename}`;

        // Update user's image in database with the URL path
        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: { image: imageUrl },
        });

        return NextResponse.json({
            success: true,
            imageUrl: updatedUser.image,
        });
    } catch (error) {
        console.error("Image upload error:", error);
        return NextResponse.json(
            { error: "Failed to upload image" },
            { status: 500 }
        );
    }
}
