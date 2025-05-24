import express from "express";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "./config";
import { UserModel, ContentModel, LinkModel } from "./db";
import { userMiddleware, AuthenticatedRequest } from "./middleware";
import { random } from "./utils";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.post("/api/v1/signup", async (req, res) => {
  const { username, password } = req.body;

  try {
    await UserModel.create({ username, password });
    res.json({ message: "User signed up" });
  } catch (e) {
    res.status(411).json({ message: "User already exists" });
  }
});

app.post("/api/v1/signin", async (req, res) => {
  const { username, password } = req.body;

  const existingUser = await UserModel.findOne({ username, password });

  if (existingUser) {
    const token = jwt.sign({ id: existingUser._id }, JWT_PASSWORD);
    res.json({ token });
  } else {
    res.status(403).json({ message: "Incorrect credentials" });
  }
});

app.post("/api/v1/content", userMiddleware, async (req: AuthenticatedRequest, res) => {
  const { link, type } = req.body;

  await ContentModel.create({
    link,
    type,
    title:req.body.title,
    userId: req.userId,
    tags: []
  });

  res.json({ message: "Content added" });
});

app.get("/api/v1/content", userMiddleware, async (req: AuthenticatedRequest, res) => {
  const content = await ContentModel.find({ userId: req.userId }).populate("userId", "username");
  res.json({ content });
});

app.delete("/api/v1/content", userMiddleware, async (req: AuthenticatedRequest, res) => {
  const { contentId } = req.body;

  await ContentModel.deleteOne({ _id: contentId, userId: req.userId });

  res.json({ message: "Content deleted" });
});

app.post("/api/v1/brain/share", userMiddleware, async (req: AuthenticatedRequest, res) => {
  const { share } = req.body;

  if (share) {
    const existingLink = await LinkModel.findOne({ userId: req.userId });

    if (existingLink) {
      res.json({ hash: existingLink.hash });
      return;
    }

    const hash = random(10);
    await LinkModel.create({ userId: req.userId, hash });

    res.json({ hash });
  } else {
    await LinkModel.deleteOne({ userId: req.userId });
    res.json({ message: "Removed link" });
  }
});

app.get("/api/v1/brain/shareLink/:shareLink", async (req, res) => {
  const { shareLink } = req.params;

  const link = await LinkModel.findOne({ hash: shareLink });

  if (!link) {
    res.status(411).json({ message: "Sorry, incorrect input" });
    return;
  }

  const content = await ContentModel.find({ userId: link.userId });
  const user = await UserModel.findOne({ _id: link.userId });

  res.json({
    username: user?.username,
    content
  });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
