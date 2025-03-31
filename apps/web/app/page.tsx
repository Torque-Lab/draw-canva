"use client";

import Image, { type ImageProps } from "next/image";
import { Button } from "@repo/ui/button";
import styles from "./page.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [roomId, setroomId] = useState("");
  const router = useRouter();
  return (
    <div className="flex w-screen h-screen justify-center items-center bg-gray-100">
      <div className="p-6 bg-white rounded-lg shadow-md">
        <input
          value={roomId}
          onChange={(e) => setroomId(e.target.value)}
          type="text"
          placeholder="Enter room id"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => {
            router.push(`/room/${roomId}`);
          }}
          className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Join Room
        </button>
      </div>
    </div>
  );
}
