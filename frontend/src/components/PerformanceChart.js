import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { authService } from '@/lib/auth';
import { toast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, } from 'recharts';
const timeRanges = [
    { label: '1Y', value: '1Y' },
    { label: '5Y', value: '5Y' },
    { label: '10Y', value: '10Y' },
];
function movingAverage(data, windowSize = 7) {
    if (!Array.isArray(data) || data.length === 0)
        return [];
    const result = [];
    for (let i = 0; i < data.length; i++) {
        const start = Math.max(0, i - windowSize + 1);
        const window = data.slice(start, i + 1);
        const avg = window.reduce((sum, d) => sum + (d.asset ?? 0), 0) / window.length;
        result.push({ ...data[i], asset: avg });
    }
    return result;
}
function downsample(data, step = 3) {
    return data.filter((_, idx) => idx % step === 0);
}
export function PerformanceChart({ indexId }) {
    const [selectedPeriod, setSelectedPeriod] = useState('1M');
    const [napkinChartData, setNapkinChartData] = useState(null);
    const [isGeneratingChart, setIsGeneratingChart] = useState(false);
    const [chartError, setChartError] = useState(null);
    const [timeRange, setTimeRange] = useState('10Y');
    const periods = [
        { label: '1D', value: '1D' },
        { label: '1W', value: '1W' },
        { label: '1M', value: '1M' },
        { label: '3M', value: '3M' },
        { label: '1Y', value: '1Y' },
    ];
    const { data: backtestData, isLoading, error } = useQuery({
        queryKey: ['backtest', indexId, timeRange],
        queryFn: async () => {
            const response = await authService.apiRequest(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/indexes/backtest/${indexId}?period=${timeRange}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch backtest data');
            }
            return response.json();
        },
        enabled: !!indexId,
    });
    const generateNapkinChart = async () => {
        if (!indexId) {
            toast({
                title: "Error",
                description: "Index ID is required to generate chart",
                variant: "destructive",
            });
            return;
        }
        setIsGeneratingChart(true);
        setChartError(null);
        try {
            const token = authService.getToken();
            if (!token) {
                throw new Error('Authentication required');
            }
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/napkin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ indexId }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to generate chart');
            }
            const chartData = await response.json();
            setNapkinChartData(chartData);
            toast({
                title: "Success!",
                description: "Napkin AI chart generated successfully",
            });
        }
        catch (error) {
            console.error('Napkin chart generation error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to generate chart';
            setChartError(errorMessage);
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
        }
        finally {
            setIsGeneratingChart(false);
        }
    };
    const openNapkinEditor = () => {
        if (napkinChartData) {
            // Open Napkin AI editor with the chart data
            const napkinUrl = `https://napkin.ai/create?data=${encodeURIComponent(JSON.stringify(napkinChartData))}`;
            window.open(napkinUrl, '_blank');
        }
    };
    const formatPercent = (value) => {
        if (typeof value !== 'number')
            return 'N/A';
        return `${value.toFixed(2)}%`;
    };
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const assetData = payload.find((p) => p.dataKey === 'asset');
            const benchmarkData = payload.find((p) => p.dataKey === 'benchmark');
            return (_jsxs("div", { className: "p-3 bg-gray-800/80 backdrop-blur-sm text-white rounded-lg shadow-lg border border-gray-700", children: [_jsx("p", { className: "font-bold text-base mb-2", children: label }), assetData && _jsxs("p", { style: { color: '#8b5cf6' }, children: ["Asset: ", formatPercent(assetData.value)] }), benchmarkData && _jsxs("p", { style: { color: '#60a5fa' }, children: ["S&P 500: ", formatPercent(benchmarkData.value)] })] }));
        }
        return null;
    };
    return (_jsxs(Card, { className: "glass-card hover-lift", children: [_jsx(CardHeader, { children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsx(CardTitle, { className: "text-xl font-semibold text-gradient", children: "Backtest Performance" }), _jsx("div", { className: "flex space-x-2", children: timeRanges.map((range) => (_jsx(Button, { variant: timeRange === range.value ? 'default' : 'outline', size: "sm", onClick: () => setTimeRange(range.value), className: `px-3 py-1 text-sm transition-all duration-200 ${timeRange === range.value
                                    ? 'gradient-primary text-white shadow-lg'
                                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'}`, children: range.label }, range.value))) })] }) }), _jsx(CardContent, { children: isLoading ? (_jsx("div", { className: "h-96 flex items-center justify-center", children: _jsx("div", { className: "w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full animate-spin" }) })) : error ? (_jsxs("div", { className: "h-96 flex items-center justify-center text-red-500", children: ["Error: ", error.message] })) : backtestData ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "grid grid-cols-2 gap-4 mb-6 text-center", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-400", children: "Total returns" }), _jsx("p", { className: "text-3xl font-bold text-green-400", children: formatPercent(backtestData.totalReturn) }), _jsxs("p", { className: "text-sm text-gray-500", children: [formatPercent(backtestData.sp500TotalReturn), " S&P"] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-400", children: "Max drawdown" }), _jsx("p", { className: "text-3xl font-bold text-red-400", children: formatPercent(backtestData.maxDrawdown) }), _jsxs("p", { className: "text-sm text-gray-500", children: [formatPercent(backtestData.sp500MaxDrawdown), " S&P"] })] })] }), _jsx("div", { className: "h-96", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: (() => {
                                    const smoothedData = movingAverage(backtestData.chartData, 7);
                                    const displayData = downsample(smoothedData, 3);
                                    return (_jsxs(LineChart, { data: displayData, margin: { top: 5, right: 20, left: -10, bottom: 5 }, children: [_jsx(XAxis, { dataKey: "date", stroke: "#9ca3af", tick: { fill: '#6b7280' }, tickLine: { stroke: '#4b5563' }, axisLine: { stroke: '#4b5563' } }), _jsx(YAxis, { stroke: "#9ca3af", tickFormatter: (value) => `${value}%`, tick: { fill: '#6b7280' }, tickLine: { stroke: '#4b5563' }, axisLine: { stroke: '#4b5563' } }), _jsx(Tooltip, { content: _jsx(CustomTooltip, {}), cursor: { stroke: '#a259ff', strokeDasharray: '3 3' } }), _jsx(Line, { type: "monotone", dataKey: "asset", name: "Asset", stroke: "#a259ff", strokeWidth: 2, dot: false, activeDot: false })] }));
                                })() }) })] })) : (_jsx("div", { className: "h-96 flex items-center justify-center text-gray-500", children: "No data available" })) })] }));
}
