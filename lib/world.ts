import { createClient } from "@/lib/supabase/client";

export interface Folder {
  id: string;
  world_id: string;
  parent_id: string | null;
  name: string;
  map_type: string;
  position_x: number;
  position_y: number;
}

export interface Note {
  id: string;
  folder_id: string;
  title: string;
  content_json: Record<string, unknown>;
  furniture_sprite_type: string;
  position_x: number;
  position_y: number;
}

export async function ensureSessionAndWorld() {
  const supabase = createClient();

  let { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) {
    const { error } = await supabase.auth.signInAnonymously();
    if (error) throw error;
    ({ data: sessionData } = await supabase.auth.getSession());
  }
  const userId = sessionData.session!.user.id;

  const { data: existing, error: fetchError } = await supabase
    .from("worlds")
    .select("*")
    .eq("owner_id", userId)
    .limit(1)
    .maybeSingle();
  if (fetchError) throw fetchError;
  if (existing) return existing;

  const { data: created, error: createError } = await supabase
    .from("worlds")
    .insert({ owner_id: userId })
    .select("*")
    .single();
  if (createError) throw createError;
  return created;
}

export async function getFolders(worldId: string, parentId: string | null) {
  const supabase = createClient();
  const query = supabase.from("folders").select("*").eq("world_id", worldId);
  const { data, error } =
    parentId === null ? await query.is("parent_id", null) : await query.eq("parent_id", parentId);
  if (error) throw error;
  return (data ?? []) as Folder[];
}

export async function createFolder(worldId: string, parentId: string | null, name: string, index: number) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("folders")
    .insert({
      world_id: worldId,
      parent_id: parentId,
      name,
      map_type: parentId === null ? "house" : "room",
      position_x: 120 + (index % 4) * 160,
      position_y: 120 + Math.floor(index / 4) * 140,
    })
    .select("*")
    .single();
  if (error) throw error;
  return data as Folder;
}

export async function getNotes(folderId: string) {
  const supabase = createClient();
  const { data, error } = await supabase.from("notes").select("*").eq("folder_id", folderId);
  if (error) throw error;
  return (data ?? []) as Note[];
}

export async function createNote(folderId: string, title: string, index: number) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("notes")
    .insert({
      folder_id: folderId,
      title,
      position_x: 100 + (index % 3) * 120,
      position_y: 150 + Math.floor(index / 3) * 100,
    })
    .select("*")
    .single();
  if (error) throw error;
  return data as Note;
}

export async function updateNoteContent(noteId: string, contentJson: Record<string, unknown>) {
  const supabase = createClient();
  const { error } = await supabase
    .from("notes")
    .update({ content_json: contentJson, updated_at: new Date().toISOString() })
    .eq("id", noteId);
  if (error) throw error;
}
