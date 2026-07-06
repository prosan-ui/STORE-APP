import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded Gemini AI client to prevent crashing on missing API key
let aiClient: GoogleGenAI | null = null;

function getGeminiClient() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("GEMINI_API_KEY environment variable is missing.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key || "",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// 1. API: Security Virus & Malware Scanner
app.post("/api/gemini/scan", async (req, res) => {
  try {
    const { appName, appDescription, permissions, codeSnippet } = req.body;
    
    if (!appName) {
      return res.status(400).json({ error: "App name is required for scanning." });
    }

    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      // Return a simulated mock security report if API key is not configured
      return res.json({
        appName,
        safetyStatus: "Clean (Simulated)",
        safetyScore: 98,
        findings: [
          {
            type: "Permission Audit",
            status: "Passed",
            details: "No excessive or dangerous permissions requested."
          },
          {
            type: "Signature Check",
            status: "Passed",
            details: "App matches verified cryptographic publisher signature."
          },
          {
            type: "Malware Pattern Scanning",
            status: "Passed",
            details: "No known malicious patterns, tracking SDKs, or keyloggers detected."
          }
        ],
        verdict: "កម្មវិធីនេះមានសុវត្ថិភាពខ្ពស់ក្នុងការទាញយក និងប្រើប្រាស់។ (This application is safe to download and use. This is a simulated scan result since GEMINI_API_KEY is not configured.)",
        isMock: true
      });
    }

    const ai = getGeminiClient();
    
    const prompt = `You are an automated mobile and desktop application security scanner and antivirus engine for the Khmer App Store.
Analyze the following application metadata and code structure for potential virus, malware, privacy leakage, excessive permission abuse, adware, or fraudulent behaviors.

App Name: ${appName}
App Description: ${appDescription || "No description provided"}
Requested Permissions: ${JSON.stringify(permissions || [])}
Mock Code/Config Outline: ${codeSnippet || "No custom code provided"}

Evaluate the app thoroughly. Output your analysis strictly as a JSON object matching this schema:
{
  "appName": "string",
  "safetyStatus": "Clean" | "Low Risk" | "Medium Risk" | "High Risk",
  "safetyScore": number (0-100),
  "findings": [
    {
      "type": "string (e.g. Permission Abuse, Keylogger Check, Adware, Spyware)",
      "status": "Passed" | "Warning" | "Failed",
      "details": "string (explain findings in both Khmer and English)"
    }
  ],
  "verdict": "string (overall verdict statement in Khmer with English translation. Make it sound professional and reassuring.)"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["appName", "safetyStatus", "safetyScore", "findings", "verdict"],
          properties: {
            appName: { type: Type.STRING },
            safetyStatus: { type: Type.STRING },
            safetyScore: { type: Type.INTEGER },
            findings: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["type", "status", "details"],
                properties: {
                  type: { type: Type.STRING },
                  status: { type: Type.STRING },
                  details: { type: Type.STRING }
                }
              }
            },
            verdict: { type: Type.STRING }
          }
        }
      }
    });

    const reportText = response.text || "{}";
    const report = JSON.parse(reportText.trim());
    res.json(report);
  } catch (error: any) {
    console.error("Scanning API Error:", error);
    res.status(500).json({ error: error.message || "An error occurred during security scan." });
  }
});

// 2. API: 24/7 Support Live Chat
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      return res.json({
        reply: "សួស្តី! ខ្ញុំជាជំនួយការបច្ចេកទេសនិម្មិតរបស់ Khmer App Store។ ខ្ញុំមានវត្តមាននៅទីនេះដើម្បីជួយអ្នក ២៤ម៉ោងលើ២៤ម៉ោង។ (សុំទោស គន្លឹះ API មិនទាន់បានកំណត់ទេ ដូច្នេះនេះគឺជាការឆ្លើយតបគំរូ!) តើអ្នកមានចម្ងល់អ្វីខ្លះអំពីការទាញយក ការពិនិត្យមេរោគ ឬការបម្រុងទុកទិន្នន័យ?",
        isMock: true
      });
    }

    const ai = getGeminiClient();

    // Map message history to chat format or feed it directly as dialogue to generateContent.
    // Let's build a clean prompt containing the dialogue history.
    const formattedHistory = messages
      .map((m: any) => `${m.sender === "user" ? "User" : "Support Assistant"}: ${m.text}`)
      .join("\n");

    const prompt = `You are a professional, friendly, and expert 24/7 technical support specialist for "Khmer App Store".
You assist users with issues or questions about:
1. Downloading and updating applications on the Khmer App Store.
2. The automatic virus and malware scan engine (how it detects keyloggers, dangerous permissions, or spyware).
3. Safe data backups and secure cross-device synchronization (iPhone, iPad, Mac, Android, Windows).
4. Authenticating and verifying developer signatures.

CRITICAL: Speak primarily in warm, polite Khmer (ភាសាខ្មែរ), but you can include English translations or subtitles if helpful. Always maintain a helpful, welcoming, and high-tech tone. Be polite and professional.

Conversation history:
${formattedHistory}
Support Assistant:`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });

    res.json({ reply: response.text || "សូមអភ័យទោស ខ្ញុំមិនយល់ពីសំនួររបស់អ្នកទេ។" });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    res.status(500).json({ error: error.message || "An error occurred in support chat." });
  }
});

// Serve frontend application
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

setupServer();
