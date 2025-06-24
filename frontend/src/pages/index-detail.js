import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useQuery } from '@tanstack/react-query';
import { useRoute } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StockTable } from '@/components/StockTable';
import { PerformanceChart } from '@/components/PerformanceChart';
import { ArrowLeft, Share, Edit, TrendingUp, TrendingDown, BarChart3, DollarSign, Calendar, Globe, Lock } from 'lucide-react';
import { Link } from 'wouter';
import { authService } from '@/lib/auth';
export default function IndexDetail() {
    const [match, params] = useRoute('/index/:id');
    const indexId = params?.id || null;
    const { data: indexData, isLoading, error } = useQuery({
        queryKey: ['index', indexId],
        queryFn: async () => {
            const response = await authService.apiRequest(`${import.meta.env.VITE_API_URL}/index/${indexId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch index');
            }
            return response.json();
        },
        enabled: !!indexId,
    });
    if (!match || !indexId) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Invalid Index" }), _jsx(Link, { href: "/", children: _jsx(Button, { children: "Go Back to Dashboard" }) })] }) }));
    }
    if (isLoading) {
        return (_jsx("div", { className: "min-h-screen bg-gray-50", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: _jsxs("div", { className: "animate-pulse space-y-8", children: [_jsx("div", { className: "h-8 bg-gray-200 rounded w-1/3" }), _jsx("div", { className: "h-64 bg-gray-200 rounded" }), _jsx("div", { className: "h-96 bg-gray-200 rounded" })] }) }) }));
    }
    if (error || !indexData) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Index Not Found" }), _jsx("p", { className: "text-gray-600 mb-4", children: "The requested index could not be found." }), _jsx(Link, { href: "/", children: _jsx(Button, { children: "Go Back to Dashboard" }) })] }) }));
    }
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };
    const formatDate = (date) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(typeof date === 'string' ? new Date(date) : date);
    };
    const isPositive = indexData.performance1d >= 0;
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 dark:from-gray-900 dark:via-blue-950/30 dark:to-indigo-950/30", children: [_jsx("header", { className: "glass-card border-b border-gray-200/50 dark:border-gray-800/50", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex justify-between items-center h-16", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsx(Link, { href: "/dashboard", children: _jsxs(Button, { variant: "ghost", size: "sm", className: "hover:bg-gray-100 dark:hover:bg-gray-800", children: [_jsx(ArrowLeft, { className: "h-4 w-4 mr-2" }), "Back to Dashboard"] }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold text-gradient", children: indexData.name }), _jsxs("div", { className: "flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400", children: [_jsxs("div", { className: "flex items-center space-x-1", children: [_jsx(Calendar, { className: "h-3 w-3" }), _jsxs("span", { children: ["Created ", formatDate(indexData.createdAt)] })] }), _jsxs("div", { className: "flex items-center space-x-1", children: [_jsx(BarChart3, { className: "h-3 w-3" }), _jsxs("span", { children: [indexData.stocks?.length || 0, " stocks"] })] }), _jsx("div", { className: "flex items-center space-x-1", children: indexData.isPublic ? (_jsxs(_Fragment, { children: [_jsx(Globe, { className: "h-3 w-3" }), _jsx("span", { children: "Public" })] })) : (_jsxs(_Fragment, { children: [_jsx(Lock, { className: "h-3 w-3" }), _jsx("span", { children: "Private" })] })) })] })] })] }), _jsxs("div", { className: "flex space-x-2", children: [_jsxs(Button, { variant: "outline", size: "sm", className: "border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800", children: [_jsx(Edit, { className: "h-4 w-4 mr-2" }), "Edit"] }), _jsxs(Button, { variant: "outline", size: "sm", className: "border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800", children: [_jsx(Share, { className: "h-4 w-4 mr-2" }), "Share"] })] })] }) }) }), _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8", children: [_jsx(Card, { className: "glass-card hover-lift", children: _jsxs(CardContent, { className: "pt-6", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-2", children: [_jsx(DollarSign, { className: "h-4 w-4 text-gray-500 dark:text-gray-400" }), _jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Total Value" })] }), _jsx("div", { className: "text-2xl font-bold text-gray-900 dark:text-gray-100", children: formatCurrency(indexData.totalValue) })] }) }), _jsx(Card, { className: "glass-card hover-lift", children: _jsxs(CardContent, { className: "pt-6", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-2", children: [isPositive ? (_jsx(TrendingUp, { className: "h-4 w-4 text-green-500" })) : (_jsx(TrendingDown, { className: "h-4 w-4 text-red-500" })), _jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "1D Performance" })] }), _jsxs("div", { className: `text-2xl font-bold ${isPositive ? 'performance-positive' : 'performance-negative'}`, children: [isPositive ? '+' : '', indexData.performance1d?.toFixed(2) || '0.00', "%"] })] }) }), _jsx(Card, { className: "glass-card hover-lift", children: _jsxs(CardContent, { className: "pt-6", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-2", children: [_jsx(BarChart3, { className: "h-4 w-4 text-blue-500" }), _jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "vs S&P 500" })] }), _jsxs("div", { className: "text-2xl font-bold text-blue-600 dark:text-blue-400", children: ["+", ((indexData.performance1d || 0) - 0.8).toFixed(2), "%"] })] }) }), _jsx(Card, { className: "glass-card hover-lift", children: _jsxs(CardContent, { className: "pt-6", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-2", children: [_jsx(BarChart3, { className: "h-4 w-4 text-purple-500" }), _jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "vs NASDAQ" })] }), _jsxs("div", { className: "text-2xl font-bold text-purple-600 dark:text-purple-400", children: ["+", ((indexData.performance1d || 0) + 0.3).toFixed(2), "%"] })] }) })] }), indexData.description && (_jsxs(Card, { className: "glass-card hover-lift mb-8", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-gradient", children: "Investment Thesis" }) }), _jsxs(CardContent, { children: [_jsx("p", { className: "text-gray-700 dark:text-gray-300 leading-relaxed", children: indexData.description }), _jsx("div", { className: "mt-4", children: _jsxs(Badge, { variant: "secondary", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300", children: ["Generated from: \"", indexData.prompt, "\""] }) })] })] })), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8", children: [_jsx("div", { className: "lg:col-span-2", children: _jsx(PerformanceChart, { indexId: indexData._id }) }), _jsxs("div", { className: "space-y-6", children: [_jsxs(Card, { className: "glass-card hover-lift", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-lg font-semibold text-gradient", children: "AI Analysis" }) }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 rounded-lg", children: [_jsxs("div", { className: "text-2xl font-bold text-blue-600 dark:text-blue-400", children: [((indexData.performance1y || indexData.performance1d || 0) - 8.9).toFixed(1), "%"] }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Return" })] }), _jsxs("div", { className: "text-center p-4 bg-green-50 dark:bg-green-950/50 rounded-lg", children: [_jsx("div", { className: "text-2xl font-bold text-green-600 dark:text-green-400", children: 0.85 }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Stability" })] }), _jsxs("div", { className: "text-center p-4 bg-purple-50 dark:bg-purple-950/50 rounded-lg", children: [_jsxs("div", { className: "text-2xl font-bold text-purple-600 dark:text-purple-400", children: [(indexData.performance1y || indexData.performance1d || 0).toFixed(1), "%"] }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Performance" })] })] }) })] }), _jsxs(Card, { className: "glass-card hover-lift", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-lg font-semibold text-gradient", children: "Quick Stats" }) }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Total Stocks" }), _jsx("span", { className: "font-medium text-gray-900 dark:text-gray-100", children: indexData.stocks?.length || 0 })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Avg Market Cap" }), _jsx("span", { className: "font-medium text-gray-900 dark:text-gray-100", children: indexData.stocks && indexData.stocks.length > 0
                                                                        ? `$${((indexData.stocks.reduce((sum, stock) => sum + (stock.marketCap || 0), 0) / indexData.stocks.length) / 1e9).toFixed(1)}B`
                                                                        : 'N/A' })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Top Sector" }), _jsx("span", { className: "font-medium text-gray-900 dark:text-gray-100", children: indexData.stocks && indexData.stocks.length > 0
                                                                        ? (() => {
                                                                            const sectors = indexData.stocks.map(s => s.sector).filter(Boolean);
                                                                            const sectorCounts = sectors.reduce((acc, sector) => {
                                                                                acc[sector] = (acc[sector] || 0) + 1;
                                                                                return acc;
                                                                            }, {});
                                                                            const topSector = Object.entries(sectorCounts).sort(([, a], [, b]) => b - a)[0];
                                                                            return topSector ? topSector[0] : 'N/A';
                                                                        })()
                                                                        : 'N/A' })] })] }) })] })] })] }), _jsxs(Card, { className: "glass-card hover-lift", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "text-gradient", children: ["Holdings (", indexData.stocks?.length || 0, " stocks)"] }) }), _jsx(CardContent, { children: _jsx(StockTable, { stocks: indexData.stocks || [] }) })] })] })] }));
}
