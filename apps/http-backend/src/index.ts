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
app.post("signin", async (req, res) => {
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

  const token = jwt.sign({ useId: user.id }, JWT_SECRET);

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
  const useId = req.userId;
  await prismaClient.room.create({
    data: {
      slug: parsedData.data.room,
      adminId: useId,
    },
  });

  res.json({
    roomId: 123,
  });
});
app.listen(3005);
console.log("server stated");
