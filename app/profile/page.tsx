"use client";

import { useSession } from "next-auth/react";
import { User, Mail, Calendar, Shield, Camera, Upload } from "lucide-react";
import { useState } from "react";

export default function ProfilePage() {
    const { data: session, update } = useSession();
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");

    if (!session) return null;

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setMessage("Please upload an image file");
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setMessage("Image must be less than 5MB");
            return;
        }

        setUploading(true);
        setMessage("");

        try {
            // Convert image to base64
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64String = reader.result as string;

                // Upload to API
                const res = await fetch("/api/user/upload-image", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ image: base64String }),
                });

                if (res.ok) {
                    const data = await res.json();
                    setMessage("Profile picture updated successfully!");
                    // Update session to fetch new image from DB
                    await update();
                    setTimeout(() => setMessage(""), 3000);
                } else {
                    setMessage("Failed to upload image");
                }
            };
            reader.readAsDataURL(file);
        } catch (error) {
            setMessage("An error occurred. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="container mx-auto py-10 px-4 max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight mb-8">Profile</h1>

            <div className="ios-card p-8 text-center mb-8">
                <div className="relative inline-block mb-4">
                    <div className="w-32 h-32 rounded-full bg-primary/10 mx-auto flex items-center justify-center text-primary overflow-hidden border-4 border-primary/20">
                        {session.user?.image ? (
                            <img
                                src={session.user.image}
                                alt={session.user.name || 'Profile'}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-5xl font-bold">{session.user?.name?.[0] || 'U'}</span>
                        )}
                    </div>

                    {/* Upload Button */}
                    <label
                        htmlFor="profile-image-upload"
                        className="absolute bottom-0 right-0 p-3 bg-primary text-white rounded-full cursor-pointer hover:bg-primary/90 transition-colors shadow-lg"
                    >
                        <Camera size={20} />
                        <input
                            id="profile-image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            disabled={uploading}
                        />
                    </label>
                </div>

                <h2 className="text-2xl font-bold">{session.user?.name}</h2>
                <p className="text-muted-foreground">{session.user?.email}</p>

                {message && (
                    <div className={`mt-4 p-3 rounded-xl text-sm animate-in fade-in slide-in-from-bottom-2 ${message.includes("successfully")
                        ? "bg-green-100 dark:bg-green-900/30 text-green-600"
                        : "bg-red-100 dark:bg-red-900/30 text-red-600"
                        }`}>
                        {message}
                    </div>
                )}

                {uploading && (
                    <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <Upload size={16} className="animate-bounce" />
                        Uploading...
                    </div>
                )}

                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                        <strong>Tip:</strong> Click the camera icon to upload a profile picture (max 5MB)
                    </p>
                </div>
            </div>

            <div className="grid gap-6">
                <div className="ios-card p-6">
                    <h3 className="text-lg font-semibold mb-4">Account Details</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600">
                                <User size={20} />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Name</p>
                                <p className="font-medium">{session.user?.name}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600">
                                <Mail size={20} />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Email</p>
                                <p className="font-medium">{session.user?.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-600">
                                <Shield size={20} />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Account Type</p>
                                <p className="font-medium">Personal</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-full text-orange-600">
                                <Calendar size={20} />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Member Since</p>
                                <p className="font-medium">November 2025</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
