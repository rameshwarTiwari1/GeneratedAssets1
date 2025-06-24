import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "../components/ThemeToggle";
import { Link } from "wouter";
import { ArrowLeft, User, Mail, Shield, Bell, BarChart3, Settings, Edit, Save, Camera, Trash2, Download, Upload, LogOut, X, } from "lucide-react";
import AvatarPicker from "@/components/AvatarPicker";
const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [profileLoading, setProfileLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [, setLocation] = useLocation();
    const { toast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        bio: "",
        location: "",
        website: "",
        timezone: "",
        currency: "USD",
    });
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        marketing: false,
        updates: true,
    });
    const [privacy, setPrivacy] = useState({
        profilePublic: true,
        showEmail: false,
        showLocation: false,
        allowAnalytics: true,
    });
    // Profile form state
    const [selectedAvatar, setSelectedAvatar] = useState("");
    const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);
    // Password form state
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    useEffect(() => {
        const checkAuth = async () => {
            const currentUser = authService.getUser();
            if (!currentUser) {
                setLocation("/auth");
                return;
            }
            setUser(currentUser);
            setFormData({
                name: currentUser.name || "",
                email: currentUser.email || "",
                bio: currentUser.bio || "",
                location: currentUser.location || "",
                website: currentUser.website || "",
                timezone: currentUser.timezone || "UTC",
                currency: currentUser.currency || "USD",
            });
            if (currentUser.profilePhoto) {
                setSelectedAvatar(currentUser.profilePhoto);
            }
        };
        checkAuth();
    }, [setLocation]);
    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setProfileLoading(true);
        try {
            const updates = {
                name: formData.name,
            };
            // Only include email if it has changed
            if (formData.email !== user?.email) {
                updates.email = formData.email;
            }
            // Only include profile photo if it has changed
            if (selectedAvatar && selectedAvatar !== user?.profilePhoto) {
                updates.profilePhoto = selectedAvatar;
            }
            // Only make the API call if there are updates
            if (Object.keys(updates).length > 0) {
                const updatedUser = await authService.updateProfile(updates);
                setUser(updatedUser);
            }
            toast({
                title: "Profile Updated",
                description: "Your profile has been updated successfully.",
            });
            setIsEditing(false);
        }
        catch (error) {
            console.error("Profile update error:", error);
            toast({
                title: "Error",
                description: error.message || "Failed to update profile. Please try again.",
                variant: "destructive",
            });
        }
        finally {
            setProfileLoading(false);
        }
    };
    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (!currentPassword) {
            toast({
                title: "Error",
                description: "Please enter your current password",
                variant: "destructive",
            });
            return;
        }
        if (!newPassword || !confirmPassword) {
            toast({
                title: "Error",
                description: "Please fill in all password fields",
                variant: "destructive",
            });
            return;
        }
        if (newPassword !== confirmPassword) {
            toast({
                title: "Error",
                description: "New passwords do not match",
                variant: "destructive",
            });
            return;
        }
        if (newPassword.length < 6) {
            toast({
                title: "Error",
                description: "Password must be at least 6 characters long",
                variant: "destructive",
            });
            return;
        }
        setPasswordLoading(true);
        try {
            await authService.changePassword(currentPassword, newPassword);
            // Clear password fields
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            toast({
                title: "Password Changed",
                description: "Your password has been changed successfully.",
            });
        }
        catch (error) {
            console.error("Password change error:", error);
            toast({
                title: "Error",
                description: error.message ||
                    "Failed to change password. Please check your current password and try again.",
                variant: "destructive",
            });
        }
        finally {
            setPasswordLoading(false);
        }
    };
    const handleAvatarSelect = (avatarUrl) => {
        setSelectedAvatar(avatarUrl);
        // Update the form data with the new avatar URL
        setFormData((prev) => ({
            ...prev,
            profilePhoto: avatarUrl,
        }));
        setIsAvatarPickerOpen(false);
    };
    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        // Check if file is an image
        if (!file.type.startsWith("image/")) {
            toast({
                title: "Invalid file type",
                description: "Please upload an image file",
                variant: "destructive",
            });
            return;
        }
        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast({
                title: "File too large",
                description: "Please upload an image smaller than 5MB",
                variant: "destructive",
            });
            return;
        }
        try {
            setIsUploading(true);
            // In a real app, you would upload the file to your server here
            // For now, we'll just create a local URL for the image
            const imageUrl = URL.createObjectURL(file);
            // Simulate upload delay
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setSelectedAvatar(imageUrl);
            // Update the form data with the new avatar URL
            setFormData((prev) => ({
                ...prev,
                profilePhoto: imageUrl,
            }));
            toast({
                title: "Success",
                description: "Profile image uploaded successfully",
            });
        }
        catch (error) {
            console.error("Error uploading image:", error);
            toast({
                title: "Error",
                description: "Failed to upload image",
                variant: "destructive",
            });
        }
        finally {
            setIsUploading(false);
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };
    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };
    const handleSave = async () => {
        try {
            const updates = {};
            // Only include fields that have changed
            if (formData.name !== user?.name) {
                updates.name = formData.name;
            }
            if (formData.email !== user?.email) {
                updates.email = formData.email;
            }
            if (selectedAvatar && selectedAvatar !== user?.profilePhoto) {
                updates.profilePhoto = selectedAvatar;
            }
            // Only make the API call if there are updates
            if (Object.keys(updates).length > 0) {
                const updatedUser = await authService.updateProfile(updates);
                setUser(updatedUser);
            }
            toast({
                title: "Profile updated successfully",
                description: "Your profile changes have been saved.",
            });
            setIsEditing(false);
        }
        catch (error) {
            console.error("Profile update error:", error);
            toast({
                title: "Failed to update profile",
                description: error.message || "Please try again.",
                variant: "destructive",
            });
        }
    };
    const { logout } = useAuth();
    const handleLogout = async () => {
        try {
            await logout();
            setLocation("/auth");
            toast({
                title: "Logged out successfully",
                description: "You have been logged out of your account.",
            });
        }
        catch (error) {
            toast({
                title: "Logout failed",
                description: "There was an error logging out. Please try again.",
                variant: "destructive",
            });
        }
    };
    const getUserInitials = (user) => {
        if (user.name) {
            return user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2);
        }
        return user.email.slice(0, 2).toUpperCase();
    };
    if (loading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" }), _jsx("p", { className: "mt-2 text-gray-600", children: "Loading..." })] }) }));
    }
    if (!user) {
        return null;
    }
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 dark:from-gray-900 dark:via-blue-950/30 dark:to-indigo-950/30", children: [_jsx("header", { className: "glass-card border-b border-gray-200/50 dark:border-gray-800/50", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex justify-between items-center h-16", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsx(Link, { href: "/dashboard", children: _jsxs(Button, { variant: "ghost", size: "sm", className: "hover:bg-gray-100 dark:hover:bg-gray-800", children: [_jsx(ArrowLeft, { className: "h-4 w-4 mr-2" }), "Back to Dashboard"] }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold text-gradient", children: "Profile Settings" }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Manage your account and preferences" })] })] }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx(ThemeToggle, {}), _jsxs(Button, { variant: "outline", size: "sm", className: "border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800", children: [_jsx(Download, { className: "h-4 w-4 mr-2" }), "Export Data"] })] })] }) }) }), _jsx("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [_jsxs("div", { className: "lg:col-span-2 space-y-6", children: [_jsxs(Card, { className: "glass-card hover-lift", children: [_jsx(CardHeader, { children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsxs(CardTitle, { className: "text-gradient flex items-center space-x-2", children: [_jsx(User, { className: "h-5 w-5" }), _jsx("span", { children: "Profile Information" })] }), _jsx("div", { className: `fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 transition-opacity duration-200 ${isAvatarPickerOpen
                                                            ? "opacity-100"
                                                            : "opacity-0 pointer-events-none"}`, children: _jsx("div", { className: "bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto", children: _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h3", { className: "text-xl font-semibold", children: "Choose an Avatar" }), _jsx(Button, { variant: "ghost", size: "icon", onClick: () => setIsAvatarPickerOpen(false), children: _jsx(X, { className: "h-5 w-5" }) })] }), _jsx(AvatarPicker, { selectedAvatar: selectedAvatar, onSelect: handleAvatarSelect })] }) }) }), _jsxs(Button, { variant: "outline", size: "sm", onClick: () => setIsEditing(!isEditing), className: "border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800", children: [isEditing ? (_jsx(Save, { className: "h-4 w-4 mr-2" })) : (_jsx(Edit, { className: "h-4 w-4 mr-2" })), isEditing ? "Save" : "Edit"] })] }) }), _jsxs(CardContent, { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center space-x-6", children: [_jsxs("div", { className: "relative group", children: [_jsxs("div", { className: "relative", children: [_jsxs(Avatar, { className: "h-24 w-24 border-2 border-white shadow-md", children: [_jsx(AvatarImage, { src: selectedAvatar || user?.profilePhoto, alt: user?.name }), _jsx(AvatarFallback, { className: "text-xl font-semibold", children: user?.name?.charAt(0) ||
                                                                                        user?.email?.charAt(0) ||
                                                                                        "U" })] }), _jsx("div", { className: "absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-full transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100", children: _jsxs("div", { className: "flex flex-col items-center space-y-1", children: [_jsx(Button, { variant: "outline", size: "icon", className: "rounded-full w-9 h-9 bg-white/90 hover:bg-white", onClick: handleUploadClick, disabled: isUploading, children: isUploading ? (_jsx("div", { className: "animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600" })) : (_jsx(Upload, { className: "h-4 w-4" })) }), _jsx(Button, { variant: "outline", size: "icon", className: "rounded-full w-9 h-9 bg-white/90 hover:bg-white", onClick: (e) => {
                                                                                            e.stopPropagation();
                                                                                            setIsAvatarPickerOpen(true);
                                                                                        }, children: _jsx(Camera, { className: "h-4 w-4" }) })] }) })] }), _jsx("input", { type: "file", ref: fileInputRef, onChange: handleFileChange, accept: "image/*", className: "hidden" })] }), _jsx("div", { className: "flex-1", children: _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "name", className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Full Name" }), isEditing ? (_jsx(Input, { id: "name", value: formData.name, onChange: (e) => setFormData({ ...formData, name: e.target.value }), className: "mt-1 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700" })) : (_jsx("p", { className: "text-lg font-semibold text-gray-900 dark:text-gray-100", children: formData.name || "Not provided" }))] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "email", className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Email Address" }), _jsxs("p", { className: "text-gray-600 dark:text-gray-400 flex items-center", children: [_jsx(Mail, { className: "h-4 w-4 mr-2" }), formData.email] })] })] }) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "bio", className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Bio" }), isEditing ? (_jsx(Input, { id: "bio", value: formData.bio, onChange: (e) => setFormData({ ...formData, bio: e.target.value }), placeholder: "Tell us about yourself...", className: "mt-1 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700" })) : (_jsx("p", { className: "text-gray-600 dark:text-gray-400 mt-1", children: formData.bio || "No bio provided" }))] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "location", className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Location" }), isEditing ? (_jsx(Input, { id: "location", value: formData.location, onChange: (e) => setFormData({ ...formData, location: e.target.value }), placeholder: "City, Country", className: "mt-1 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700" })) : (_jsx("p", { className: "text-gray-600 dark:text-gray-400 mt-1", children: formData.location || "Not specified" }))] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "website", className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Website" }), isEditing ? (_jsx(Input, { id: "website", value: formData.website, onChange: (e) => setFormData({ ...formData, website: e.target.value }), placeholder: "https://yourwebsite.com", className: "mt-1 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700" })) : (_jsx("p", { className: "text-gray-600 dark:text-gray-400 mt-1", children: formData.website || "Not provided" }))] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "timezone", className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Timezone" }), isEditing ? (_jsxs(Select, { value: formData.timezone, onValueChange: (value) => setFormData({ ...formData, timezone: value }), children: [_jsx(SelectTrigger, { className: "mt-1 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700", children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "UTC", children: "UTC" }), _jsx(SelectItem, { value: "EST", children: "Eastern Time" }), _jsx(SelectItem, { value: "PST", children: "Pacific Time" }), _jsx(SelectItem, { value: "GMT", children: "GMT" })] })] })) : (_jsx("p", { className: "text-gray-600 dark:text-gray-400 mt-1", children: formData.timezone }))] })] }), isEditing && (_jsxs("div", { className: "flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700", children: [_jsx(Button, { variant: "outline", onClick: () => setIsEditing(false), className: "border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800", children: "Cancel" }), _jsxs(Button, { onClick: handleSave, className: "gradient-primary", children: [_jsx(Save, { className: "h-4 w-4 mr-2" }), "Save Changes"] })] }))] })] }), _jsxs(Card, { className: "glass-card hover-lift", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "text-gradient flex items-center space-x-2", children: [_jsx(BarChart3, { className: "h-5 w-5" }), _jsx("span", { children: "Account Statistics" })] }) }), _jsx(CardContent, { children: _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [_jsxs("div", { className: "text-center p-4 bg-blue-50 dark:bg-blue-950/50 rounded-lg", children: [_jsx("div", { className: "text-2xl font-bold text-blue-600 dark:text-blue-400", children: "12" }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Indexes Created" })] }), _jsxs("div", { className: "text-center p-4 bg-green-50 dark:bg-green-950/50 rounded-lg", children: [_jsx("div", { className: "text-2xl font-bold text-green-600 dark:text-green-400", children: "$45.2K" }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Portfolio Value" })] }), _jsxs("div", { className: "text-center p-4 bg-purple-50 dark:bg-purple-950/50 rounded-lg", children: [_jsx("div", { className: "text-2xl font-bold text-purple-600 dark:text-purple-400", children: "156" }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Stocks Tracked" })] }), _jsxs("div", { className: "text-center p-4 bg-orange-50 dark:bg-orange-950/50 rounded-lg", children: [_jsx("div", { className: "text-2xl font-bold text-orange-600 dark:text-orange-400", children: "89%" }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Success Rate" })] })] }) })] })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs(Card, { className: "glass-card hover-lift", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "text-gradient flex items-center space-x-2", children: [_jsx(Bell, { className: "h-5 w-5" }), _jsx("span", { children: "Notifications" })] }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium text-gray-900 dark:text-gray-100", children: "Email Notifications" }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Receive updates via email" })] }), _jsx(Switch, { checked: notifications.email, onCheckedChange: (checked) => setNotifications({ ...notifications, email: checked }) })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium text-gray-900 dark:text-gray-100", children: "Push Notifications" }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Get real-time alerts" })] }), _jsx(Switch, { checked: notifications.push, onCheckedChange: (checked) => setNotifications({ ...notifications, push: checked }) })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium text-gray-900 dark:text-gray-100", children: "Marketing Emails" }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Receive promotional content" })] }), _jsx(Switch, { checked: notifications.marketing, onCheckedChange: (checked) => setNotifications({ ...notifications, marketing: checked }) })] })] })] }), _jsxs(Card, { className: "glass-card hover-lift", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "text-gradient flex items-center space-x-2", children: [_jsx(Shield, { className: "h-5 w-5" }), _jsx("span", { children: "Privacy" })] }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium text-gray-900 dark:text-gray-100", children: "Public Profile" }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Allow others to see your profile" })] }), _jsx(Switch, { checked: privacy.profilePublic, onCheckedChange: (checked) => setPrivacy({ ...privacy, profilePublic: checked }) })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium text-gray-900 dark:text-gray-100", children: "Show Email" }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Display email on public profile" })] }), _jsx(Switch, { checked: privacy.showEmail, onCheckedChange: (checked) => setPrivacy({ ...privacy, showEmail: checked }) })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium text-gray-900 dark:text-gray-100", children: "Analytics" }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Help improve our service" })] }), _jsx(Switch, { checked: privacy.allowAnalytics, onCheckedChange: (checked) => setPrivacy({ ...privacy, allowAnalytics: checked }) })] })] })] }), _jsxs(Card, { className: "glass-card hover-lift", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "text-gradient flex items-center space-x-2", children: [_jsx(Settings, { className: "h-5 w-5" }), _jsx("span", { children: "Account Actions" })] }) }), _jsxs(CardContent, { className: "space-y-3", children: [_jsxs(Button, { variant: "outline", className: "w-full justify-start border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800", children: [_jsx(Download, { className: "h-4 w-4 mr-2" }), "Export Data"] }), _jsxs(Button, { variant: "outline", className: "w-full justify-start border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800", children: [_jsx(Upload, { className: "h-4 w-4 mr-2" }), "Import Data"] }), _jsxs(Button, { variant: "outline", className: "w-full justify-start border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950/50 text-red-600 dark:text-red-400", children: [_jsx(Trash2, { className: "h-4 w-4 mr-2" }), "Delete Account"] }), _jsxs(Button, { variant: "outline", onClick: handleLogout, className: "w-full justify-start border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800", children: [_jsx(LogOut, { className: "h-4 w-4 mr-2" }), "Log Out"] })] })] })] })] }) })] }));
};
export default ProfilePage;
