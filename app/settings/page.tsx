"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Save, Globe, Lock, Eye, EyeOff } from "lucide-react";
import { COUNTRIES, CURRENCIES, getCurrencyForCountry, getCurrencyDetails } from "@/lib/countries";

export default function SettingsPage() {
    const { data: session, update } = useSession();
    const [country, setCountry] = useState("");
    const [currency, setCurrency] = useState(session?.user?.currency || "USD");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // Password change state
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordMessage, setPasswordMessage] = useState("");
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Handle country change - automatically update currency
    const handleCountryChange = (selectedCountry: string) => {
        setCountry(selectedCountry);
        const countryCurrency = getCurrencyForCountry(selectedCountry);
        setCurrency(countryCurrency);
    };

    async function handleSave() {
        setLoading(true);
        setMessage("");
        try {
            const res = await fetch("/api/user/settings", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currency, country }),
            });

            if (res.ok) {
                setMessage("Settings saved successfully!");
                await update({ currency }); // Update session with new settings
                setTimeout(() => setMessage(""), 3000);
            } else {
                setMessage("Failed to save settings");
            }
        } catch (error) {
            setMessage("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    async function handlePasswordChange(e: React.FormEvent) {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setPasswordMessage("Passwords do not match");
            return;
        }

        if (newPassword.length < 6) {
            setPasswordMessage("Password must be at least 6 characters");
            return;
        }

        setPasswordLoading(true);
        setPasswordMessage("");

        try {
            const res = await fetch("/api/user/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            const data = await res.json();

            if (res.ok) {
                setPasswordMessage("Password changed successfully!");
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
                setTimeout(() => setPasswordMessage(""), 3000);
            } else {
                setPasswordMessage(data.error || "Failed to change password");
            }
        } catch (error) {
            setPasswordMessage("An error occurred. Please try again.");
        } finally {
            setPasswordLoading(false);
        }
    }

    return (
        <div className="container mx-auto py-10 px-4 max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight mb-8">Settings</h1>

            <div className="space-y-6">
                {/* Currency & Region Settings */}
                <div className="ios-card p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600">
                            <Globe size={20} />
                        </div>
                        Currency & Region
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-muted-foreground">
                                Select Your Country
                            </label>
                            <select
                                value={country}
                                onChange={(e) => handleCountryChange(e.target.value)}
                                className="ios-input w-full appearance-none"
                            >
                                <option value="">Choose a country...</option>
                                {COUNTRIES.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-muted-foreground mt-1">
                                Currency will be automatically selected based on your country
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-muted-foreground">
                                Currency {country && `(Auto-selected for ${country})`}
                            </label>
                            <select
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                                className="ios-input w-full appearance-none"
                            >
                                {CURRENCIES.map((c) => (
                                    <option key={c.code} value={c.code}>
                                        {c.symbol} - {c.name} ({c.code})
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-muted-foreground mt-1">
                                You can manually change the currency if needed
                            </p>
                        </div>

                        {country && (
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <p className="text-sm text-blue-600 dark:text-blue-400">
                                    <strong>{country}</strong> uses <strong>{getCurrencyDetails(currency).name} ({getCurrencyDetails(currency).symbol})</strong>
                                </p>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="ios-button w-full flex items-center justify-center gap-2 mt-4"
                    >
                        {loading ? "Saving..." : <><Save size={18} /> Save Settings</>}
                    </button>

                    {message && (
                        <div className={`p-4 rounded-xl text-center animate-in fade-in slide-in-from-bottom-2 mt-4 ${message.includes("successfully")
                                ? "bg-green-100 dark:bg-green-900/30 text-green-600"
                                : "bg-red-100 dark:bg-red-900/30 text-red-600"
                            }`}>
                            {message}
                        </div>
                    )}
                </div>

                {/* Password Change */}
                <div className="ios-card p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full text-red-600">
                            <Lock size={20} />
                        </div>
                        Change Password
                    </h2>

                    <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-muted-foreground">Current Password</label>
                            <div className="relative">
                                <input
                                    type={showCurrentPassword ? "text" : "password"}
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="ios-input w-full pr-10"
                                    placeholder="Enter current password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-muted-foreground">New Password</label>
                            <div className="relative">
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="ios-input w-full pr-10"
                                    placeholder="Enter new password (min. 6 characters)"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-muted-foreground">Confirm New Password</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="ios-input w-full pr-10"
                                    placeholder="Confirm new password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {passwordMessage && (
                            <div className={`p-4 rounded-xl text-center animate-in fade-in slide-in-from-bottom-2 ${passwordMessage.includes("successfully")
                                    ? "bg-green-100 dark:bg-green-900/30 text-green-600"
                                    : "bg-red-100 dark:bg-red-900/30 text-red-600"
                                }`}>
                                {passwordMessage}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={passwordLoading}
                            className="ios-button w-full flex items-center justify-center gap-2"
                        >
                            {passwordLoading ? "Changing..." : <><Lock size={18} /> Change Password</>}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
