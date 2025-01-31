import type { Express } from "express";
import { createServer, type Server } from "http";
import { nanoid } from 'nanoid';
import { generateResponse } from './services/gemini';

export function registerRoutes(app: Express): Server {
  const server = createServer(app);

  app.post('/api/chat', async (req, res) => {
    try {
      const { message, context } = req.body;

      const response = await generateResponse({ message, context });

      res.json({
        id: nanoid(),
        role: 'assistant',
        content: response.content,
        thinking: response.thinking,
        timestamp: new Date().toISOString(),
        isCode: response.content.includes('```') || response.content.includes('function') || response.content.includes('class')
      });
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : 'An error occurred'
      });
    }
  });

  return server;
}