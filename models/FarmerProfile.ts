import mongoose, { Schema, models, model } from "mongoose";
import { connectDB } from "@/lib/db";

const FarmerProfileSchema = new Schema({
  user_id: { type: String },
  name: { type: String },
  location_district: { type: String },
  location_state: { type: String },
  location_village: { type: String },
  land_size_acres: { type: Number },
  soil_type: { type: String },
  current_crop: { type: String },
  crop_stage: { type: String },
  sowing_date: { type: String },
  irrigation_type: { type: String },
  bank_account_status: { type: String },
  insurance_policy: { type: String },
  loan_status: { type: String },
  budget_inputs: { type: Number },
  preferred_language: { type: String, default: "English" },
  phone: { type: String },
});

type FarmerProfileModelType = ReturnType<typeof model>;

export default async function getFarmerProfileModel(): Promise<FarmerProfileModelType> {
  await connectDB();
  return (models.FarmerProfile || model("FarmerProfile", FarmerProfileSchema)) as FarmerProfileModelType;
}
