
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
    model: 'gemini-2.5-flash',
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