"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowRight, TrendingUp, Shield, Smartphone, Globe, PieChart, Calendar, Target } from "lucide-react";
import Image from "next/image";

export default function LandingPage() {
    const { data: session } = useSession();

    if (session) {
        // Redirect authenticated users to dashboard
        window.location.href = "/";
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-black dark:to-blue-900">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>

                <div className="relative container mx-auto px-4 py-20 md:py-32">
                    <div className="flex flex-col items-center text-center space-y-8 animate-in fade-in slide-in-from-bottom duration-1000">
                        {/* Logo */}
                        <div className="animate-in zoom-in duration-700">
                            <Image
                                src="/logo.png"
                                alt="Budget Planner"
                                width={120}
                                height={120}
                                className="drop-shadow-2xl object-contain"
                                priority
                                quality={100}
                            />
                        </div>

                        {/* Headline */}
                        <div className="space-y-4 max-w-4xl">
                            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-gradient">
                                Master Your Money
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-light">
                                The smart, beautiful way to track expenses, plan budgets, and achieve your financial goals.
                            </p>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link
                                href="/signup"
                                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300 flex items-center gap-2"
                            >
                                Get Started Free
                                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                            </Link>
                            <Link
                                href="/login"
                                className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-gray-200 dark:border-gray-700"
                            >
                                Login
                            </Link>
                        </div>

                        {/* Trust Badge */}
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 pt-4">
                            <Shield size={16} />
                            <span>Bank-level security • Free forever • No credit card required</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 bg-white/50 dark:bg-black/50 backdrop-blur-sm">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom duration-700">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                            Everything You Need
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300">
                            Powerful features designed for modern financial management
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                icon: <TrendingUp className="text-blue-600" size={32} />,
                                title: "Smart Tracking",
                                description: "AI-powered category suggestions and automatic expense tracking"
                            },
                            {
                                icon: <Globe className="text-purple-600" size={32} />,
                                title: "Multi-Currency",
                                description: "Support for 7+ currencies with real-time conversion"
                            },
                            {
                                icon: <PieChart className="text-green-600" size={32} />,
                                title: "Visual Insights",
                                description: "Beautiful charts and graphs to understand your spending"
                            },
                            {
                                icon: <Calendar className="text-orange-600" size={32} />,
                                title: "Cash Flow Calendar",
                                description: "See your financial future with calendar view"
                            },
                            {
                                icon: <Target className="text-red-600" size={32} />,
                                title: "Savings Goals",
                                description: "Set and track progress towards your financial goals"
                            },
                            {
                                icon: <Smartphone className="text-indigo-600" size={32} />,
                                title: "iOS Design",
                                description: "Beautiful, native-feeling interface on all devices"
                            },
                            {
                                icon: <Shield className="text-teal-600" size={32} />,
                                title: "Secure & Private",
                                description: "Your data is encrypted and completely private"
                            },
                            {
                                icon: <ArrowRight className="text-pink-600" size={32} />,
                                title: "CSV Import",
                                description: "Bulk import transactions from your bank statements"
                            }
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="group p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-gray-700 animate-in fade-in slide-in-from-bottom"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        {[
                            { number: "10+", label: "Advanced Features" },
                            { number: "7+", label: "Currencies Supported" },
                            { number: "100%", label: "Free Forever" }
                        ].map((stat, index) => (
                            <div key={index} className="animate-in fade-in zoom-in duration-700" style={{ animationDelay: `${index * 200}ms` }}>
                                <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                                    {stat.number}
                                </div>
                                <div className="text-xl text-gray-600 dark:text-gray-300">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/10 bg-grid"></div>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom duration-700">
                        <h2 className="text-4xl md:text-5xl font-bold text-white">
                            Ready to Take Control?
                        </h2>
                        <p className="text-xl text-blue-100">
                            Join thousands of users who are already managing their finances smarter.
                        </p>
                        <Link
                            href="/signup"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-white/50 hover:scale-105 transition-all duration-300"
                        >
                            Start Your Journey
                            <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-3">
                            <Image
                                src="/icon.png"
                                alt="Budget Planner"
                                width={40}
                                height={40}
                                className="object-contain"
                                quality={100}
                            />
                            <span className="font-semibold text-gray-900 dark:text-white">Budget Planner</span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            © 2024 Budget Planner. All rights reserved.
                        </div>
                        <div className="flex gap-6 text-sm text-gray-600 dark:text-gray-400">
                            <Link href="/login" className="hover:text-blue-600 transition-colors">Login</Link>
                            <Link href="/signup" className="hover:text-blue-600 transition-colors">Sign Up</Link>
                        </div>
                    </div>
                </div>
            </footer>

            <style jsx>{`
                @keyframes gradient {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                .animate-gradient {
                    background-size: 200% auto;
                    animation: gradient 3s ease infinite;
                }
                .bg-grid {
                    background-image: 
                        linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px);
                    background-size: 40px 40px;
                }
            `}</style>
        </div>
    );
}
