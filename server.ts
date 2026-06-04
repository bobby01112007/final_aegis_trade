import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import multer from 'multer';
import * as pdfImport from 'pdf-parse';

const pdf = ((pdfImport as any).default || pdfImport) as any;

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Set up memory storage for uploaded PDF files
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

// Lazy-initialized Gemini client with safety checks
let aiClient: GoogleGenAI | null = null;

function getGeminiClient() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error('GEMINI_API_KEY is currently undefined.');
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Formal AI Trade Oracle endpoint
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
       res.status(400).json({ 
        error: 'Good day. A properly structured message array is required in the body of this inquiry.' 
      });
      return;
    }

    // Attempt to retrieve active Gemini instance
    let ai;
    try {
      ai = getGeminiClient();
    } catch (authError) {
      // Graceful error response for missing API key
       res.json({
        reply: 'Good day. We regret to inform you that the Aegis Trade AI Oracle is currently offline. The sovereign compliance system requires a valid authentication handshake to be established. Please append your credentials inside the Settings panel to restore AI advising capabilities.',
        status: 'unconfigured'
      });
      return;
    }

    // Format incoming chat message history to match GoogleGenAI contents parameter schema
    const contents = messages.map((m: any) => ({
      role: m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.text || '' }]
    }));

    // Invoke Gemini model with absolute formal protocol
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: contents,
      config: {
        systemInstruction: `You are the Aegis Trade AI Oracle, an elite compliance concierge and sovereign trade intelligence adviser.
Your objective is to advise global logistics operations, customs agents, and enterprise compliance divisions on trade regulations, phytosanitary requirements, tariffs, and shipping protocols.
You MUST respond in an extremely formal, precise, elegant, and corporate tone. Use impeccable business etiquette, elevated syntax, and sophisticated, respectful phrasing (e.g., "Good day," "Indeed," "Regarding your inquiry," "We have validated," etc.).
Provide deeply analytical, structured, and informative advice. Do not use casual conversational shortcuts, shortcuts like 'hi' or 'hello' without elegance, and strictly avoid emojis. Keep responses readable but distinctly sophisticated.`,
        temperature: 0.7,
      },
    });

    const replyText = response.text || 'Indeed, our analytical core returned an empty response. Let us query once more should need arise.';
     res.json({
      reply: replyText,
      status: 'active'
    });

  } catch (error: any) {
    console.error('Gemini Oracle server error:', error);
     res.status(500).json({ 
      error: 'An internal error occurred during custom audit processing.',
      details: error.message 
    });
  }
});

// PDF Parsing and Extraction Endpoint using pdf-parse
app.post('/api/compliance/parse-pdf', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No document file was uploaded.' });
      return;
    }

    if (req.file.mimetype !== 'application/pdf') {
       res.status(400).json({ error: 'This interface accepts PDF document uploads only.' });
       return;
    }

    const buffer = req.file.buffer;
    const parsedData = await pdf(buffer);

    res.json({
      text: parsedData.text,
      numpages: parsedData.numpages,
      info: parsedData.info,
      metadata: parsedData.metadata
    });

  } catch (error: any) {
    console.error('Error while extracting text from PDF:', error);
    res.status(500).json({
      error: 'An error occurred during server-side PDF extraction.',
      details: error.message
    });
  }
});

// Configure Vite middleware or serve static built files
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Aegis Server Started] Interface running on http://localhost:${PORT}`);
  });
}

setupServer();
