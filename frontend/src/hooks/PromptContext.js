import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useState, useContext } from 'react';
const PromptContext = createContext(undefined);
export const PromptProvider = ({ children }) => {
    const [prompt, setPrompt] = useState(null);
    return (_jsx(PromptContext.Provider, { value: { prompt, setPrompt }, children: children }));
};
export const usePrompt = () => {
    const context = useContext(PromptContext);
    if (context === undefined) {
        throw new Error('usePrompt must be used within a PromptProvider');
    }
    return context;
};
