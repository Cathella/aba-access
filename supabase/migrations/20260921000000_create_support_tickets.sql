-- CreateTicket.tsx/TicketsList.tsx/TicketDetail.tsx were a fully fake
-- support-ticket flow: submitting a ticket never persisted it, the list
-- showed 5 hardcoded tickets, and the detail view showed a fabricated
-- back-and-forth conversation with a "support team" that never said any of
-- it. Unlike bookings/finance, a ticket system is self-contained and can be
-- built for real without depending on anything else missing.
--
-- There is no admin-side (ABA Ops) UI yet to reply to tickets — that's a
-- separate, later piece. For now this is real record-keeping: a facility
-- admin can open a ticket, add follow-up messages, and close it with a
-- satisfaction rating. ABA Ops can review/respond via direct table access
-- until a support-side UI exists.

create table if not exists support_tickets (
  id uuid primary key default gen_random_uuid(),
  facility_id uuid not null references facilities(id) on delete cascade,
  category text not null,
  priority text not null check (priority in ('low', 'medium', 'high')),
  subject text not null,
  status text not null default 'open' check (status in ('open', 'in-progress', 'resolved')),
  satisfaction_rating integer check (satisfaction_rating between 1 and 5),
  feedback text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists ticket_messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references support_tickets(id) on delete cascade,
  sender text not null check (sender in ('user', 'support')),
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists support_tickets_facility_id_idx on support_tickets (facility_id, created_at desc);
create index if not exists ticket_messages_ticket_id_idx on ticket_messages (ticket_id, created_at asc);

alter table support_tickets enable row level security;
alter table ticket_messages enable row level security;

drop policy if exists "facility admin manages own tickets" on support_tickets;
create policy "facility admin manages own tickets"
  on support_tickets for all
  using (is_facility_admin(facility_id))
  with check (is_facility_admin(facility_id));

-- Messages are scoped through their parent ticket's facility, same pattern
-- as any child table without its own facility_id column.
drop policy if exists "facility admin manages own ticket messages" on ticket_messages;
create policy "facility admin manages own ticket messages"
  on ticket_messages for all
  using (exists (
    select 1 from support_tickets t
    where t.id = ticket_messages.ticket_id and is_facility_admin(t.facility_id)
  ))
  with check (exists (
    select 1 from support_tickets t
    where t.id = ticket_messages.ticket_id and is_facility_admin(t.facility_id)
  ));
