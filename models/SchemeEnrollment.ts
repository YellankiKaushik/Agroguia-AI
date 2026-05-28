import { Schema, models, model, type Model } from "mongoose";
import { connectDB } from "@/lib/db";

const SchemeEnrollmentSchema = new Schema({
  user_id: { type: String, required: true },
  scheme_name: { type: String },
  status: { type: String, enum: ["enrolled", "pending", "eligible"] },
  applied_date: { type: String },
  benefit_amount: { type: String },
});

type SchemeEnrollmentModelType = Model<any>;

export default async function getSchemeEnrollmentModel(): Promise<SchemeEnrollmentModelType> {
  await connectDB();
  return (models.SchemeEnrollment || model("SchemeEnrollment", SchemeEnrollmentSchema)) as SchemeEnrollmentModelType;
}
