"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RealLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await fetch("/api/auth", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.route === "real") {
      router.push("/real/dashboard");
    } else {
      router.push("/decoy/dashboard");
    }
  };

  return (
    <div className="flex flex-col items-center mt-40">
      <h1 className="text-2xl mb-4">Acme Admin Login</h1>

      <input
        className="border p-2 mb-2"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="border p-2 mb-2"
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin} className="bg-blue-500 text-white p-2">
        Login
      </button>
    </div>
  );
}