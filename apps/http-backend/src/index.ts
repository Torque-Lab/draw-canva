import express from "express";
import jwt from "jsonwebtoken";
import { middleware } from "./middleware";
import { JWT_SECRET } from "@repo/backend-common/config";
import { createUserSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";

const app = express();
console.log(JWT_SECRET);
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
    await prismaClient.user.create({
      data: {
        email: parsedData.data?.username,
        password: parsedData.data?.password,
        name: parsedData.data.name,
      },
    });
  } catch (e) {
    res.status(411).json({
      message: "User already exists",
    });
  }
});

//@ts-ignore
app.post("signin", (req, res) => {
  const userId = req.body;
  if (!JWT_SECRET) {
    return res.status(500).send("JWT_SECRET is not defined");
  }
  const token = jwt.sign({ userId }, JWT_SECRET);
  res.json({
    token,
  });
});

//@ts-ignore
app.post("/room", middleware, (req, res) => {
  //db call
  res.json({
    roomId: 123,
  });
});
app.listen(3005);
console.log("server stated");
