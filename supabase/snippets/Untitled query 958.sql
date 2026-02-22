update public.tags t
set count = (
  select count(*) from public.health_tip_tags htt
  where htt.tag_id = t.id
);