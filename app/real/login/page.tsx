"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function RealLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [simulateIp, setSimulateIp] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          username, 
          password,
          simulatedIp: simulateIp ? "104.28.1.99" : "192.168.1.10"
        })
      });

      const data = await res.json();
      
      if (data.success) {
        // SentinelAI routing logic happens here transparently
        router.push(data.route);
      }
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center p-4">
      <div className="absolute top-4 right-4 animate-pulse">
        <Badge variant="outline" className="text-zinc-500 border-zinc-800">Protected by SentinelAI</Badge>
      </div>
      <Card className="w-full max-w-sm glass-panel">
        <CardHeader className="space-y-1 items-center pb-6">
          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
            <ShieldAlert className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Acme Admin Portal</CardTitle>
          <CardDescription className="text-center">Enter your credentials to access the secure internal portal.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-zinc-300">Username</label>
              <Input 
                required 
                placeholder="admin" 
                autoComplete="username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-zinc-300">Password</label>
              <Input 
                required 
                type="password" 
                placeholder="••••••••" 
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="pt-2">
              <label className="flex items-center space-x-2 text-sm text-zinc-400 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="rounded border-zinc-800 bg-zinc-950 accent-primary" 
                  checked={simulateIp}
                  onChange={(e) => setSimulateIp(e.target.checked)}
                />
                <span>Simulate High-Risk IP Address</span>
              </label>
            </div>

            <Button type="submit" className="w-full mt-4" disabled={loading}>
              {loading ? "Authenticating..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-zinc-800/50 pt-4 mt-2">
           <p className="text-xs text-zinc-500 text-center">
             Notice: To simulate Suspicious activity, check the box or use 'hacker' as username.
           </p>
        </CardFooter>
      </Card>
    </div>
  );
}