-- Notekeep Town initial schema

create extension if not exists "pgcrypto";

create table worlds (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null default 'My Town',
  share_token text not null unique default encode(gen_random_bytes(9), 'base64'),
  created_at timestamptz not null default now()
);

create table folders (
  id uuid primary key default gen_random_uuid(),
  world_id uuid not null references worlds(id) on delete cascade,
  parent_id uuid references folders(id) on delete cascade,
  name text not null,
  map_type text not null default 'house', -- 'house' at top level, 'room' when nested
  position_x int not null default 0,
  position_y int not null default 0,
  created_at timestamptz not null default now()
);

create table notes (
  id uuid primary key default gen_random_uuid(),
  folder_id uuid not null references folders(id) on delete cascade,
  title text not null default 'Untitled',
  content_json jsonb not null default '{}'::jsonb,
  furniture_sprite_type text not null default 'desk',
  position_x int not null default 0,
  position_y int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index folders_world_id_idx on folders(world_id);
create index folders_parent_id_idx on folders(parent_id);
create index notes_folder_id_idx on notes(folder_id);

alter table worlds enable row level security;
alter table folders enable row level security;
alter table notes enable row level security;

-- Owners can do everything with their own world. Public share access (by
-- share_token) is handled server-side via the service role key in an API
-- route, NOT by loosening RLS here -- an "using (true)" select policy would
-- let anyone query every user's notes directly, not just the shared world.
create policy "worlds: owner full access" on worlds
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create policy "folders: owner full access" on folders
  for all using (
    exists (select 1 from worlds w where w.id = folders.world_id and w.owner_id = auth.uid())
  ) with check (
    exists (select 1 from worlds w where w.id = folders.world_id and w.owner_id = auth.uid())
  );

create policy "notes: owner full access" on notes
  for all using (
    exists (
      select 1 from folders f
      join worlds w on w.id = f.world_id
      where f.id = notes.folder_id and w.owner_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from folders f
      join worlds w on w.id = f.world_id
      where f.id = notes.folder_id and w.owner_id = auth.uid()
    )
  );
