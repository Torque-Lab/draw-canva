"use client";

import { BACKEND_URL } from "@/config";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useState } from "react";

export function AuthPage({ isSignin }: { isSignin: boolean }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload

    try {
      const endpoint = isSignin ? "/signin" : "/signup"; // Choose endpoint
      const payload = isSignin
        ? { username: email, password: password }
        : { username: email, password: password, name: name };

      const response = await axios.post(`${BACKEND_URL}${endpoint}`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (isSignin) {
        localStorage.setItem("token", response.data.token);
        router.push("/dashboard"); // ✅ Redirect to dashboard after signin
      } else {
        router.push("/signin"); // ✅ Redirect to signin after signup
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gray-100">
      <div className="p-6 bg-white text-gray-700 rounded-lg shadow-lg w-80">
        <h2 className="text-2xl font-bold text-center mb-4">
          {isSignin ? "Sign In" : "Sign Up"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isSignin && (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Name"
              className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            placeholder="Email"
            className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition hover:cursor-pointer"
          >
            {isSignin ? "Sign In" : "Sign Up"}
          </button>
        </form>
        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        <p className="text-sm text-center text-gray-700 mt-4">
          {isSignin ? "Don't have an account?" : "Already have an account?"}{" "}
          <Link
            href={isSignin ? "/signup" : "/signin"}
            className="text-blue-500 hover:underline"
          >
            {isSignin ? "Sign Up" : "Sign In"}
          </Link>
        </p>
      </div>
    </div>
  );
}
