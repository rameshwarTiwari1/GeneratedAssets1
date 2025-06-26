import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Send } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';

interface CreateIndexModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string | null;
}

const quickSuggestions = [
  "AI companies leading in healthcare innovation",
];

type Message = { sender: 'user' | 'ai', text: string };

export function CreateIndexModal({ isOpen, onClose, initialPrompt }: CreateIndexModalProps) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [, setLocation] = useLocation();

  console.log("CreateIndexModal component loaded");

  const createIndexMutation = useMutation({
    mutationFn: async (data: { prompt: string }) => {
      console.log("mutationFn called with", data);
      const response = await authService.apiRequest(
        "https://generatedassets1.onrender.com/api/generate-index",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: data.prompt,
            description: `AI-generated index based on: ${data.prompt}`,
          }),
        }
      );
      if (!response.ok) {
        throw new Error('Failed to create index');
      }
      return response.json();
    },
    onSuccess: (data, variables) => {
      console.log("Index creation response:", data);
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: `✅ Index "${data.name}" created with ${data.stocks?.length || 0} stocks.\n${data.description || ''}` }
      ]);
      toast({
        title: "Index created successfully!",
        description: `"${data.name}" has been generated with ${data.stocks?.length || 0} stocks.`,
      });
      queryClient.invalidateQueries({ queryKey: ['indexes'] });
      onClose();
      if (data._id) {
        console.log("Redirecting to: ", `/index/${data._id}`);
        setTimeout(() => {
          setLocation(`/index/${data._id}`);
        }, 100);
      }
    },
    onError: (error: any) => {
      console.log("Index creation error:", error);
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
    } else if (isOpen) {
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
    console.log("handleClose called");
    if (isOpen) {
      setInput('');
      setMessages([]);
      onClose();
    }
  };

  const handleSend = (e: React.FormEvent) => {
    console.log("handleSend called");
    e.preventDefault();
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { sender: 'user', text: input.trim() }]);
    setIsLoading(true);
    createIndexMutation.mutate({ prompt: input.trim() });
    setInput('');
  };

  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <DialogContent className="max-w-md flex flex-col h-[70vh] p-0 bg-gray-50 dark:bg-gray-900 border-none shadow-xl">
        <DialogTitle className="sr-only">Create Index</DialogTitle>
        <span className="sr-only" id="create-index-desc">Create a new AI-generated index by describing your investment idea.</span>
        <div className="flex-1 overflow-y-auto p-4 space-y-4" aria-describedby="create-index-desc">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`rounded-2xl px-4 py-2 max-w-[75%] whitespace-pre-line text-sm ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="rounded-2xl px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 animate-pulse text-sm">
                AI is thinking...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        {quickSuggestions.length > 0 && (
          <div className="flex flex-wrap gap-2 px-4 pb-2">
            {quickSuggestions.map((s, i) => (
              <Button key={i} variant="secondary" size="sm" onClick={() => handleSuggestion(s)}>
                {s}
              </Button>
            ))}
          </div>
        )}
        <form onSubmit={handleSend} className="flex gap-2 p-4 border-t bg-gray-50 dark:bg-gray-900">
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your investment idea..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !input.trim()} className="flex items-center gap-1">
            <Send className="h-4 w-4" />
            Send
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
} 