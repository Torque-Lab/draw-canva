"use client";

import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import { json } from "stream/consumers";

export function ChatRoomClient({
  messages,
  id,
}: {
  messages: { message: string }[];
  id: string;
}) {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4YTVhNDU0Ni02MTEwLTRjMGItYjc5YS0yODMwNzY2MGViZWYiLCJpYXQiOjE3NDM0MjE1NTJ9.VMp02JNJ6ctPm1bHUxuANUp2ci6aTDOe8AHvyS9gJ9Q"; // Replace with the actual token
  const { socket, loading } = useSocket(token);
  const [chat, setChat] = useState(messages);
  const [currentMessage, setCurrentMessage] = useState("");

  useEffect(() => {
    if (socket && !loading) {
      socket.send(
        JSON.stringify({
          type: "join_room",
          roomId: id,
        })
      );
      socket.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);
        if (parsedData.type === "chat") {
          setChat((c) => [...c, { message: parsedData.message }]);
        }
      };
    }
  }, [socket, loading, id]);

  return (
    <div>
      {chat.map((m) => (
        <div>{m.message}</div>
      ))}
      <input
        type="text"
        value={currentMessage}
        onChange={(e) => {
          setCurrentMessage(e.target.value);
        }}
      ></input>
      <button
        onClick={() => {
          socket?.send(
            JSON.stringify({
              type: "chat",
              roomId: id,
              messages: currentMessage,
            })
          );
          setCurrentMessage("");
        }}
      >
        send Message
      </button>
    </div>
  );
}
