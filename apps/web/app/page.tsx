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
    <div className="flex w-screen h-sreen justify-centor ">
      <input
        value={roomId}
        onChange={(e) => setroomId(e.target.value)}
        type="text"
        placeholder="Enter room id"
        className=""
      ></input>
      <button
        onClick={() => {
          router.push(`/room/${roomId}`);
        }}
      >
        Join room
      </button>
    </div>
  );
}
