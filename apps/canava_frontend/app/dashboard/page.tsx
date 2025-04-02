"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { BACKEND_URL } from "@/config";

export default function Dashboard() {
  const router = useRouter();
  const [roomName, setRoomName] = useState("");
  const [roomName2, setRoomName2] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreateRoom = async () => {
    if (!roomName.trim()) {
      setError("Room name is required!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found! Redirecting to signin...");
        return router.push("/signin");
      }

      const response = await axios.post(
        `${BACKEND_URL}/room`,
        { room: roomName }, // ✅ Send room name in request body
        {
          headers: {
            Authorization: ` ${token}`, // ✅ Attach token in headers
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Room created:", response.data);
      const newRoomId = response.data.roomId;
      router.push(`/canvas/${newRoomId}`); // ✅ Redirect to the new room
    } catch (error) {
      console.error(
        "Error creating room:",
        (error as any).response?.data || (error as any).message
      );
      setError(
        (error as any).response?.data?.message || "Error creating room!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="p-6 bg-white text-gray-700 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Dashboard</h2>

        <div className="space-y-4">
          {/* Room Name Input */}
          <input
            type="text"
            placeholder="Enter room name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Show error if any */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Create Room Button */}
          <button
            onClick={handleCreateRoom}
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition hover:cursor-pointer"
          >
            {loading ? "Creating..." : "Create Room"}
          </button>

          {/* Join Room Option */}
          <div className="text-sm text-center mt-4">
            <p>Already have a Room ID?</p>
            <div className="mt-2 flex items-center space-x-2">
              <input
                type="text"
                placeholder="Enter Room ID"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setRoomName2(e.target.value)}
              />
              <button
                onClick={() => {
                  if (roomName2.trim()) {
                    router.push(`/canvas/${roomName2}`);
                  } else {
                    setError("Room ID is required!");
                  }
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition cursor-pointer"
              >
                Join
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
