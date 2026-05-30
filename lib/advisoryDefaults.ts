export type AdvisoryRecord = Record<string, any>;

export type AdvisoryPayload = {
  farmer_summary: AdvisoryRecord;
  weather_advisory: string;
  pest_advisory: string;
  protection_plan: string;
  market_intelligence: string;
  government_schemes: string;
  insurance_status: string;
  loan_advisory: string;
  waste_value: string;
  total_income_projection: AdvisoryRecord;
  voice_summaries: AdvisoryRecord;
};

const DEFAULT_WEATHER_ADVISORY = {
  todays_actions: [],
  seven_day_calendar: [],
  risk_level: "Medium",
  fungal_risk_flag: false,
  fungal_risk_details: "No critical weather signal available.",
  summary: "Weather advisory unavailable, continue field monitoring.",
};

const DEFAULT_PEST_ADVISORY = {
  threats: [],
  primary_disease_name: "None",
  overall_risk: "Medium",
  summary: "No specific pest threat identified from current input.",
};

const DEFAULT_PROTECTION_PLAN = {
  spray_plan: { chemicals: [], weather_restrictions: "Check local forecast before spraying." },
  fertilizer_plan: { fertilizers: [], cumulative_vs_recommended: "Not available" },
  cost_summary: {
    spray_cost: "0",
    fertilizer_cost: "0",
    total_cost: "0",
    remaining_budget: "Not available",
  },
  summary: "Protection plan generated with conservative defaults.",
};

const DEFAULT_MARKET_INTELLIGENCE = {
  market_intelligence: {
    mandi_comparison: [],
    best_market: "Local mandi",
    sell_or_wait: "Evaluate weekly",
    sell_wait_analysis: "Insufficient data for high-confidence price timing.",
    msp_status: "Verify current MSP locally",
    storage_advisory: "Use dry and ventilated storage.",
  },
  summary: "Market intelligence is currently generic.",
};

const DEFAULT_GOVERNMENT_SCHEMES = {
  enrolled_schemes: [],
  missing_schemes: [],
  deadline_alerts: [],
  total_potential_benefits: "Not available",
  summary: "Review local state and central agriculture schemes.",
};

const DEFAULT_INSURANCE_STATUS = {
  eligibility_verdict: "Unknown",
  document_checklist: [],
  expected_payout: "Not available",
  filing_steps: [],
  summary: "Insurance status needs local policy verification.",
};

const DEFAULT_LOAN_ADVISORY = {
  loan_options: [],
  best_recommendation: "Prefer subsidized agricultural credit",
  recommendation_reason: "Lower interest burden is generally safer.",
  documents_required: [],
  summary: "Loan guidance generated with cautious defaults.",
};

const DEFAULT_WASTE_VALUE = {
  waste_inventory: [],
  nearby_buyers: [],
  total_waste_income: "0",
  composting_guide: {
    steps: [],
    timeline: "Not available",
    soil_benefits: "Organic residue management can improve soil health.",
  },
  summary: "Waste-to-value estimate not available from current input.",
};

export const DEFAULT_ADVISORY: AdvisoryPayload = {
  farmer_summary: {
    name: "Farmer",
    location: "Unknown",
    crop: "Unknown",
    crop_stage: "Unknown",
    land_size: "Unknown",
    overall_risk: "Medium",
  },
  weather_advisory: JSON.stringify(DEFAULT_WEATHER_ADVISORY),
  pest_advisory: JSON.stringify(DEFAULT_PEST_ADVISORY),
  protection_plan: JSON.stringify(DEFAULT_PROTECTION_PLAN),
  market_intelligence: JSON.stringify(DEFAULT_MARKET_INTELLIGENCE),
  government_schemes: JSON.stringify(DEFAULT_GOVERNMENT_SCHEMES),
  insurance_status: JSON.stringify(DEFAULT_INSURANCE_STATUS),
  loan_advisory: JSON.stringify(DEFAULT_LOAN_ADVISORY),
  waste_value: JSON.stringify(DEFAULT_WASTE_VALUE),
  total_income_projection: {
    harvest_income: "0",
    waste_income: "0",
    scheme_benefits: "0",
    total_annual: "0",
  },
  voice_summaries: {
    weather: "Weather update unavailable.",
    pest: "Pest update unavailable.",
    protection: "Protection guidance unavailable.",
    market: "Market guidance unavailable.",
    schemes: "Scheme guidance unavailable.",
    insurance: "Insurance guidance unavailable.",
    loans: "Loan guidance unavailable.",
    fraud: "Fraud awareness summary unavailable.",
    waste: "Waste-value summary unavailable.",
  },
};

function parseJsonObject(value: any): AdvisoryRecord | null {
  if (!value) return null;
  if (typeof value === "object" && !Array.isArray(value)) return value;
  if (typeof value !== "string") return null;

  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function firstTextValue(source: AdvisoryRecord, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }
  return undefined;
}

function normalizeJsonModule(
  value: any,
  fallback: AdvisoryRecord,
  summaryKeys: string[] = []
): string {
  const source = parseJsonObject(value);
  const merged = {
    ...fallback,
    ...(source ?? {}),
  };

  if (source && (!source.summary || source.summary === fallback.summary)) {
    merged.summary = firstTextValue(source, summaryKeys) ?? merged.summary ?? fallback.summary;
  }

  try {
    return JSON.stringify(merged);
  } catch {
    return JSON.stringify(fallback);
  }
}

export function mergeAdvisoryWithDefaults(partial: any): AdvisoryPayload {
  const src = partial && typeof partial === "object" ? partial : {};

  return {
    farmer_summary: { ...DEFAULT_ADVISORY.farmer_summary, ...(src.farmer_summary || {}) },
    weather_advisory: normalizeJsonModule(src.weather_advisory, DEFAULT_WEATHER_ADVISORY, [
      "summary",
      "recommendations",
      "forecast",
      "current_conditions",
    ]),
    pest_advisory: normalizeJsonModule(src.pest_advisory, DEFAULT_PEST_ADVISORY, [
      "summary",
      "recommendations",
      "current_status",
    ]),
    protection_plan: normalizeJsonModule(src.protection_plan, DEFAULT_PROTECTION_PLAN, [
      "summary",
      "disease_control",
      "pest_control",
      "weeding",
    ]),
    market_intelligence: normalizeJsonModule(src.market_intelligence, DEFAULT_MARKET_INTELLIGENCE, [
      "summary",
      "recommendations",
      "price_trends",
    ]),
    government_schemes: normalizeJsonModule(src.government_schemes, DEFAULT_GOVERNMENT_SCHEMES, [
      "summary",
      "benefits",
      "application_process",
    ]),
    insurance_status: normalizeJsonModule(src.insurance_status, DEFAULT_INSURANCE_STATUS, [
      "summary",
      "recommendations",
      "current_status",
    ]),
    loan_advisory: normalizeJsonModule(src.loan_advisory, DEFAULT_LOAN_ADVISORY, [
      "summary",
      "recommendations",
      "application_process",
    ]),
    waste_value: normalizeJsonModule(src.waste_value, DEFAULT_WASTE_VALUE, [
      "summary",
      "recommendations",
      "value_addition",
      "organic_waste",
    ]),
    total_income_projection: {
      ...DEFAULT_ADVISORY.total_income_projection,
      ...(src.total_income_projection || {}),
    },
    voice_summaries: {
      ...DEFAULT_ADVISORY.voice_summaries,
      ...(src.voice_summaries || {}),
    },
  };
}
