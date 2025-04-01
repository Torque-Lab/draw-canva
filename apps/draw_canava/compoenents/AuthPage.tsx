"use client";

import Link from "next/link";

export function AuthPage({ isSignin }: { isSignin: boolean }) {
  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gray-100">
      <div className="p-6 bg-white  text-gray-700 rounded-lg shadow-lg w-80">
        <h2 className="text-2xl font-bold text-center mb-4">
          {isSignin ? "Sign In" : "Sign Up"}
        </h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Email"
            className="w-full px-4 py-2  text-gray-700 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2  text-gray-700 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => {}}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition hover:cursor-pointer"
          >
            {isSignin ? "Sign In" : "Sign Up"}
          </button>
        </div>
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
