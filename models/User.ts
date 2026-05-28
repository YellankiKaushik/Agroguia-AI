import { Schema, models, model, type Model } from "mongoose";
import { connectDB } from "@/lib/db";

const UserSchema = new Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    username: { type: String, unique: true, sparse: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

type UserModelType = Model<any>;

export default async function getUserModel(): Promise<UserModelType> {
  await connectDB();
  return (models.User || model("User", UserSchema)) as UserModelType;
}
