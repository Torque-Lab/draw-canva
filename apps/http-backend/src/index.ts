import express from "express";
import jwt from "jsonwebtoken";
import { middleware } from "./middleware";
import { JWT_SECRET } from "@repo/backend-common/config";
import {
  createUserSchema,
  ForgotSchema,
  ResetSchema,
  roomSchema,
  SignInSchema,
} from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
import cors from "cors";
import bcrypt from "bcrypt";
import { generateOTP, isOTPValid, storeOTP } from "./otp";
import { sendOTPEmail } from "./send";

const app = express();
app.use(express.json());
app.use(cors());
//@ts-ignore
app.post("/signup", async (req, res) => {
  const parsedData = createUserSchema.safeParse(req.body);

  console.log(parsedData.error);
  if (!parsedData.success) {
    return res.json({
      message: "Invalid input",
    });
    return;
  }
  const password = parsedData.data.password;
  const hashPassword = await bcrypt.hash(password, 10);

  //db call
  try {
    const user = await prismaClient.user.create({
      data: {
        email: parsedData.data?.username,
        //hash password
        password: hashPassword,
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
app.post("/forgot", async (req, res) => {
  const parsedData = ForgotSchema.safeParse(req.body);

  if (!parsedData.success) {
    res.json({
      message: "InValidData",
    });
    return;
  }
  const email = parsedData.data.username;
  const user = await prismaClient.user.findFirst({
    where: {
      email,
    },
  });
  if (!user) {
    res.status(403).json({
      message: "Invalid Credentials",
    });
    return;
  }

  if (user) {
    const otp = generateOTP();
    storeOTP(email, otp);
    sendOTPEmail(email, otp);
  }

  return res.json({
    message:
      "if the user is registered,you will recive an OTP with in 5 Minute",
  });
});

//@ts-ignore
app.post("/reset", async (req, res) => {
  const parsedData = ResetSchema.safeParse(req.body);

  if (!parsedData.success) {
    return res.status(400).json({ message: "Invalid data" });
  }
  console.log(parsedData.data);

  const username = parsedData.data.username;
  const otp = parsedData.data.otp;
  const newPassword = parsedData.data.newPassword;

  if (!isOTPValid(username, otp)) {
    return res.status(403).json({ message: "Invalid or expired OTP" });
  }

  const hashPassword = await bcrypt.hash(newPassword, 10);

  await prismaClient.user.update({
    where: { email: username },
    data: { password: hashPassword },
  });

  return res.json({ message: "Password reset successful" });
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
  // find user by email
  const user = await prismaClient.user.findFirst({
    where: {
      email: parsedData.data.username,
    },
  });

  if (!user) {
    res.status(403).json({
      message: "Invalid Credentials",
    });
    return;
  }

  // compare password with hashPassword
  const isPasswordValid = await bcrypt.compare(
    parsedData.data.password,
    user.password
  );

  if (!isPasswordValid) {
    res.status(403).json({
      message: "Invalid Credentials",
    });
    return;
  }
  if (!user) {
    res.status(403).json({
      message: "Invalid Credentials",
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
  console.log(parsedData);

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
