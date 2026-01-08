const OpenAI = require("openai");
const CHAT_STATES = require("./chatState.constants");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Generate AI response
 */
async function generateAIResponse({
  state,
  ragContext,
  history = [],
  userMessage = "",
  intent,
  systemHint = ""
}) {
  // ✅ FORCE EVERYTHING TO STRING
  const safeRagContext = typeof ragContext === "string" ? ragContext : "";
  const safeUserMessage = typeof userMessage === "string" ? userMessage : "";
  const safeSystemHint = typeof systemHint === "string" ? systemHint : "";

  const SYSTEM_PROMPT = `
You are a PROFESSIONAL AI SALES ASSISTANT.

STRICT RULES (YOU MUST FOLLOW ALL):
- You are NOT a general chatbot.
- You represent ONLY this company.
- NEVER end the conversation politely.
- NEVER say:
  "Thank you for your interest"
  "Thank you for your engagement"
  "Feel free to ask"
  "Have a great day"
- ALWAYS answer the user's question directly.
- If the user asks about PRICE → you MUST mention the price.
- If product data exists → you MUST use it.
- NEVER invent information.
- After answering, ALWAYS ask ONE short sales follow-up question.
- Be confident, clear, and sales-focused.
- If the user says they are not interested, not buying, or wants to stop:
  - Acknowledge politely
  - Stop selling immediately
  - Do NOT push products again
  - Respond briefly and end the conversation naturally

- If the user says "thank you", "no thanks", "later", or similar:
  - Respect the decision
  - Do NOT continue sales questions


CURRENT CHAT STATE: ${state}
CURRENT USER INTENT: ${intent}

${safeSystemHint}

ONLY use the information below:
${safeRagContext}
`;

  // ✅ CLEAN HISTORY (NO NULLS)
  const safeHistory = (history || [])
    .filter(h => typeof h?.content === "string" && h.content.trim() !== "")
    .map(h => ({
      role: h.role === "user" ? "user" : "assistant",
      content: h.content
    }));

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...safeHistory,
    { role: "user", content: safeUserMessage }
  ];

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    temperature: 0.2
  });

  return response.choices[0].message.content;
}

module.exports = {
  generateAIResponse
};

