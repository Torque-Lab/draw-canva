import { WebSocketServer, WebSocket } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
const wss = new WebSocketServer({ port: 8080 });
import { prismaClient } from "@repo/db/client";
interface User {
  ws: WebSocket;
  rooms: string[];
  userId: string;
}
// store socket object
const users: User[] = [];
/*
   [
 {
   ws:WebSocket,
   rooms:["room1","rooms2"],
    userId:1,
  
 },
 {
  ws:WebSocket,
   rooms:["room1","rooms2","rooms3"],
   userId:2,
 }
   ]
 
 
 */

function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded == "string") {
      return null;
    }
    if (!decoded || !decoded.userId) {
      return null;
    }
    return decoded.userId;
  } catch (e) {
    return null;
  }
}
wss.on("connection", function connection(ws, request) {
  console.log("someone connected with me");
  const url = request.url; // wss://localhost:3000?token=736545
  if (!url) {
    return;
  }
  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") || "";
  const userId = checkUser(token);
  if (userId == null) {
    ws.close;
    return null;
  }
  //sate management on the backend
  // All ws object  of user will be stored in-inmemory
  //satefull Websocket server

  users.push({
    ws,
    rooms: [],
    userId,
  });
  ws.on("message", async function message(data) {
    const parsedData = JSON.parse(data as unknown as string);

    if (parsedData.type === "join_room") {
      //check is room exits or not(further task )
      const user = users.find((x) => x.ws === ws);
      user?.rooms.push(parsedData.roomId);
    }

    if (parsedData.type === "leave_room") {
      const user = users.find((x) => x.ws === ws);
      if (!user) {
        return;
      }
      user.rooms = user?.rooms.filter((x) => x === parsedData.room);
    }

    if (parsedData.type === "chat") {
      const roomId = parsedData.roomId;
      const message = parsedData.message;

      // this ugly way as take time to do db call and there will be delay to broadcast as controll stuck here, better is Queue
      // pipeline do db
      await prismaClient.chat.create({
        data: {
          roomId,
          message,
          userId,
        },
      });
      users.forEach((user) => {
        if (user.rooms.includes(roomId)) {
          user.ws.send(
            JSON.stringify({
              type: "chat",
              message: message,
              roomId,
            })
          );
        }
      });
    }
  });
});
