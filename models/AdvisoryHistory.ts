import { Schema, models, model, type Model } from "mongoose";
import { connectDB } from "@/lib/db";

const AdvisoryHistorySchema = new Schema({
  user_id: { type: String, required: true },
  generated_at: { type: Date, default: Date.now },
  crop: { type: String },
  location: { type: String },
  weather_advisory: { type: String },
  pest_advisory: { type: String },
  protection_plan: { type: String },
  market_intel: { type: String },
  schemes_eligible: { type: String },
  insurance_status: { type: String },
  loan_options: { type: String },
  waste_value: { type: String },
  total_income_projection: { type: String },
  farmer_summary: { type: String },
});

type AdvisoryHistoryModelType = Model<any>;

export default async function getAdvisoryHistoryModel(): Promise<AdvisoryHistoryModelType> {
  await connectDB();
  return (models.AdvisoryHistory || model("AdvisoryHistory", AdvisoryHistorySchema)) as AdvisoryHistoryModelType;
}
