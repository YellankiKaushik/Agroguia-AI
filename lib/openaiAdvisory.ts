import { DEFAULT_ADVISORY, mergeAdvisoryWithDefaults, type AdvisoryPayload } from "@/lib/advisoryDefaults";

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const OPENAI_MODEL = process.env.OPENAI_ADVISORY_MODEL || "gpt-4.1-mini";

function getOpenAIKey(): string {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    throw new Error("Missing OPENAI_API_KEY environment variable");
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
    "You are KISAN.AI farm advisory engine.",
    "Return only valid JSON (no markdown).",
    "Produce realistic Indian agriculture advisory output for dashboard consumption.",
    "Include these top-level keys exactly:",
    "farmer_summary, weather_advisory, pest_advisory, protection_plan, market_intelligence, government_schemes, insurance_status, loan_advisory, waste_value, total_income_projection, voice_summaries.",
    "Use concise actionable recommendations.",
    "For weather_advisory, pest_advisory, protection_plan, market_intelligence, government_schemes, insurance_status, loan_advisory, waste_value:",
    "return JSON objects (not plain text).",
  ].join(" ");
}

function buildUserPrompt(message: string): string {
  return [
    "Generate a complete advisory JSON for this farmer context.",
    "Farmer context:",
    message,
  ].join("\n");
}

export async function generateAdvisoryFromOpenAI(message: string): Promise<{
  advisory: AdvisoryPayload;
  rawText?: string;
  error?: string;
}> {
  try {
    const apiKey = getOpenAIKey();
    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
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
        error: `OpenAI request failed (${response.status})`,
        rawText: errText,
      };
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content || typeof content !== "string") {
      return {
        advisory: DEFAULT_ADVISORY,
        error: "OpenAI response missing content",
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
      error: error?.message || "OpenAI advisory generation failed",
    };
  }
}
