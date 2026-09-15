-- The facility-admin "Update Map Pin" screen in aba-partner was a fully
-- mocked UI: a static CSS grid standing in for a map, a frozen coordinate
-- pair that never changed, and a "save" button that only toasted success
-- without writing anywhere. There was also nowhere to persist a pin even if
-- the UI had been real — no lat/lng column existed on facilities at all.
--
-- Nothing downstream (aba-access's member-facing facility list) reads
-- coordinates today; this is laying the real groundwork for the map-pin
-- feature the facility admin actually wants, not wiring up a consumer.

alter table facilities add column if not exists lat double precision;
alter table facilities add column if not exists lng double precision;
