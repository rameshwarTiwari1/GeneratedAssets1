import { jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect, createContext, useContext } from 'react';
import { authService } from '@/lib/auth';
const AuthContext = createContext(undefined);
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(authService.getUser());
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const checkUser = async () => {
            try {
                if (authService.getToken()) {
                    const currentUser = await authService.getCurrentUser();
                    setUser(currentUser);
                }
            }
            catch (error) {
                // This can happen if the token is invalid/expired
                authService.logout();
                setUser(null);
            }
            finally {
                setLoading(false);
            }
        };
        checkUser();
    }, []);
    const login = async (...args) => {
        const loggedInUser = await authService.login(...args);
        setUser(loggedInUser);
        return loggedInUser;
    };
    const register = async (...args) => {
        const registeredUser = await authService.register(...args);
        setUser(registeredUser);
        return registeredUser;
    };
    const googleLogin = async (...args) => {
        const loggedInUser = await authService.googleLogin(...args);
        setUser(loggedInUser);
        return loggedInUser;
    };
    const logout = async () => {
        await authService.logout();
        setUser(null);
    };
    const value = {
        user,
        loading,
        login,
        logout,
        register,
        googleLogin,
    };
    return _jsx(AuthContext.Provider, { value: value, children: children });
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
