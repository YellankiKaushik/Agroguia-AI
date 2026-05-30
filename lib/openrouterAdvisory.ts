import { DEFAULT_ADVISORY, mergeAdvisoryWithDefaults, type AdvisoryPayload } from "@/lib/advisoryDefaults";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "qwen/qwen-2.5-72b-instruct";

function getOpenRouterKey(): string {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) {
    throw new Error("Missing OPENROUTER_API_KEY environment variable");
  }
  return key;
}

function extractJsonObject(text: string): any | null {
  try {
    return JSON.parse(text);
  } catch {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(text.slice(start, end + 1));
      } catch {
        return null;
      }
    }
    return null;
  }
}

function buildSystemPrompt(): string {
  return [
    "You are AGROGUIA.AI farm advisory engine.",
    "Return only valid JSON (no markdown).",
    "Produce realistic Indian agriculture advisory output for dashboard consumption.",
    "Include these top-level keys exactly:",
    "farmer_summary, weather_advisory, pest_advisory, protection_plan, market_intelligence, government_schemes, insurance_status, loan_advisory, waste_value, total_income_projection, voice_summaries.",
    "Use concise actionable recommendations and do not wrap nested objects as strings.",
    "weather_advisory must include summary, risk_level, fungal_risk_flag, fungal_risk_details, todays_actions array, and seven_day_calendar array.",
    "pest_advisory must include summary, primary_disease_name, overall_risk, and threats array.",
    "protection_plan must include summary, spray_plan, fertilizer_plan, and cost_summary.",
    "market_intelligence must include summary and market_intelligence object with mandi_comparison, best_market, sell_or_wait, sell_wait_analysis, msp_status, and storage_advisory.",
    "government_schemes must include summary, enrolled_schemes, missing_schemes, deadline_alerts, and total_potential_benefits.",
    "insurance_status must include summary, eligibility_verdict, document_checklist, expected_payout, and filing_steps.",
    "loan_advisory must include summary, loan_options, best_recommendation, recommendation_reason, and documents_required.",
    "waste_value must include summary, waste_inventory, nearby_buyers, total_waste_income, and composting_guide.",
  ].join(" ");
}

function buildUserPrompt(message: string): string {
  return [
    "Generate a complete advisory JSON for this farmer context.",
    "Farmer context:",
    message,
  ].join("\n");
}

export async function generateAdvisoryFromOpenRouter(message: string): Promise<{
  advisory: AdvisoryPayload;
  rawText?: string;
  error?: string;
}> {
  try {
    const apiKey = getOpenRouterKey();
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        temperature: 0.4,
        messages: [
          { role: "system", content: buildSystemPrompt() },
          { role: "user", content: buildUserPrompt(message) },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return {
        advisory: DEFAULT_ADVISORY,
        error: `OpenRouter request failed (${response.status})`,
        rawText: errText,
      };
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content || typeof content !== "string") {
      return {
        advisory: DEFAULT_ADVISORY,
        error: "OpenRouter response missing content",
      };
    }

    const parsed = extractJsonObject(content);
    if (!parsed) {
      return {
        advisory: DEFAULT_ADVISORY,
        error: "Failed to parse model JSON output",
        rawText: content,
      };
    }

    return {
      advisory: mergeAdvisoryWithDefaults(parsed),
      rawText: content,
    };
  } catch (error: any) {
    return {
      advisory: DEFAULT_ADVISORY,
      error: error?.message || "OpenRouter advisory generation failed",
    };
  }
}
