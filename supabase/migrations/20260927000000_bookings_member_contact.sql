-- RBookingDetail.tsx (aba-partner) needs to call/email the member who made
-- a booking, but bookings has no contact columns — the member's phone/email
-- live on `users`, which facility staff have no read access to (and
-- shouldn't get broad access to, for a single contact-card display).
-- Denormalize onto bookings at creation time instead, same pattern already
-- used for facility_name/patient_name.

alter table bookings add column if not exists member_phone text;
alter table bookings add column if not exists member_email text;
