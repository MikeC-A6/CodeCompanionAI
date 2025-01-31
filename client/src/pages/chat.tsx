import { useState } from 'react';
import { nanoid } from 'nanoid';
import { Send } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ChatMessage } from '@/components/chat/message';
import { FileUpload } from '@/components/chat/file-upload';
import { Message, ChatContext, ChatState } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

export default function Chat() {
  const [input, setInput] = useState('');
  const [context, setContext] = useState<ChatContext>({ files: [] });
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest('POST', '/api/chat', {
        message,
        context,
      });
      return response.json();
    },
    onSuccess: (data: Message) => {
      queryClient.setQueryData<ChatState>(['chat'], (old) => ({
        messages: [...(old?.messages || []), data],
        context,
      }));
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: nanoid(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    queryClient.setQueryData<ChatState>(['chat'], (old) => ({
      messages: [...(old?.messages || []), userMessage],
      context,
    }));

    setInput('');
    await chatMutation.mutateAsync(input);
  };

  const handleFileUpload = (files: { name: string; content: string }[]) => {
    setContext((prev) => ({
      files: [...prev.files, ...files],
    }));
  };

  const chatState = queryClient.getQueryData<ChatState>(['chat']);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">AI Development Assistant</h1>
          <FileUpload onFileUpload={handleFileUpload} />
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {chatState?.messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </div>

        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about software development..."
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <Button 
            onClick={handleSubmit}
            disabled={chatMutation.isPending}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
