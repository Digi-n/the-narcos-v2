import Groq from "groq-sdk";
import { CONFIG } from "../../config/config";
import { MAFIA_PERSONA } from "../../config/botContext";

let groq: Groq;

try {
    groq = new Groq({ apiKey: CONFIG.GROQ_API_KEY });
} catch (error) {
    console.error("Failed to initialize Groq AI:", error);
}

export async function getMafiaReply(username: string, userMessage: string): Promise<string> {
    if (!groq) return "The boss is sleeping. (AI not configured correctly)";

    const prompt = `
  ${MAFIA_PERSONA}
  
  User '${username}' asks: "${userMessage}"
  
  Reply as the Consigliere:
  `;

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: MAFIA_PERSONA,
                },
                {
                    role: "user",
                    content: `User '${username}' asks: "${userMessage}"`,
                },
            ],
            model: "llama-3.3-70b-versatile", // Fast and good for personas
            temperature: 0.7,
            max_tokens: 300,
        });

        return chatCompletion.choices[0]?.message?.content || "I have nothing to say.";
    } catch (error) {
        console.error("AI Error:", error);
        return "I cannot speak on that right now. (AI Error)";
    }
}
