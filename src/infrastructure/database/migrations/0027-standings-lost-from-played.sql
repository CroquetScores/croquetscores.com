-- What a block's player lost is what they played less what they won.
--
-- `lost` was kept beside `played` and `won`, which a block's matches decided
-- add up to: every match played is won or lost. A Swiss says nothing of matches
-- lost, which is a null here as it was. A read model, made again from the
-- events.

alter table competition_standings drop column lost;
