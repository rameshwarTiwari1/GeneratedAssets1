import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { IndexCard } from "@/components/IndexCard";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Link, useLocation } from "wouter";
import { LogOut, User, Settings, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
export default function MyIndexesPage() {
    const queryClient = useQueryClient();
    const { user, logout } = useAuth();
    const { toast } = useToast();
    const [, setLocation] = useLocation();
    useEffect(() => {
        if (!user) {
            setLocation("/auth");
        }
    }, [user, setLocation]);
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
    // Fetch all indexes
    const { data: indexes = [], isLoading: indexesLoading } = useQuery({
        queryKey: ["indexes"],
        queryFn: async () => {
            const response = await authService.apiRequest(`${import.meta.env.VITE_API_URL}/indexes`);
            if (!response.ok) {
                throw new Error("Failed to fetch indexes");
            }
            return response.json();
        },
    });
    // Filter indexes
    const myIndexes = indexes.filter((idx) => idx.userId === user?.id);
    const publicIndexes = indexes.filter((idx) => idx.isPublic === true);
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 dark:from-gray-900 dark:via-blue-950/30 dark:to-indigo-950/30", children: [_jsx("header", { className: "glass-card border-b border-gray-200/50 dark:border-gray-800/50 sticky top-0 z-50", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex justify-between items-center h-16", children: [_jsxs("div", { className: "flex items-center space-x-8", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("div", { className: "w-8 h-8 gradient-primary rounded-lg flex items-center justify-center shadow-lg", children: _jsx(BarChart3, { className: "h-4 w-4 text-white" }) }), _jsx("span", { className: "text-xl font-bold text-gradient", children: "Generated Assets" }), _jsx(Badge, { variant: "secondary", className: "text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300", children: "BETA" })] }), _jsxs("nav", { className: "hidden md:flex space-x-6", children: [_jsx(Link, { href: "/dashboard", className: "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 pb-4 transition-colors", children: "Dashboard" }), _jsx(Link, { href: "/indexes", className: "text-gray-900 dark:text-gray-100 font-medium border-b-2 border-blue-600 dark:border-blue-400 pb-4 transition-colors", children: "My Indexes" })] })] }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx(ThemeToggle, {}), _jsx(Button, { variant: "ghost", size: "sm", className: "hover:bg-gray-100 dark:hover:bg-gray-800", children: _jsx(Bell, { className: "h-4 w-4" }) }), _jsxs("div", { className: "relative group", children: [_jsxs(Button, { variant: "ghost", className: "flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-800", children: [_jsx("div", { className: "w-8 h-8 gradient-primary rounded-full flex items-center justify-center overflow-hidden shadow-lg", children: _jsx("span", { className: "text-white text-sm font-medium", children: user ? (user.name ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : user.email.slice(0, 2).toUpperCase()) : "U" }) }), _jsx("span", { className: "text-sm font-medium text-gray-900 dark:text-gray-100", children: user ? (user.name || user.email.split("@")[0]) : "User" })] }), _jsxs("div", { className: "absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-1 group-hover:translate-y-0", children: [_jsxs("div", { className: "px-4 py-2 border-b border-gray-200 dark:border-gray-700", children: [_jsx("p", { className: "text-sm font-medium text-gray-900 dark:text-white", children: user ? (user.name || user.email.split("@")[0]) : "User" }), _jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400 truncate", children: user?.email || "user@example.com" })] }), _jsxs("div", { className: "py-1", children: [_jsxs("div", { onClick: () => setLocation("/profile"), className: "px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center", children: [_jsx(User, { className: "mr-2 h-4 w-4" }), _jsx("span", { children: "Profile" })] }), _jsxs("div", { className: "px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center", children: [_jsx(Settings, { className: "mr-2 h-4 w-4" }), _jsx("span", { children: "Settings" })] }), _jsx("div", { className: "border-t border-gray-200 dark:border-gray-700 my-1" }), _jsxs("div", { onClick: handleLogout, className: "px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center", children: [_jsx(LogOut, { className: "mr-2 h-4 w-4" }), _jsx("span", { children: "Log out" })] })] })] })] })] })] }) }) }), _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsxs(Card, { className: "glass-card hover-lift mb-8", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-xl font-semibold text-gradient", children: "My Indexes" }) }), _jsx(CardContent, { children: indexesLoading ? (_jsx("div", { className: "space-y-4", children: [1, 2, 3].map((i) => (_jsxs("div", { className: "animate-pulse", children: [_jsx("div", { className: "h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2" }), _jsx("div", { className: "h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" })] }, i))) })) : myIndexes.length > 0 ? (_jsx("div", { className: "space-y-0", children: myIndexes.map((index) => (_jsx(IndexCard, { index: {
                                            ...index,
                                            creatorName: user?.name,
                                        }, currentUserId: user?.id, onPublicToggle: () => queryClient.invalidateQueries({
                                            queryKey: ["indexes"],
                                        }) }, index._id))) })) : (_jsxs("div", { className: "text-center py-8 text-gray-500 dark:text-gray-400", children: [_jsx(BarChart3, { className: "h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" }), _jsx("p", { children: "No indexes created yet" }), _jsx("p", { className: "text-sm", children: "Use the dashboard to create your first index" })] })) })] }), _jsxs(Card, { className: "glass-card hover-lift", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-xl font-semibold text-gradient", children: "Public Indexes" }) }), _jsx(CardContent, { children: indexesLoading ? (_jsx("div", { className: "space-y-4", children: [1, 2, 3].map((i) => (_jsxs("div", { className: "animate-pulse", children: [_jsx("div", { className: "h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2" }), _jsx("div", { className: "h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" })] }, i))) })) : publicIndexes.length > 0 ? (_jsx("div", { className: "space-y-0", children: publicIndexes.map((index) => (_jsx(IndexCard, { index: index, currentUserId: user?.id, onPublicToggle: () => queryClient.invalidateQueries({
                                            queryKey: ["indexes"],
                                        }) }, index._id))) })) : (_jsxs("div", { className: "text-center py-8 text-gray-500 dark:text-gray-400", children: [_jsx(BarChart3, { className: "h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" }), _jsx("p", { children: "No public indexes available" })] })) })] })] })] }));
}
