const ChatSessionModel = require("../model/ChatSessionModel");
const ChatMessageModel = require("../model/ChatMessageModel");

const { generateAIResponse } = require("../services/aiChat.service");
const buildRagContext = require("../rag/contextBuilder");

const campaignTransformer = require("../transformers/campaign.transformer");
const companyTransformer = require("../transformers/company.transformer");
const productTransformer = require("../transformers/product.transformer");

const { rawLoader } = require("../mock");

const CHAT_STATES = require("../services/chatState.constants");
const { getNextState } = require("../services/chatState.service");

const detectIntent = require("../services/intent.service");
const { getHistory, saveHistory } = require("../memoryStore");

// ✅ helper: detect DB availability
const DB_ENABLED = !!process.env.DB_HOST;

exports.sendMessage = async (req, res) => {
  try {
    const { session_id, campaign_id, message } = req.body;

    if (!session_id || !campaign_id || !message) {
      return res.status(400).json({
        reply: "session_id, campaign_id and message are required"
      });
    }

    /* --------------------------------------------------
       1️⃣ Load history (DB → fallback memory)
    -------------------------------------------------- */
    let history = [];

    if (DB_ENABLED) {
      history = await ChatMessageModel.getLastMessages(session_id, 6);
    } else {
      history = getHistory(session_id);
    }

    /* --------------------------------------------------
       2️⃣ Detect intent (context-aware)
    -------------------------------------------------- */
    const intent = await detectIntent(message, history);

    /* --------------------------------------------------
       3️⃣ Find or create session (DB only)
    -------------------------------------------------- */
    let session = null;

    if (DB_ENABLED) {
      session = await ChatSessionModel.findBySessionId(session_id);

      if (!session) {
        const { rawCompany } =
          rawLoader.loadByCampaignId(campaign_id);

        await ChatSessionModel.create({
          sessionId: session_id,
          campaignId: campaign_id,
          companyId: rawCompany.companyId || 1
        });

        session = await ChatSessionModel.findBySessionId(session_id);
      }
    }

    const currentState =
      session?.current_state || CHAT_STATES.INIT;

    /* --------------------------------------------------
       4️⃣ Load campaign data (STATIC – SAFE)
    -------------------------------------------------- */
    const { rawCampaign, rawCompany, rawProducts } =
      rawLoader.loadByCampaignId(campaign_id);

    const campaign = campaignTransformer(rawCampaign);
    const company = companyTransformer(rawCompany);
    const allProducts = productTransformer(rawProducts);

    const products = allProducts.filter(p =>
      campaign.productIds.includes(p.productId)
    );

    /* --------------------------------------------------
       5️⃣ Decide next state
    -------------------------------------------------- */
    const nextState = getNextState({
      currentState,
      campaign
    });

    /* --------------------------------------------------
       6️⃣ Save USER message
    -------------------------------------------------- */
    if (DB_ENABLED) {
      await ChatMessageModel.save({
        sessionId: session_id,
        role: "user",
        content: message,
        intent
      });
    } else {
      saveHistory(session_id, message, null);
    }

    /* --------------------------------------------------
       7️⃣ Build RAG context
    -------------------------------------------------- */
    const ragContext = buildRagContext({
      campaign,
      company,
      products
    });

    /* --------------------------------------------------
       8️⃣ Intent-based system hint
    -------------------------------------------------- */
    let systemHint = "";

    if (intent === "OFFER_QUERY") {
      systemHint =
        "User is asking about offers. Show discounted products with prices.";
    }

    if (intent === "PRODUCT_QUERY" || intent === "PRODUCT_FOLLOWUP") {
      systemHint =
        "User wants product details. Stay on the same product and explain clearly.";
    }

    if (intent === "PRICE_QUERY") {
      systemHint =
        "User is asking about price. Mention exact prices and offers.";
    }

    if (intent === "IDENTITY_QUERY") {
      systemHint =
        `You are an AI sales assistant for ${company.name}. Explain who you are.`;
    }

    /* --------------------------------------------------
       9️⃣ Generate AI reply
    -------------------------------------------------- */
    const reply = await generateAIResponse({
      state: nextState,
      ragContext,
      history,
      userMessage: message,
      intent,
      systemHint
    });

    /* --------------------------------------------------
       🔟 Save AI reply + update state
    -------------------------------------------------- */
    if (DB_ENABLED) {
      await ChatMessageModel.save({
        sessionId: session_id,
        role: "assistant",
        content: reply
      });

      await ChatSessionModel.updateState(session_id, nextState);
    } else {
      saveHistory(session_id, message, reply);
    }

    res.json({ reply });

  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ reply: "Server error" });
  }
};
