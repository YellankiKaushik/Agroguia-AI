import { Schema, models, model, type Model } from "mongoose";
import { connectDB } from "@/lib/db";

const FertilizerTrackerSchema = new Schema({
  user_id: { type: String, required: true },
  season: { type: String },
  crop: { type: String },
  applications: { type: Array },
  total_applied_vs_recommended: { type: String },
});

type FertilizerTrackerModelType = Model<any>;

export default async function getFertilizerTrackerModel(): Promise<FertilizerTrackerModelType> {
  await connectDB();
  return (models.FertilizerTracker || model("FertilizerTracker", FertilizerTrackerSchema)) as FertilizerTrackerModelType;
}
