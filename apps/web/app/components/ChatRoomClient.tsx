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
    <div className="flex flex-col h-full p-4 bg-gray-100">
      <div className="flex-1 overflow-y-auto mb-4">
        {chat.map((m, index) => (
          <div
            key={index}
            className="p-2 mb-2 bg-white rounded shadow-md border border-gray-200"
          >
            {m.message}
          </div>
        ))}
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={currentMessage}
          onChange={(e) => {
            setCurrentMessage(e.target.value);
          }}
          className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your message..."
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
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
          Send
        </button>
      </div>
    </div>
  );
}
