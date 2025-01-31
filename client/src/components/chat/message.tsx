import { FC } from 'react';
import { Message } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { CodeBlock } from './code-block';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: FC<ChatMessageProps> = ({ message }) => {
  return (
    <Card className={`p-4 mb-4 ${message.role === 'assistant' ? 'bg-primary/5' : ''}`}>
      <div className="flex flex-col gap-2">
        {message.thinking && (
          <div className="text-sm text-muted-foreground italic mb-2 border-l-2 border-primary/50 pl-2">
            Thinking: {message.thinking}
          </div>
        )}
        
        {message.isCode ? (
          <CodeBlock code={message.content} />
        ) : (
          <p className="whitespace-pre-wrap">{message.content}</p>
        )}
        
        <div className="text-xs text-muted-foreground mt-2">
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </Card>
  );
};
