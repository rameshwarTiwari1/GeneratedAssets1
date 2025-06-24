import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Send } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
const quickSuggestions = [
    "AI companies leading in healthcare innovation",
];
export function CreateIndexModal({ isOpen, onClose, initialPrompt }) {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const chatEndRef = useRef(null);
    const createIndexMutation = useMutation({
        mutationFn: async (data) => {
            const response = await authService.apiRequest(`${import.meta.env.VITE_API_URL}/generate-index`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: data.prompt, description: `AI-generated index based on: ${data.prompt}` }),
            });
            if (!response.ok) {
                throw new Error('Failed to create index');
            }
            return response.json();
        },
        onSuccess: (data, variables) => {
            setMessages((prev) => [
                ...prev,
                { sender: 'ai', text: `✅ Index "${data.name}" created with ${data.stocks?.length || 0} stocks.\n${data.description || ''}` }
            ]);
            toast({
                title: "Index created successfully!",
                description: `"${data.name}" has been generated with ${data.stocks?.length || 0} stocks.`,
            });
            queryClient.invalidateQueries({ queryKey: ['indexes'] });
        },
        onError: (error) => {
            setMessages((prev) => [
                ...prev,
                { sender: 'ai', text: error.message || 'Failed to create index. Please try again.' }
            ]);
            toast({
                title: "Failed to create index",
                description: error.message || "Please try again with a different prompt.",
                variant: "destructive",
            });
        },
        onSettled: () => setIsLoading(false),
    });
    useEffect(() => {
        if (initialPrompt && isOpen) {
            setMessages([
                { sender: 'ai', text: "Hi! I'm your AI investment assistant. Tell me about the type of companies or investment theme you're interested in, and I'll create a diversified portfolio for you." },
                { sender: 'user', text: initialPrompt },
            ]);
            setIsLoading(true);
            createIndexMutation.mutate({ prompt: initialPrompt.trim() });
        }
        else if (isOpen) {
            setMessages([
                { sender: 'ai', text: "Hi! I'm your AI investment assistant. Tell me about the type of companies or investment theme you're interested in, and I'll create a diversified portfolio for you." },
            ]);
        }
        setInput('');
    }, [initialPrompt, isOpen]);
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isLoading]);
    const handleClose = () => {
        if (isOpen) {
            setInput('');
            setMessages([]);
            onClose();
        }
    };
    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim())
            return;
        setMessages((prev) => [...prev, { sender: 'user', text: input.trim() }]);
        setIsLoading(true);
        createIndexMutation.mutate({ prompt: input.trim() });
        setInput('');
    };
    const handleSuggestion = (suggestion) => {
        setInput(suggestion);
    };
    return (_jsx(Dialog, { open: isOpen, onOpenChange: handleClose, children: _jsxs(DialogContent, { className: "max-w-md flex flex-col h-[70vh] p-0 bg-gray-50 dark:bg-gray-900 border-none shadow-xl", children: [_jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-4", children: [messages.map((msg, i) => (_jsx("div", { className: `flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`, children: _jsx("div", { className: `rounded-2xl px-4 py-2 max-w-[75%] whitespace-pre-line text-sm ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100'}`, children: msg.text }) }, i))), isLoading && (_jsx("div", { className: "flex justify-start", children: _jsx("div", { className: "rounded-2xl px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 animate-pulse text-sm", children: "AI is thinking..." }) })), _jsx("div", { ref: chatEndRef })] }), quickSuggestions.length > 0 && (_jsx("div", { className: "flex flex-wrap gap-2 px-4 pb-2", children: quickSuggestions.map((s, i) => (_jsx(Button, { variant: "secondary", size: "sm", onClick: () => handleSuggestion(s), children: s }, i))) })), _jsxs("form", { onSubmit: handleSend, className: "flex gap-2 p-4 border-t bg-gray-50 dark:bg-gray-900", children: [_jsx(Input, { value: input, onChange: e => setInput(e.target.value), placeholder: "Type your investment idea...", className: "flex-1", disabled: isLoading }), _jsxs(Button, { type: "submit", disabled: isLoading || !input.trim(), className: "flex items-center gap-1", children: [_jsx(Send, { className: "h-4 w-4" }), "Send"] })] })] }) }));
}
