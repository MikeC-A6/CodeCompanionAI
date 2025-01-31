import { FC } from 'react';
import { Message } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { CodeBlock } from './code-block';
import { User, Bot } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: FC<ChatMessageProps> = ({ message }) => {
  const isAssistant = message.role === 'assistant';

  // Helper function to detect if content contains code blocks
  const hasCodeBlock = (content: string) => content.includes('```');

  // Split content into text and code blocks
  const parts = message.content.split(/(```[\s\S]*?```)/g);

  return (
    <Card className={`p-6 mb-6 ${isAssistant ? 'bg-primary/5' : 'bg-background'}`}>
      <div className="flex items-start gap-4">
        <div className={`rounded-full p-2 ${isAssistant ? 'bg-primary/10' : 'bg-secondary/10'}`}>
          {isAssistant ? (
            <Bot className="h-5 w-5 text-primary" />
          ) : (
            <User className="h-5 w-5 text-secondary" />
          )}
        </div>

        <div className="flex-1 space-y-4">
          {message.thinking && (
            <div className="text-sm text-muted-foreground italic border-l-2 border-primary/50 pl-4 mb-4">
              Thinking: {message.thinking}
            </div>
          )}

          <div className="space-y-4">
            {parts.map((part, index) => {
              if (hasCodeBlock(part)) {
                return <CodeBlock key={index} code={part} />;
              }
              return part && <p key={index} className="text-sm leading-relaxed whitespace-pre-wrap">{part}</p>;
            })}
          </div>

          <div className="text-xs text-muted-foreground mt-4">
            {new Date(message.timestamp).toLocaleTimeString()}
          </div>
        </div>
      </div>
    </Card>
  );
};