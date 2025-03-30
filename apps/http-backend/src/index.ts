import express from "express";
import jwt from "jsonwebtoken";
import { middleware } from "./middleware";
import { JWT_SECRET } from "@repo/backend-common/config";
import { createUserSchema } from "@repo/common/types";

const app = express();
console.log(JWT_SECRET);
app.post("/signup", (req, res) => {
  const data = createUserSchema.safeParse(req.body);
  if (!data.success) {
    return res.json({
      message: "Invalid input",
    });
  }
  //db call
  res.json({
    roomId: 123,
  });
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
