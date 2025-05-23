import mongoose, { Schema, model } from "mongoose";

mongoose.connect("mongodb+srv://gauravpantind:YIRPNWs3VQMWAKGO@gauravprac.uovqs.mongodb.net/brainly2");

const UserSchema = new Schema({
  username: { type: String, unique: true },
  password: String
});

export const UserModel = model("User", UserSchema);

const ContentSchema = new Schema({
  title: String,
  link: String,
  tags: [{ type: mongoose.Types.ObjectId, ref: "Tag" }],
  type:String,
  userId: { type: mongoose.Types.ObjectId, ref: "User" }
});

export const ContentModel = model("Content", ContentSchema);

const LinkSchema = new Schema({
  hash: String,
  userId: { type: mongoose.Types.ObjectId, ref: "User", required: true, unique: true }
});

export const LinkModel = model("Link", LinkSchema);
