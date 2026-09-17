"use client";

import dynamic from "next/dynamic";

const GameCanvas = dynamic(() => import("@/components/GameCanvas").then((m) => m.GameCanvas), {
  ssr: false,
});

export default function WorldPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-neutral-100 p-8">
      <h1 className="text-2xl font-bold text-neutral-800">Notekeep Town</h1>
      <GameCanvas />
    </main>
  );
}
