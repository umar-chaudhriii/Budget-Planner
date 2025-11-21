"use client";

import Link from 'next/link';
import { useSession, signOut } from "next-auth/react";
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './ThemeToggle';
import { useState } from 'react';
import { Menu, X, User, Settings, LogOut } from 'lucide-react';
import Image from 'next/image';

export default function Navbar() {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isActive = (path: string) => pathname === path;

    return (
        <nav className="sticky top-0 z-50 w-full bg-white/70 dark:bg-black/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link href="/" className="flex items-center gap-2">
                        <Image
                            src="/logo.png"
                            alt="Budget Planner"
                            width={40}
                            height={40}
                            className="object-contain"
                            priority
                            quality={100}
                        />
                        <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Budget Planner
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {session ? (
                            <>
                                <Link
                                    href="/"
                                    className={cn("text-sm font-medium transition-colors hover:text-primary", isActive('/') ? "text-primary" : "text-muted-foreground")}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/transactions"
                                    className={cn("text-sm font-medium transition-colors hover:text-primary", isActive('/transactions') ? "text-primary" : "text-muted-foreground")}
                                >
                                    Transactions
                                </Link>
                                <Link
                                    href="/categories"
                                    className={cn("text-sm font-medium transition-colors hover:text-primary", isActive('/categories') ? "text-primary" : "text-muted-foreground")}
                                >
                                    Categories
                                </Link>
                                <Link
                                    href="/subscriptions"
                                    className={cn("text-sm font-medium transition-colors hover:text-primary", isActive('/subscriptions') ? "text-primary" : "text-muted-foreground")}
                                >
                                    Subscriptions
                                </Link>
                                <Link
                                    href="/goals"
                                    className={cn("text-sm font-medium transition-colors hover:text-primary", isActive('/goals') ? "text-primary" : "text-muted-foreground")}
                                >
                                    Goals
                                </Link>
                                <Link
                                    href="/calendar"
                                    className={cn("text-sm font-medium transition-colors hover:text-primary", isActive('/calendar') ? "text-primary" : "text-muted-foreground")}
                                >
                                    Calendar
                                </Link>

                                <div className="flex items-center gap-4 pl-4 border-l">
                                    <ThemeToggle />

                                    <div className="relative">
                                        <button
                                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                                            className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary overflow-hidden border-2 border-primary/20">
                                                {session.user?.image ? (
                                                    <img src={session.user.image} alt={session.user.name || 'Profile'} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-sm font-semibold">{session.user?.name?.[0] || 'U'}</span>
                                                )}
                                            </div>
                                        </button>

                                        {/* Dropdown Menu */}
                                        {isMenuOpen && (
                                            <>
                                                {/* Backdrop to close menu when clicking outside */}
                                                <div
                                                    className="fixed inset-0 z-40"
                                                    onClick={() => setIsMenuOpen(false)}
                                                />

                                                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 py-1 animate-in fade-in zoom-in-95 duration-200 z-50">
                                                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary overflow-hidden border-2 border-primary/20">
                                                                {session.user?.image ? (
                                                                    <img src={session.user.image} alt={session.user.name || 'Profile'} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <span className="text-lg font-semibold">{session.user?.name?.[0] || 'U'}</span>
                                                                )}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium truncate">{session.user?.name}</p>
                                                                <p className="text-xs text-muted-foreground truncate">{session.user?.email}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Link
                                                        href="/profile"
                                                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                                        onClick={() => setIsMenuOpen(false)}
                                                    >
                                                        <User size={16} /> Profile
                                                    </Link>
                                                    <Link
                                                        href="/settings"
                                                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                                        onClick={() => setIsMenuOpen(false)}
                                                    >
                                                        <Settings size={16} /> Settings
                                                    </Link>
                                                    <button
                                                        onClick={() => signOut()}
                                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                    >
                                                        <LogOut size={16} /> Logout
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-4">
                                <ThemeToggle />
                                <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-primary">
                                    Login
                                </Link>
                                <Link href="/signup" className="ios-button py-2 px-4 text-sm">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-4">
                        <ThemeToggle />
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black animate-in slide-in-from-top-5">
                    <div className="px-4 py-2 space-y-1">
                        {session ? (
                            <>
                                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 mb-2">
                                    <p className="font-medium">{session.user?.name}</p>
                                    <p className="text-sm text-muted-foreground">{session.user?.email}</p>
                                </div>
                                <Link
                                    href="/"
                                    className={cn("block px-4 py-3 rounded-lg text-sm font-medium transition-colors", isActive('/') ? "bg-primary/10 text-primary" : "hover:bg-gray-50 dark:hover:bg-gray-800")}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/transactions"
                                    className={cn("block px-4 py-3 rounded-lg text-sm font-medium transition-colors", isActive('/transactions') ? "bg-primary/10 text-primary" : "hover:bg-gray-50 dark:hover:bg-gray-800")}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Transactions
                                </Link>
                                <Link
                                    href="/categories"
                                    className={cn("block px-4 py-3 rounded-lg text-sm font-medium transition-colors", isActive('/categories') ? "bg-primary/10 text-primary" : "hover:bg-gray-50 dark:hover:bg-gray-800")}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Categories
                                </Link>
                                <Link
                                    href="/subscriptions"
                                    className={cn("block px-4 py-3 rounded-lg text-sm font-medium transition-colors", isActive('/subscriptions') ? "bg-primary/10 text-primary" : "hover:bg-gray-50 dark:hover:bg-gray-800")}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Subscriptions
                                </Link>
                                <Link
                                    href="/goals"
                                    className={cn("block px-4 py-3 rounded-lg text-sm font-medium transition-colors", isActive('/goals') ? "bg-primary/10 text-primary" : "hover:bg-gray-50 dark:hover:bg-gray-800")}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Goals
                                </Link>
                                <Link
                                    href="/calendar"
                                    className={cn("block px-4 py-3 rounded-lg text-sm font-medium transition-colors", isActive('/calendar') ? "bg-primary/10 text-primary" : "hover:bg-gray-50 dark:hover:bg-gray-800")}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Calendar
                                </Link>
                                <Link
                                    href="/profile"
                                    className="block px-4 py-3 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Profile
                                </Link>
                                <Link
                                    href="/settings"
                                    className="block px-4 py-3 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Settings
                                </Link>
                                <button
                                    onClick={() => signOut()}
                                    className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <div className="p-4 space-y-2">
                                <Link href="/login" className="block w-full text-center py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                    Login
                                </Link>
                                <Link href="/signup" className="block w-full text-center ios-button py-2">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
