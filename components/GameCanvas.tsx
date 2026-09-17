"use client";

import { useEffect, useRef, useState } from "react";
import {
  ensureSessionAndWorld,
  getFolders,
  createFolder,
  getNotes,
  createNote,
  updateNoteContent,
  type Folder,
  type Note,
} from "@/lib/world";
import { NoteOverlay } from "@/components/NoteOverlay";

type ViewState =
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "town"; worldId: string; houses: Folder[] }
  | { kind: "room"; worldId: string; folder: Folder; notes: Note[] };

export function GameCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<import("phaser").Game | null>(null);
  const [view, setView] = useState<ViewState>({ kind: "loading" });
  const [openNote, setOpenNote] = useState<Note | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const world = await ensureSessionAndWorld();
        let houses = await getFolders(world.id, null);
        if (houses.length === 0) {
          const demo = await createFolder(world.id, null, "Demo House", 0);
          houses = [demo];
        }
        if (!cancelled) setView({ kind: "town", worldId: world.id, houses });
      } catch (err) {
        if (!cancelled) {
          setView({ kind: "error", message: err instanceof Error ? err.message : "Failed to load world" });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (view.kind !== "town" && view.kind !== "room") return;
    if (!containerRef.current) return;

    let destroyed = false;

    (async () => {
      const Phaser = (await import("phaser")).default;
      const { TownScene } = await import("@/lib/game/scenes/TownScene");
      const { RoomScene } = await import("@/lib/game/scenes/RoomScene");
      if (destroyed) return;

      let scene: Phaser.Scene;

      if (view.kind === "town") {
        scene = new TownScene(
          view.houses.map((h) => ({ folderId: h.id, name: h.name, x: h.position_x, y: h.position_y })),
          async (folderId) => {
            const folder = view.houses.find((h) => h.id === folderId)!;
            let notes = await getNotes(folderId);
            if (notes.length === 0) {
              const demo = await createNote(folderId, "Welcome note", 0);
              notes = [demo];
            }
            setView({ kind: "room", worldId: view.worldId, folder, notes });
          }
        );
      } else {
        scene = new RoomScene(
          view.folder.name,
          view.notes.map((n) => ({ noteId: n.id, title: n.title, x: n.position_x, y: n.position_y })),
          (noteId) => {
            const note = view.notes.find((n) => n.id === noteId) ?? null;
            setOpenNote(note);
          },
          async () => {
            const houses = await getFolders(view.worldId, null);
            setView({ kind: "town", worldId: view.worldId, houses });
          }
        );
      }

      gameRef.current?.destroy(true);
      gameRef.current = new Phaser.Game({
        type: Phaser.AUTO,
        width: 640,
        height: 480,
        parent: containerRef.current!,
        physics: { default: "arcade", arcade: { debug: false } },
        scene,
        disableContextMenu: true,
        fps: { forceSetTimeOut: true, target: 60 },
      });
    })();

    return () => {
      destroyed = true;
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  if (view.kind === "loading") {
    return <div className="p-8 text-neutral-500">Loading your world…</div>;
  }

  if (view.kind === "error") {
    return <div className="p-8 text-red-600">Error: {view.message}</div>;
  }

  return (
    <div>
      <div ref={containerRef} className="mx-auto w-[640px] overflow-hidden rounded border border-neutral-300" />
      <p className="mt-2 text-center text-sm text-neutral-500">Arrow keys to move. Walk into a house or note.</p>
      {openNote && (
        <NoteOverlay
          title={openNote.title}
          initialText={typeof openNote.content_json?.text === "string" ? (openNote.content_json.text as string) : ""}
          onSave={async (text) => {
            await updateNoteContent(openNote.id, { text });
            setOpenNote(null);
          }}
          onClose={() => setOpenNote(null)}
        />
      )}
    </div>
  );
}
