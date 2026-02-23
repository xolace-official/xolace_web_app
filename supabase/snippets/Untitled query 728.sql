-- Hydration tip
insert into public.health_tip_tags (health_tip_id, tag_id)
select id, 1 from public.health_tips where slug = 'power-of-staying-hydrated';

-- Sleep tip
insert into public.health_tip_tags (health_tip_id, tag_id)
select id, 3 from public.health_tips where slug = 'fix-sleep-schedule-7-days';

-- Relationships tip
insert into public.health_tip_tags (health_tip_id, tag_id)
select id, 4 from public.health_tips where slug = 'healthy-communication-relationships';

-- Morning routine
insert into public.health_tip_tags (health_tip_id, tag_id)
select id, 7 from public.health_tips where slug = 'morning-routines-boost-energy';