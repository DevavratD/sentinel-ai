"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldAlert } from "lucide-react";

export default function DecoyLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulated network delay
    setTimeout(() => {
        router.push('/decoy/dashboard');
    }, 1500);
  };

  return (
    <div className="flex h-screen w-full items-center justify-center p-4">
      <Card className="w-full max-w-sm bg-zinc-950 border-zinc-800">
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
              <Input required placeholder="admin" autoComplete="username" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-zinc-300">Password</label>
              <Input required type="password" placeholder="••••••••" autoComplete="current-password" />
            </div>

            <Button type="submit" className="w-full mt-4" disabled={loading}>
              {loading ? "Authenticating..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
