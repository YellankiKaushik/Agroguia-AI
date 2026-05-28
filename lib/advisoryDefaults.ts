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

export const DEFAULT_ADVISORY: AdvisoryPayload = {
  farmer_summary: {
    name: "Farmer",
    location: "Unknown",
    crop: "Unknown",
    crop_stage: "Unknown",
    land_size: "Unknown",
    overall_risk: "Medium",
  },
  weather_advisory: JSON.stringify({
    todays_actions: [],
    seven_day_calendar: [],
    risk_level: "Medium",
    fungal_risk_flag: false,
    fungal_risk_details: "No critical weather signal available.",
    summary: "Weather advisory unavailable, continue field monitoring.",
  }),
  pest_advisory: JSON.stringify({
    threats: [],
    primary_disease_name: "None",
    overall_risk: "Medium",
    summary: "No specific pest threat identified from current input.",
  }),
  protection_plan: JSON.stringify({
    spray_plan: { chemicals: [], weather_restrictions: "Check local forecast before spraying." },
    fertilizer_plan: { fertilizers: [], cumulative_vs_recommended: "Not available" },
    cost_summary: {
      spray_cost: "0",
      fertilizer_cost: "0",
      total_cost: "0",
      remaining_budget: "Not available",
    },
    summary: "Protection plan generated with conservative defaults.",
  }),
  market_intelligence: JSON.stringify({
    market_intelligence: {
      mandi_comparison: [],
      best_market: "Local mandi",
      sell_or_wait: "Evaluate weekly",
      sell_wait_analysis: "Insufficient data for high-confidence price timing.",
      msp_status: "Verify current MSP locally",
      storage_advisory: "Use dry and ventilated storage.",
    },
    summary: "Market intelligence is currently generic.",
  }),
  government_schemes: JSON.stringify({
    enrolled_schemes: [],
    missing_schemes: [],
    deadline_alerts: [],
    total_potential_benefits: "Not available",
    summary: "Review local state and central agriculture schemes.",
  }),
  insurance_status: JSON.stringify({
    eligibility_verdict: "Unknown",
    document_checklist: [],
    expected_payout: "Not available",
    filing_steps: [],
    summary: "Insurance status needs local policy verification.",
  }),
  loan_advisory: JSON.stringify({
    loan_options: [],
    best_recommendation: "Prefer subsidized agricultural credit",
    recommendation_reason: "Lower interest burden is generally safer.",
    documents_required: [],
    summary: "Loan guidance generated with cautious defaults.",
  }),
  waste_value: JSON.stringify({
    waste_inventory: [],
    nearby_buyers: [],
    total_waste_income: "0",
    composting_guide: {
      steps: [],
      timeline: "Not available",
      soil_benefits: "Organic residue management can improve soil health.",
    },
    summary: "Waste-to-value estimate not available from current input.",
  }),
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

function toJsonString(value: any, fallback: string): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return fallback;
    }
  }
  return fallback;
}

export function mergeAdvisoryWithDefaults(partial: any): AdvisoryPayload {
  const src = partial && typeof partial === "object" ? partial : {};

  return {
    farmer_summary: { ...DEFAULT_ADVISORY.farmer_summary, ...(src.farmer_summary || {}) },
    weather_advisory: toJsonString(src.weather_advisory, DEFAULT_ADVISORY.weather_advisory),
    pest_advisory: toJsonString(src.pest_advisory, DEFAULT_ADVISORY.pest_advisory),
    protection_plan: toJsonString(src.protection_plan, DEFAULT_ADVISORY.protection_plan),
    market_intelligence: toJsonString(src.market_intelligence, DEFAULT_ADVISORY.market_intelligence),
    government_schemes: toJsonString(src.government_schemes, DEFAULT_ADVISORY.government_schemes),
    insurance_status: toJsonString(src.insurance_status, DEFAULT_ADVISORY.insurance_status),
    loan_advisory: toJsonString(src.loan_advisory, DEFAULT_ADVISORY.loan_advisory),
    waste_value: toJsonString(src.waste_value, DEFAULT_ADVISORY.waste_value),
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
