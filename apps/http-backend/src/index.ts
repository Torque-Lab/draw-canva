import express from "express";
import jwt from "jsonwebtoken";
import { middleware } from "./middleware";
import { JWT_SECRET } from "@repo/backend-common/config";
import { createUserSchema, roomSchema, SignInSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";

const app = express();
app.use(express.json());
//@ts-ignore
app.post("/signup", async (req, res) => {
  const parsedData = createUserSchema.safeParse(req.body);
  if (!parsedData.success) {
    return res.json({
      message: "Invalid input",
    });
    return;
  }

  //db call
  try {
    const user = await prismaClient.user.create({
      data: {
        email: parsedData.data?.username,
        //hash password
        password: parsedData.data?.password,
        name: parsedData.data.name,
      },
    });
    res.json({
      userId: user.id,
    });
  } catch (e) {
    res.status(411).json({
      message: "User already exists",
    });
  }
});

//@ts-ignore
app.post("/signin", async (req, res) => {
  const parsedData = SignInSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.json({
      message: "Incorrect",
    });
    return;
  }
  // compare password with hashPassword
  const user = await prismaClient.user.findFirst({
    where: {
      email: parsedData.data.username,
      password: parsedData.data.password,
    },
  });
  if (!user) {
    res.status(403).json({
      message: "Not authorised",
    });
    return;
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET);

  res.json({
    token,
  });
});

//@ts-ignore
app.post("/room", middleware, async (req, res) => {
  const parsedData = roomSchema.safeParse(req.body);

  if (!parsedData.success) {
    res.json({
      messages: "Incorrect input",
    });
    return;
  }
  // @ts-ignore
  const userId = req.userId;
  if (!userId) {
    res.status(400).json({
      message: "User ID is required",
    });
    return;
  }
  try {
    const room = await prismaClient.room.create({
      data: {
        slug: parsedData.data.room,
        adminId: userId,
      },
    });

    res.json({
      roomId: room.id,
    });
  } catch (e) {
    res.status(403).json({
      messages: "room already exists with this name",
    });
  }
});

app.get("/chats/:roomId", async (req, res) => {
  try {
    const roomId = Number(req.params.roomId);
    const messages = await prismaClient.chat.findMany({
      where: {
        roomId: roomId,
      },
      orderBy: {
        id: "desc",
      },
      take: 50,
    });

    res.json({
      messages,
    });
  } catch (e) {
    console.log("error in chats", e);
  }
});

app.get("/room/:slug", async (req, res) => {
  const slug = req.params.slug;
  try {
    const room = await prismaClient.room.findFirst({
      where: {
        slug: slug,
      },
    });
    res.json({
      room,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while fetching the room",
    });
  }
});
app.listen(3005);
console.log("server stated at post 3005");
