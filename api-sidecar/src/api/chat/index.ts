import express from 'express';
import ollama from 'ollama';

const router = express.Router();

router.post('/', async (req, res) => {
  // Extract required fields from the request body
  // Expecting at least: model and messages
  const { model, messages, stream, ...options } = req.body;

  // Validate required parameters
  if (!model || !messages) {
    return res.status(400).json({ error: 'Missing model or messages parameter' });
  }

  try {
    // Handle streaming responses separately
    if (stream) {
      // Set headers for Server-Sent Events (SSE)
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      
      // Call Ollama with stream enabled so that it returns an AsyncGenerator
      const responseStream = await ollama.chat({ model, messages, stream: true, ...options });

      // Iterate over the async generator and send each part as an SSE message
      for await (const part of responseStream) {
        // Wrap the JSON payload in the proper SSE format
        res.write(`data: ${JSON.stringify(part)}\n\n`);
      }
      
      // Signal the end of the stream
      res.end();
    } else {
      // For non-streaming requests: await the full response from Ollama
      const response = await ollama.chat({ model, messages, ...options });
      res.json(response);
    }
  } catch (error) {
    console.error('Error in /chat/completions:', error);
    res.status(500).json({ error: (error as any).message });
  }
});

export default router;
