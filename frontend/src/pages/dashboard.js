import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HeroSection } from "@/components/HeroSection";
import { IndexCard } from "@/components/IndexCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CreateIndexModal } from "@/components/CreateIndexModal";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Search, X, Plus, LogOut, User, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { debounce } from "@/utils/debounce";
import { useToast } from "@/hooks/use-toast";
import { Bell, BarChart3, Users, Lightbulb, Rocket, Leaf, Gamepad2, } from "lucide-react";
import { Link, useLocation } from "wouter";
import { authService } from "@/lib/auth";
import { useAuth } from "@/hooks/useAuth";
import { usePrompt } from "@/hooks/PromptContext";
export default function Dashboard() {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const [, setLocation] = useLocation();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSearchDropdown, setShowSearchDropdown] = useState(false);
    const [customStocks, setCustomStocks] = useState([]);
    const { user, logout } = useAuth();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const { prompt, setPrompt } = usePrompt();
    // Ref for the search container to handle outside clicks
    const searchContainerRef = useRef(null);
    // Mock values since WebSocket is disabled
    const lastMessage = null;
    const isConnected = false;
    // Redirect to auth if not authenticated
    useEffect(() => {
        if (!user) {
            setLocation("/auth");
        }
    }, [user, setLocation]);
    // Handle prompt from homepage
    useEffect(() => {
        if (user && prompt) {
            setIsCreateModalOpen(true);
        }
    }, [user, prompt]);
    // Handle logout
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
    // Get user initials for avatar
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
    // Get display name
    const getDisplayName = (user) => {
        return user.name || user.email.split("@")[0];
    };
    // Fetch recent indexes
    const { data: indexes = [], isLoading: indexesLoading } = useQuery({
        queryKey: ["indexes"],
        queryFn: async () => {
            const response = await authService.apiRequest("http://localhost:5000/api/indexes");
            if (!response.ok) {
                throw new Error("Failed to fetch indexes");
            }
            return response.json();
        },
    });
    // Fetch trending indexes
    const { data: trendingIndexes = [], isLoading: trendingLoading } = useQuery({
        queryKey: ["trending-indexes"],
        queryFn: async () => {
            const response = await fetch("http://localhost:5000/api/trending-indexes");
            if (!response.ok) {
                throw new Error("Failed to fetch trending indexes");
            }
            return response.json();
        },
    });
    // Fetch portfolio summary
    const { data: portfolio } = useQuery({
        queryKey: ["portfolio"],
        queryFn: async () => {
            const response = await authService.apiRequest("http://localhost:5000/api/portfolio");
            if (!response.ok) {
                throw new Error("Failed to fetch portfolio");
            }
            return response.json();
        },
    });
    // Fetch market data for major indices
    const { data: marketData } = useQuery({
        queryKey: ["market-data"],
        queryFn: async () => {
            const response = await fetch("http://localhost:5000/api/market-data");
            if (!response.ok) {
                throw new Error("Failed to fetch market data");
            }
            return response.json();
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    });
    const formatCurrency = (value) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };
    // Helper function to get badge colors based on tag
    const getBadgeColor = (tag) => {
        const colors = {
            Trending: "bg-green-100 text-green-700",
            Hot: "bg-red-100 text-red-700",
            Rising: "bg-blue-100 text-blue-700",
            New: "bg-orange-100 text-orange-700",
        };
        return colors[tag] || "bg-gray-100 text-gray-700";
    };
    // Map the trending indexes to match the expected format
    const trendingData = trendingIndexes
        .filter((index) => index.isPublic === true) // Additional safety filter
        .map((index) => ({
        id: index._id,
        name: index.name,
        stocks: index.stocks?.length || 0,
        performance: index.performance7d || 0,
        createdAt: index.createdAt,
        isPositive: (index.performance7d || 0) >= 0,
        badge: index.tags?.[0] || "Trending",
        badgeColor: getBadgeColor(index.tags?.[0] || "Trending"),
        creator: index.creator || "@Investor",
    }));
    console.log("trendingData", trendingData);
    // Search function - only called by debounced function
    const searchStocks = useCallback(async (query) => {
        if (!query.trim()) {
            setSearchResults([]);
            setShowSearchDropdown(false);
            return;
        }
        setIsSearching(true);
        try {
            const response = await fetch(`http://localhost:5000/api/search?query=${encodeURIComponent(query)}`);
            if (response.ok) {
                const data = await response.json();
                setSearchResults(data.results || []);
                setShowSearchDropdown(true);
            }
            else {
                console.error("Search failed:", response.statusText);
                setSearchResults([]);
                setShowSearchDropdown(false);
            }
        }
        catch (error) {
            console.error("Search error:", error);
            setSearchResults([]);
            setShowSearchDropdown(false);
        }
        finally {
            setIsSearching(false);
        }
    }, []);
    // Create a debounced version of the search function
    const debouncedSearch = useMemo(() => debounce(searchStocks, 800), // 800ms delay to reduce API calls
    [searchStocks]);
    // Handle search input change
    const handleSearchChange = useCallback((value) => {
        setSearchQuery(value);
        if (value.trim()) {
            debouncedSearch(value);
        }
        else {
            setSearchResults([]);
            setShowSearchDropdown(false);
            // Cancel any pending debounced calls
            if (debouncedSearch.cancel) {
                debouncedSearch.cancel();
            }
        }
    }, [debouncedSearch]);
    // Function to handle adding stocks
    const addCustomStock = async (stock) => {
        try {
            // Check if stock already exists
            if (customStocks.some((s) => s.symbol === stock.symbol)) {
                toast({
                    title: "Stock already added",
                    description: `${stock.symbol} is already in your watchlist`,
                    variant: "default",
                });
                setSearchQuery("");
                setShowSearchDropdown(false);
                setSearchResults([]);
                return;
            }
            const response = await fetch(`http://localhost:5000/api/stock-price/${stock.symbol}`);
            const priceData = await response.json();
            const newStock = {
                symbol: stock.symbol,
                name: stock.name,
                value: priceData.success ? priceData.current_price : 0,
                change: priceData.success ? priceData.change : 0,
                changePercent: priceData.success ? priceData.change_percent : 0,
            };
            setCustomStocks((prev) => [...prev, newStock]);
            toast({
                title: "Stock added",
                description: `${stock.symbol} has been added to your watchlist`,
                variant: "default",
            });
        }
        catch (error) {
            console.error("Error fetching stock price:", error);
            // Add stock without price data
            const newStock = {
                symbol: stock.symbol,
                name: stock.name,
                value: 0,
                change: 0,
                changePercent: 0,
            };
            setCustomStocks((prev) => [...prev, newStock]);
            toast({
                title: "Stock added (no price data)",
                description: `${stock.symbol} has been added but price data is unavailable`,
                variant: "default",
            });
        }
        // Clear search state
        setSearchQuery("");
        setShowSearchDropdown(false);
        setSearchResults([]);
    };
    // Function to remove custom stocks
    const removeCustomStock = (symbol) => {
        setCustomStocks((prev) => prev.filter((stock) => stock.symbol !== symbol));
        toast({
            title: "Stock removed",
            description: `${symbol} has been removed from your watchlist`,
            variant: "default",
        });
    };
    // Handle navigation to index detail
    const handleIndexClick = (indexId) => {
        setLocation(`/index/${indexId}`);
    };
    // Handle outside clicks to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchContainerRef.current &&
                !searchContainerRef.current.contains(event.target)) {
                setShowSearchDropdown(false);
            }
        };
        if (showSearchDropdown) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showSearchDropdown]);
    // Cleanup debounce on component unmount
    useEffect(() => {
        return () => {
            if (debouncedSearch.cancel) {
                debouncedSearch.cancel();
            }
        };
    }, [debouncedSearch]);
    const handleModalClose = () => {
        setIsCreateModalOpen(false);
        setPrompt(null); // Clear the prompt after use
    };
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 dark:from-gray-900 dark:via-blue-950/30 dark:to-indigo-950/30", children: [_jsx("header", { className: "glass-card border-b border-gray-200/50 dark:border-gray-800/50 sticky top-0 z-50", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex justify-between items-center h-16", children: [_jsxs("div", { className: "flex items-center space-x-8", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("div", { className: "w-8 h-8 gradient-primary rounded-lg flex items-center justify-center shadow-lg", children: _jsx(BarChart3, { className: "h-4 w-4 text-white" }) }), _jsx("span", { className: "text-xl font-bold text-gradient", children: "Generated Assets" }), _jsx(Badge, { variant: "secondary", className: "text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300", children: "BETA" })] }), _jsxs("nav", { className: "hidden md:flex space-x-6", children: [_jsx(Link, { href: "/dashboard", className: "text-gray-900 dark:text-gray-100 font-medium border-b-2 border-blue-600 dark:border-blue-400 pb-4 transition-colors", children: "Dashboard" }), _jsx(Link, { href: "/indexes", className: "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 pb-4 transition-colors", children: "My Indexes" })] })] }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx(ThemeToggle, {}), _jsx(Button, { variant: "ghost", size: "sm", className: "hover:bg-gray-100 dark:hover:bg-gray-800", children: _jsx(Bell, { className: "h-4 w-4" }) }), _jsxs("div", { className: "relative group", children: [_jsxs(Button, { variant: "ghost", className: "flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-800", children: [_jsx("div", { className: "w-8 h-8 gradient-primary rounded-full flex items-center justify-center overflow-hidden shadow-lg", children: user?.profilePhoto ? (_jsx("img", { src: user.profilePhoto, alt: "Profile", className: "w-full h-full object-cover" })) : (_jsx("span", { className: "text-white text-sm font-medium", children: user ? getUserInitials(user) : "U" })) }), _jsx("span", { className: "text-sm font-medium text-gray-900 dark:text-gray-100", children: user ? getDisplayName(user) : "User" })] }), _jsxs("div", { className: "absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-1 group-hover:translate-y-0", children: [_jsxs("div", { className: "px-4 py-2 border-b border-gray-200 dark:border-gray-700", children: [_jsx("p", { className: "text-sm font-medium text-gray-900 dark:text-white", children: user ? getDisplayName(user) : "User" }), _jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400 truncate", children: user?.email || "user@example.com" })] }), _jsxs("div", { className: "py-1", children: [_jsxs("div", { onClick: () => setLocation("/profile"), className: "px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center", children: [_jsx(User, { className: "mr-2 h-4 w-4" }), _jsx("span", { children: "Profile" })] }), _jsxs("div", { className: "px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center", children: [_jsx(Settings, { className: "mr-2 h-4 w-4" }), _jsx("span", { children: "Settings" })] }), _jsx("div", { className: "border-t border-gray-200 dark:border-gray-700 my-1" }), _jsxs("div", { onClick: handleLogout, className: "px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center", children: [_jsx(LogOut, { className: "mr-2 h-4 w-4" }), _jsx("span", { children: "Log out" })] })] })] })] })] })] }) }) }), _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsx(HeroSection, { onCreateIndex: () => setIsCreateModalOpen(true) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8", children: [_jsx("div", { className: "lg:col-span-2", children: _jsxs(Card, { className: "glass-card hover-lift", children: [_jsx(CardHeader, { children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsx(CardTitle, { className: "text-xl font-semibold text-gradient", children: "Recent Indexes" }), _jsx(Button, { variant: "ghost", size: "sm", className: "text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300", children: "View All" })] }) }), _jsx(CardContent, { children: indexesLoading ? (_jsx("div", { className: "space-y-4", children: [1, 2, 3].map((i) => (_jsxs("div", { className: "animate-pulse", children: [_jsx("div", { className: "h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2" }), _jsx("div", { className: "h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" })] }, i))) })) : indexes.length > 0 ? (_jsx("div", { className: "space-y-0", children: indexes.slice(0, 5).map((index) => (_jsx(IndexCard, { index: {
                                                        ...index,
                                                        creatorName: index.userId === user?.id ? user?.name : undefined,
                                                    }, currentUserId: user?.id, onPublicToggle: () => queryClient.invalidateQueries({
                                                        queryKey: ["indexes"],
                                                    }), onClick: () => handleIndexClick(index._id) }, index._id))) })) : (_jsxs("div", { className: "text-center py-8 text-gray-500 dark:text-gray-400", children: [_jsx(BarChart3, { className: "h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" }), _jsx("p", { children: "No indexes created yet" }), _jsx("p", { className: "text-sm", children: "Use the form above to create your first index" })] })) })] }) }), _jsxs("div", { className: "space-y-6", children: [_jsxs(Card, { className: "glass-card hover-lift", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-lg font-semibold text-gradient", children: "Portfolio Summary" }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex justify-between items-center mb-1", children: [_jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Total Value" }), _jsx("span", { className: "text-2xl font-bold text-gray-900 dark:text-gray-100", children: formatCurrency(portfolio?.totalValue || 0) })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Today's Change" }), _jsxs("span", { className: "text-lg font-semibold performance-positive", children: ["+", formatCurrency(portfolio?.totalChange1d || 0), " (+", (portfolio?.totalChangePercent1d || 0).toFixed(1), "%)"] })] })] }), _jsxs("div", { className: "border-t border-gray-100 dark:border-gray-800 pt-4 space-y-2", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Active Indexes" }), _jsx("span", { className: "font-semibold text-gray-900 dark:text-gray-100", children: portfolio?.activeIndexes || 0 })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Total Stocks" }), _jsx("span", { className: "font-semibold text-gray-900 dark:text-gray-100", children: portfolio?.totalStocks || 0 })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Avg. Performance" }), _jsxs("span", { className: "font-semibold performance-positive", children: ["+", (portfolio?.avgPerformance || 0).toFixed(1), "%"] })] })] })] })] }), _jsxs(Card, { className: "glass-card hover-lift", children: [_jsx(CardHeader, { children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsx(CardTitle, { className: "text-lg font-semibold text-gradient", children: "Market Overview" }), _jsxs("div", { className: "relative", ref: searchContainerRef, children: [_jsxs("div", { className: "flex items-center space-x-1", children: [_jsx(Search, { className: "h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 z-10" }), _jsx(Input, { placeholder: "Search stocks...", value: searchQuery, onChange: (e) => handleSearchChange(e.target.value), className: "pl-9 h-8 text-sm w-32 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700" })] }), showSearchDropdown && (_jsx("div", { className: "absolute top-full left-0 right-0 mt-1 glass-card border border-gray-200 dark:border-gray-700 shadow-lg z-20 max-h-48 overflow-y-auto", children: isSearching ? (_jsx("div", { className: "p-3 text-center text-sm text-gray-500 dark:text-gray-400", children: "Searching..." })) : searchResults.length > 0 ? (searchResults.slice(0, 5).map((stock) => (_jsxs("button", { onClick: () => addCustomStock(stock), className: "w-full px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-between transition-colors", children: [_jsxs("div", { children: [_jsx("div", { className: "font-medium text-sm text-gray-900 dark:text-gray-100", children: stock.symbol }), _jsx("div", { className: "text-xs text-gray-500 dark:text-gray-400 truncate", children: stock.name })] }), _jsx(Plus, { className: "h-4 w-4 text-gray-400" })] }, stock.symbol)))) : (_jsx("div", { className: "p-3 text-center text-sm text-gray-500 dark:text-gray-400", children: "No results found" })) }))] })] }) }), _jsxs(CardContent, { className: "space-y-3", children: [customStocks.map((stock) => (_jsxs("div", { className: "flex justify-between items-center group", children: [_jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: stock.symbol }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsxs("div", { className: "text-right", children: [_jsxs("div", { className: "font-semibold text-gray-900 dark:text-gray-100", children: ["$", stock.value.toFixed(2)] }), _jsxs("div", { className: `text-sm ${stock.changePercent >= 0
                                                                                    ? "performance-positive"
                                                                                    : "performance-negative"}`, children: [stock.changePercent >= 0 ? "+" : "", stock.change?.toFixed(2), " (", stock.changePercent >= 0 ? "+" : "", stock.changePercent?.toFixed(2), "%)"] })] }), _jsx("button", { onClick: () => removeCustomStock(stock.symbol), className: "opacity-0 group-hover:opacity-100 transition-opacity", children: _jsx(X, { className: "h-4 w-4 text-gray-400 hover:text-red-500" }) })] })] }, stock.symbol))), marketData ? (_jsx(_Fragment, { children: [
                                                            { key: "sp500", name: "S&P 500" },
                                                            { key: "nasdaq", name: "NASDAQ" },
                                                            { key: "dow", name: "DOW" },
                                                            {
                                                                key: "vix",
                                                                name: "Volatility (VIX)",
                                                            },
                                                        ].map(({ key, name }) => {
                                                            const data = marketData[key];
                                                            if (!data)
                                                                return null;
                                                            const isPositive = (data.changePercent || 0) >= 0;
                                                            const changeSign = isPositive ? "+" : "";
                                                            return (_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: name }), _jsxs("div", { className: "text-right", children: [_jsx("div", { className: "font-semibold text-gray-900 dark:text-gray-100", children: parseFloat(data.value).toLocaleString(undefined, {
                                                                                    minimumFractionDigits: 2,
                                                                                    maximumFractionDigits: 2,
                                                                                }) }), _jsxs("div", { className: `text-sm ${isPositive
                                                                                    ? "performance-positive"
                                                                                    : "performance-negative"}`, children: [changeSign, data.change?.toFixed(2), " (", changeSign, data.changePercent?.toFixed(2), "%)"] })] })] }, key));
                                                        }) })) : (
                                                    // Loading skeleton
                                                    _jsx("div", { className: "space-y-4", children: [1, 2, 3, 4].map((i) => (_jsxs("div", { className: "animate-pulse", children: [_jsx("div", { className: "h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-1" }), _jsx("div", { className: "h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" })] }, i))) }))] })] }), _jsx(Card, { className: "gradient-card hover-lift", children: _jsxs(CardContent, { className: "p-6", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-3", children: [_jsx(Lightbulb, { className: "h-5 w-5 text-blue-600 dark:text-blue-400" }), _jsx("h3", { className: "text-lg font-semibold text-blue-900 dark:text-blue-100", children: "AI Suggestions" })] }), _jsx("p", { className: "text-sm text-blue-800 dark:text-blue-200 mb-4", children: "Based on market trends and your portfolio:" }), _jsxs("div", { className: "space-y-2", children: [_jsx(Button, { variant: "outline", className: "w-full justify-start text-left p-3 bg-white/80 dark:bg-gray-900/80 hover:bg-blue-50 dark:hover:bg-blue-950/50 border-blue-200 dark:border-blue-800 text-sm", children: "\"Cybersecurity leaders\" - High growth potential" }), _jsx(Button, { variant: "outline", className: "w-full justify-start text-left p-3 bg-white/80 dark:bg-gray-900/80 hover:bg-blue-50 dark:hover:bg-blue-950/50 border-blue-200 dark:border-blue-800 text-sm", children: "\"ESG dividend stocks\" - Sustainable income" })] })] }) })] })] }), _jsxs(Card, { className: "glass-card hover-lift mb-8", children: [_jsx(CardHeader, { children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsx(CardTitle, { className: "text-xl font-semibold text-gradient", children: "Trending Indexes" }), _jsxs("div", { className: "flex space-x-2", children: [_jsx(Button, { variant: "default", size: "sm", className: "gradient-primary", children: "This Week" }), _jsx(Button, { variant: "outline", size: "sm", className: "border-gray-200 dark:border-gray-700", children: "This Month" })] })] }) }), _jsx(CardContent, { children: trendingLoading ? (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [1, 2, 3, 4].map((i) => (_jsxs("div", { className: "animate-pulse border border-gray-200 dark:border-gray-700 rounded-lg p-4", children: [_jsx("div", { className: "h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-2" }), _jsx("div", { className: "h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" })] }, i))) })) : (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: trendingData.map((trend) => (_jsx(Card, { className: "glass-card hover-lift cursor-pointer", onClick: () => handleIndexClick(trend.id), children: _jsxs(CardContent, { className: "p-4", children: [_jsxs("div", { className: "flex justify-between items-start mb-3", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("div", { className: "w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center", children: trend.name.includes("Space") ? (_jsx(Rocket, { className: "h-4 w-4 text-blue-600 dark:text-blue-400" })) : trend.name.includes("Energy") ? (_jsx(Leaf, { className: "h-4 w-4 text-green-600 dark:text-green-400" })) : trend.name.includes("Gaming") ? (_jsx(Gamepad2, { className: "h-4 w-4 text-purple-600 dark:text-purple-400" })) : (_jsx(BarChart3, { className: "h-4 w-4 text-blue-600 dark:text-blue-400" })) }), _jsx(Badge, { className: trend.badgeColor, children: trend.badge })] }), _jsx(Button, { variant: "ghost", size: "sm", className: "p-1", children: _jsx(Users, { className: "h-4 w-4" }) })] }), _jsx("h3", { className: "font-semibold text-gray-900 dark:text-gray-100 mb-1", children: trend.name }), _jsxs("p", { className: "text-sm text-gray-600 dark:text-gray-400 mb-3", children: [trend.stocks, " stocks \u2022 Created by ", trend.creator] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("span", { className: `text-lg font-semibold ${trend.isPositive
                                                                ? "performance-positive"
                                                                : "performance-negative"}`, children: [trend.isPositive ? "+" : "", trend.performance.toFixed(1), "%"] }), _jsx("span", { className: "text-sm text-gray-500 dark:text-gray-400", children: "7 days" })] })] }) }, trend.id))) })) })] })] }), _jsx(CreateIndexModal, { isOpen: isCreateModalOpen, onClose: handleModalClose, initialPrompt: prompt }), _jsx("footer", { className: "glass-card border-t border-gray-200/50 dark:border-gray-800/50 mt-12", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-8", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center space-x-2 mb-4", children: [_jsx("div", { className: "w-6 h-6 gradient-primary rounded-lg flex items-center justify-center", children: _jsx(BarChart3, { className: "h-3 w-3 text-white" }) }), _jsx("span", { className: "font-bold text-gray-900 dark:text-gray-100", children: "Generated Assets" })] }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "AI-powered investment tool that transforms ideas into investable stock indexes." })] }), [
                                    {
                                        title: "Platform",
                                        links: ["How it works", "Pricing", "API Access", "Enterprise"],
                                    },
                                    {
                                        title: "Resources",
                                        links: ["Documentation", "Tutorials", "Blog", "Support"],
                                    },
                                    {
                                        title: "Company",
                                        links: ["About", "Careers", "Privacy", "Terms"],
                                    },
                                ].map((section, index) => (_jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-gray-900 dark:text-gray-100 mb-3", children: section.title }), _jsx("ul", { className: "space-y-2 text-sm text-gray-600 dark:text-gray-400", children: section.links.map((link, linkIndex) => (_jsx("li", { children: _jsx(Link, { href: "#", className: "hover:text-gray-900 dark:hover:text-gray-100 transition-colors", children: link }) }, linkIndex))) })] }, index)))] }), _jsxs("div", { className: "border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 flex justify-between items-center", children: [_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "\u00A9 2024 Generated Assets. All rights reserved." }), _jsx("div", { className: "flex space-x-4", children: ["twitter", "linkedin", "github"].map((social) => (_jsxs(Link, { href: "#", className: "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors", children: [_jsx("span", { className: "sr-only", children: social }), _jsx("div", { className: "w-5 h-5 bg-gray-400 dark:bg-gray-600 rounded" })] }, social))) })] })] }) })] }));
}
