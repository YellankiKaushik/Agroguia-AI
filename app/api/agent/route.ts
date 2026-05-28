import { NextRequest, NextResponse } from "next/server";
import { generateAdvisoryFromOpenRouter } from "@/lib/openrouterAdvisory";
import { mergeAdvisoryWithDefaults } from "@/lib/advisoryDefaults";

type NormalizedAgentResponse = {
  status: "success" | "error";
  result: Record<string, any>;
  message?: string;
  metadata?: Record<string, any>;
};

function makeResponsePayload(
  advisory: Record<string, any>,
  agent_id?: string,
  user_id?: string,
  session_id?: string,
  warning?: string,
  rawText?: string
) {
  const normalized: NormalizedAgentResponse = {
    status: "success",
    result: mergeAdvisoryWithDefaults(advisory),
    message: warning || "Advisory generated successfully",
    metadata: {
      engine: "openrouter-sync",
      provider: "openrouter",
      agent_id: agent_id || "local-advisory-engine",
      user_id: user_id || null,
      session_id: session_id || null,
      timestamp: new Date().toISOString(),
    },
  };

  return {
    success: true,
    response: normalized,
    module_outputs: undefined,
    timestamp: new Date().toISOString(),
    raw_response: rawText || JSON.stringify(normalized.result),
  };
}

async function handleSubmit(body: any) {
  const { message, agent_id, user_id, session_id } = body || {};

  if (!message || !agent_id) {
    return NextResponse.json(
      {
        success: false,
        response: { status: "error", result: {}, message: "message and agent_id are required" },
        error: "message and agent_id are required",
      },
      { status: 400 }
    );
  }

  const { advisory, error, rawText } = await generateAdvisoryFromOpenRouter(String(message));
  const payload = makeResponsePayload(advisory, agent_id, user_id, session_id, error, rawText);
  return NextResponse.json(payload);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return handleSubmit(body);
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        response: {
          status: "error",
          result: {},
          message: error?.message || "Server error",
        },
        error: error?.message || "Server error",
      },
      { status: 500 }
    );
  }
}
