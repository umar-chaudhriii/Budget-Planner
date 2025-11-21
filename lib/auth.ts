import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma) as any,
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    cookies: {
        sessionToken: {
            name: `next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: false, // Set to false for local network access
            },
        },
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        AppleProvider({
            clientId: process.env.APPLE_ID || "",
            clientSecret: process.env.APPLE_SECRET || "",
        }),
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                console.log("[Auth] Authorize called for:", credentials?.email);

                if (!credentials?.email || !credentials?.password) {
                    console.log("[Auth] Missing credentials");
                    throw new Error("Invalid credentials");
                }

                try {
                    console.log("[Auth] Finding user in DB...");
                    const user = await prisma.user.findUnique({
                        where: {
                            email: credentials.email,
                        },
                    });
                    console.log("[Auth] User search complete. Found:", !!user);

                    if (!user || !user.password) {
                        console.log("[Auth] User not found or no password");
                        throw new Error("Invalid credentials");
                    }

                    console.log("[Auth] Verifying password...");
                    const isCorrectPassword = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );
                    console.log("[Auth] Password verification result:", isCorrectPassword);

                    if (!isCorrectPassword) {
                        console.log("[Auth] Invalid password");
                        throw new Error("Invalid credentials");
                    }

                    console.log("[Auth] Login successful for:", user.email);
                    return user;
                } catch (error) {
                    console.error("[Auth] Error in authorize:", error);
                    throw error;
                }
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            if (token && session.user && token.sub) {
                session.user.id = token.sub;
                session.user.currency = token.currency as string;

                // Fetch fresh image from DB since it's too large for JWT
                try {
                    const user = await prisma.user.findUnique({
                        where: { id: token.sub },
                        select: { image: true }
                    });
                    session.user.image = user?.image || null;
                } catch (error) {
                    console.error("Error fetching user image:", error);
                }
            }
            return session;
        },
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.sub = user.id;
                // @ts-ignore
                token.currency = user.currency || "USD";
                // Don't store image in token as base64 is too large
            }

            // Handle session update for currency
            if (trigger === "update" && session?.currency) {
                token.currency = session.currency;
            }

            // If no currency in token (e.g. old session), try to fetch or default
            if (!token.currency) {
                const dbUser = await prisma.user.findUnique({ where: { id: token.sub } });
                token.currency = dbUser?.currency || "USD";
            }

            return token;
        },
    },
};
