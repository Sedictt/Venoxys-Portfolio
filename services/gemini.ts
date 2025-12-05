
import { GoogleGenAI, Chat } from "@google/genai";
import { PORTFOLIO_DATA } from "../constants";

// Prepare context for the AI
const SYSTEM_INSTRUCTION = `
You are an AI assistant for ${PORTFOLIO_DATA.name}'s portfolio website. 
Your goal is to answer questions about ${PORTFOLIO_DATA.name} based on the provided resume data.

Here is the context about ${PORTFOLIO_DATA.name}:
Title: ${PORTFOLIO_DATA.title}
Bio: ${PORTFOLIO_DATA.bio}
Location: ${PORTFOLIO_DATA.location}
Email: ${PORTFOLIO_DATA.email}

General Expertise (Services):
${PORTFOLIO_DATA.services.map(s => `- ${s.title}: ${s.description}`).join('\n')}

Technical Skills & Tools:
${PORTFOLIO_DATA.skills.map(s => `- ${s.name} (${s.category})`).join('\n')}

Experience:
${PORTFOLIO_DATA.experience.map(e => `- ${e.role} at ${e.company} (${e.period}):\n  ${e.description.join('\n  ')}`).join('\n')}

Education:
${PORTFOLIO_DATA.education.map(e => `- ${e.degree} at ${e.school} (${e.period})`).join('\n')}

Projects:
${PORTFOLIO_DATA.projects.map(p => `- ${p.title}: ${p.description} (Tech: ${p.technologies.join(', ')})`).join('\n')}

Guidelines:
- Be professional, polite, and enthusiastic.
- Keep answers concise but informative.
- If asked about contact info, provide the email.
- If asked about something not in the data, politely say you don't have that information but suggest contacting ${PORTFOLIO_DATA.name} directly.
- Do not make up facts.
`;

let chatSession: Chat | null = null;

export const getChatSession = (): Chat => {
  if (chatSession) return chatSession;

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }

  const ai = new GoogleGenAI({ apiKey });

  chatSession = ai.chats.create({
    model: 'gemini-2.0-flash',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
    },
  });

  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  try {
    const session = getChatSession();
    const result = await session.sendMessage({ message });
    return result.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const generateProjectDetails = async (currentTitle?: string, category: string = 'Applications'): Promise<any> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found");

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
      You are an expert creative director and technical lead.
      Generate a creative and realistic project idea and its details for a portfolio.
      
      Project Category: "${category}"
      ${currentTitle ? `Project Title: "${currentTitle}"` : "Create a random, impressive title."}
      
      Context based on category:
      - If 'Applications': Focus on tech stack, features, and user problem/solution.
      - If 'Photography'/'Art'/'Graphic Design': Focus on visual style, composition, tools (Camera, Photoshop, etc.), and artistic concept.
      - If 'Video Editing': Focus on narrative, pacing, software (Premiere, After Effects), and visual effects.

      Provide the output as a valid JSON object with the following fields:
      - title: string (The project title)
      - description: string (A catchy tagline or short summary, max 100 chars)
      - challenge: string (The creative or technical challenge faced, max 300 chars)
      - aiDescription: string (The solution/approach. For Art/Photo, describe the artistic intent. For Apps, the technical solution. Max 400 chars)
      - technologies: string[] (List of 3-5 tools/technologies used. e.g., "React, Node" or "Sony A7III, Lightroom" or "Adobe Illustrator")
      - aiToolsUsed: string[] (List of 2-4 AI tools if applicable, or just standard tools if not. e.g., "Midjourney" or "Photoshop AI")
      - features: string[] (List of 3-4 key features or visual elements)
      - developmentTime: string (e.g., "2 Weeks", "3 Days")
      - demoUrl: string (Use a placeholder like "https://demo.example.com" or portfolio link)
      - repoUrl: string (Use a placeholder like "https://github.com/username/project" or leave empty for non-code)
      
      Ensure the content is professional and sounds like a high-quality portfolio entry.
      Do not include markdown formatting (like \`\`\`json), just the raw JSON string.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    // Clean up markdown if present
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};