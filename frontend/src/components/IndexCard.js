import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, BarChart3, Share, MoreHorizontal, Calendar, DollarSign, Eye, EyeOff, Globe, Lock } from 'lucide-react';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { authService } from '@/lib/auth';
export function IndexCard({ index, variant = 'recent', onClick, currentUserId, onPublicToggle }) {
    const isPositive = (index.performance1d || 0) >= 0;
    const performance = variant === 'trending' ? (index.performance7d || 0) : (index.performance1d || 0);
    const timeLabel = variant === 'trending' ? '7 days' : 'Today';
    const [isPublic, setIsPublic] = useState(!!index.isPublic);
    const [loading, setLoading] = useState(false);
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value || 0);
    };
    const formatDate = (date) => {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - dateObj.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        if (diffDays > 0) {
            return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        }
        else if (diffHours > 0) {
            return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        }
        else {
            return 'Just now';
        }
    };
    const handleTogglePublic = async () => {
        if (!index._id)
            return;
        setLoading(true);
        try {
            const response = await authService.apiRequest(`http://localhost:5000/api/index/${index._id}/toggle-public`, {
                method: 'PATCH',
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }
            const data = await response.json();
            setIsPublic(data.isPublic);
            if (onPublicToggle)
                onPublicToggle(index._id, data.isPublic);
            toast({
                title: 'Index Visibility Updated',
                description: `Index is now ${data.isPublic ? 'public' : 'private'}.`,
            });
        }
        catch (error) {
            console.error('Toggle error:', error);
            toast({
                title: 'Error',
                description: error.message || 'Failed to update index visibility',
                variant: 'destructive',
            });
        }
        finally {
            setLoading(false);
        }
    };
    if (variant === 'trending') {
        return (_jsx(Card, { className: "glass-card hover-lift cursor-pointer", onClick: onClick, children: _jsxs(CardContent, { className: "p-4", children: [_jsxs("div", { className: "flex justify-between items-start mb-3", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("div", { className: "w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center", children: _jsx(TrendingUp, { className: "h-4 w-4 text-blue-600 dark:text-blue-400" }) }), _jsx(Badge, { variant: "secondary", className: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300", children: "Trending" })] }), _jsx(Button, { variant: "ghost", size: "sm", className: "p-1 hover:bg-gray-100 dark:hover:bg-gray-800", children: _jsx(MoreHorizontal, { className: "h-4 w-4" }) })] }), _jsx("h3", { className: "font-semibold text-gray-900 dark:text-gray-100 mb-1", children: index.name }), _jsxs("p", { className: "text-sm text-gray-600 dark:text-gray-400 mb-3", children: [index.stocks?.length || 0, " stocks \u2022 Created ", formatDate(index.createdAt)] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("span", { className: `text-lg font-semibold ${isPositive ? 'performance-positive' : 'performance-negative'}`, children: [isPositive ? '+' : '', performance.toFixed(1), "%"] }), _jsx("span", { className: "text-sm text-gray-500 dark:text-gray-400", children: timeLabel })] })] }) }));
    }
    return (_jsxs("div", { className: "border-b border-gray-100 dark:border-gray-800 last:border-b-0 py-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors rounded-lg px-2", children: [_jsxs("div", { className: "flex justify-between items-start mb-3", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-gray-900 dark:text-gray-100 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors", onClick: onClick, children: index.name }), _jsxs("div", { className: "text-xs text-gray-500 dark:text-gray-400 mt-0.5", children: ["Created by ", index.creatorName || (index.userId === currentUserId ? 'You' : 'Unknown')] }), _jsxs("div", { className: "flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mt-1", children: [_jsxs("div", { className: "flex items-center space-x-1", children: [_jsx(Calendar, { className: "h-3 w-3" }), _jsxs("span", { children: ["Created ", formatDate(index.createdAt)] })] }), _jsxs("div", { className: "flex items-center space-x-1 relative group", children: [_jsx(BarChart3, { className: "h-3 w-3" }), _jsxs("span", { className: "cursor-help", children: [index.stocks?.length || 0, " stocks"] }), index.stocks && index.stocks.length > 0 && (_jsxs("div", { className: "absolute left-0 top-6 p-3 glass-card shadow-lg z-20 w-72 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto", children: [_jsxs("div", { className: "text-sm font-medium mb-2 text-gray-900 dark:text-gray-100", children: ["Holdings (", index.stocks.length, " stocks):"] }), _jsx("div", { className: "space-y-1 max-h-48 overflow-y-auto", children: index.stocks.map((stock, idx) => (_jsxs("div", { className: "flex justify-between items-center text-xs", children: [_jsxs("div", { children: [_jsx("span", { className: "font-medium text-gray-900 dark:text-gray-100", children: stock.symbol }), _jsxs("span", { className: "text-gray-500 dark:text-gray-400 ml-1", children: ["(", stock.name, ")"] })] }), _jsxs("div", { className: "text-right", children: [_jsxs("div", { className: "font-medium text-gray-900 dark:text-gray-100", children: ["$", stock.price] }), _jsxs("div", { className: `text-xs ${(stock.changePercent1d || 0) >= 0 ? 'performance-positive' : 'performance-negative'}`, children: [(stock.changePercent1d || 0) >= 0 ? '+' : '', (stock.changePercent1d || 0).toFixed(2), "%"] })] })] }, idx))) })] }))] }), isPublic ? (_jsxs(Badge, { className: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 flex items-center space-x-1", children: [_jsx(Globe, { className: "h-3 w-3 mr-1" }), " Public"] })) : (_jsxs(Badge, { className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 flex items-center space-x-1", children: [_jsx(Lock, { className: "h-3 w-3 mr-1" }), " Private"] }))] })] }), _jsxs("div", { className: "text-right flex flex-col items-end gap-2", children: [_jsxs("div", { className: `text-lg font-semibold flex items-center ${isPositive ? 'performance-positive' : 'performance-negative'}`, children: [isPositive ? _jsx(TrendingUp, { className: "h-4 w-4 mr-1" }) : _jsx(TrendingDown, { className: "h-4 w-4 mr-1" }), isPositive ? '+' : '', performance.toFixed(1), "%"] }), _jsx("div", { className: "text-sm text-gray-500 dark:text-gray-400", children: timeLabel }), index.userId === currentUserId && (_jsx(Button, { variant: "outline", size: "sm", onClick: handleTogglePublic, disabled: loading, className: `flex items-center space-x-1 text-xs px-2 py-1 h-7 ${isPublic
                                    ? 'border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-950/50'
                                    : 'border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800'}`, children: loading ? (_jsx("div", { className: "w-3 h-3 border border-gray-300 dark:border-gray-600 border-t-gray-600 dark:border-t-gray-400 rounded-full animate-spin" })) : isPublic ? (_jsxs(_Fragment, { children: [_jsx(Eye, { className: "h-3 w-3" }), _jsx("span", { children: "Public" })] })) : (_jsxs(_Fragment, { children: [_jsx(EyeOff, { className: "h-3 w-3" }), _jsx("span", { children: "Private" })] })) }))] })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { className: "flex space-x-4 text-sm text-gray-600 dark:text-gray-400", children: [_jsxs("div", { className: "flex items-center space-x-1", children: [_jsx(DollarSign, { className: "h-3 w-3" }), _jsxs("span", { children: ["Value: ", formatCurrency(index.totalValue || 0)] })] }), _jsxs("span", { className: `${(index.performance1d || 0) > 0 ? 'performance-positive' : 'performance-negative'}`, children: ["vs S&P 500: ", (index.performance1d || 0) > 0 ? '+' : '', ((index.performance1d || 0) - 0.8).toFixed(1), "%"] })] }), _jsxs("div", { className: "flex space-x-2", children: [_jsx(Button, { variant: "ghost", size: "sm", className: "p-2 hover:bg-gray-100 dark:hover:bg-gray-800", children: _jsx(BarChart3, { className: "h-4 w-4" }) }), _jsx(Button, { variant: "ghost", size: "sm", className: "p-2 hover:bg-gray-100 dark:hover:bg-gray-800", children: _jsx(Share, { className: "h-4 w-4" }) }), _jsx(Button, { variant: "ghost", size: "sm", className: "p-2 hover:bg-gray-100 dark:hover:bg-gray-800", children: _jsx(MoreHorizontal, { className: "h-4 w-4" }) })] })] })] }));
}
