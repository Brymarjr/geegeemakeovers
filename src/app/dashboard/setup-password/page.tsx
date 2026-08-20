"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setupNewPassword } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

export default function SetupPasswordPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const result = await setupNewPassword(formData);

    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error || "Failed to update password.");
      setIsPending(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 px-4">
      <div className="w-full max-w-md bg-background border border-border p-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-medium tracking-tight">Setup Password</h1>
          <p className="text-muted-foreground mt-2 font-light text-sm">
            Please create a secure, permanent password to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">New Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                name="password"
                required
                minLength={8}
                className="w-full h-12 pl-4 pr-12 border border-border bg-background focus:outline-none focus:border-primary transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Confirm Password</label>
            <input 
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              required
              minLength={8}
              className="w-full h-12 px-4 border border-border bg-background focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 border border-red-200 text-sm">
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full h-12 bg-foreground text-background hover:bg-foreground/90 text-base"
            disabled={isPending}
          >
            {isPending ? "Saving..." : "Save and Continue"}
          </Button>
        </form>
      </div>
    </div>
  );
}