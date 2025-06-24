import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
export function ThemeToggle() {
    const [theme, setTheme] = useState('light');
    useEffect(() => {
        // Check for saved theme preference or default to light
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }, []);
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    };
    return (_jsxs(Button, { variant: "ghost", size: "sm", onClick: toggleTheme, className: "relative overflow-hidden hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300", children: [_jsxs("div", { className: "relative flex items-center justify-center w-6 h-6", children: [_jsx(Sun, { className: `h-4 w-4 transition-all duration-500 ${theme === 'light'
                            ? 'rotate-0 scale-100 text-yellow-500'
                            : 'rotate-90 scale-0 text-gray-400'}` }), _jsx(Moon, { className: `absolute h-4 w-4 transition-all duration-500 ${theme === 'dark'
                            ? 'rotate-0 scale-100 text-blue-400'
                            : '-rotate-90 scale-0 text-gray-400'}` })] }), _jsx("span", { className: "sr-only", children: "Toggle theme" })] }));
}
