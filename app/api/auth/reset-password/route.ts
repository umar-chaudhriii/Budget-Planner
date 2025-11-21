import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        const { token, password } = await req.json();

        if (!token || !password) {
            return NextResponse.json({ error: "Missing token or password" }, { status: 400 });
        }

        // Find token
        const verificationToken = await prisma.verificationToken.findUnique({
            where: { token },
        });

        if (!verificationToken) {
            return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
        }

        // Check expiration
        if (new Date() > verificationToken.expires) {
            await prisma.verificationToken.delete({ where: { token } });
            return NextResponse.json({ error: "Token expired" }, { status: 400 });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user
        await prisma.user.update({
            where: { email: verificationToken.identifier },
            data: { password: hashedPassword },
        });

        // Delete token
        await prisma.verificationToken.delete({ where: { token } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Reset password error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
