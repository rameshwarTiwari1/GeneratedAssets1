import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { authService } from '../lib/auth';
const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [, setLocation] = useLocation();
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const user = await authService.getCurrentUser();
                if (user) {
                    setIsAuthenticated(true);
                }
                else {
                    setIsAuthenticated(false);
                    setLocation('/auth');
                }
            }
            catch (error) {
                setIsAuthenticated(false);
                setLocation('/auth');
            }
        };
        checkAuth();
    }, [setLocation]);
    if (isAuthenticated === null) {
        // Loading state
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" }), _jsx("p", { className: "mt-4 text-gray-600", children: "Loading..." })] }) }));
    }
    if (!isAuthenticated) {
        return null; // Will redirect to auth page
    }
    return _jsx(_Fragment, { children: children });
};
export default ProtectedRoute;
