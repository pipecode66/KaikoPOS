"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { INITIAL_ADMIN_EMAIL, INITIAL_ADMIN_PASSWORD } from "@/lib/auth";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState(INITIAL_ADMIN_EMAIL);
  const [password, setPassword] = useState(INITIAL_ADMIN_PASSWORD);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { message?: string } | null;
        setError(body?.message ?? "No fue posible iniciar sesion");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("No fue posible iniciar sesion");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-brand-text">
          Correo
        </label>
        <Input id="email" value={email} onChange={(event) => setEmail(event.target.value)} />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-brand-text">
          Contrasena
        </label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>

      {error ? <p className="rounded-[18px] bg-brand-error/80 px-4 py-3 text-sm text-brand-text">{error}</p> : null}

      <Button size="lg" className="mt-2 w-full" type="submit" disabled={loading}>
        {loading ? "Validando acceso..." : "Entrar al sistema"}
      </Button>
    </form>
  );
}
