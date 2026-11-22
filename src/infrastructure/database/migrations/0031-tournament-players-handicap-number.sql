-- A handicap is a number: up to two digits and a fraction of one, which is
-- what the domain accepts (TournamentPlayer.ts). The column held the text as
-- it was written, so "+4" and "4.0" were kept as they were and read back
-- different from "4".
--
-- A read model, made again from the events, which keep what was written. A
-- handicap that is not one the domain accepts, which none should be, is left
-- empty here rather than stopping the migration, and is had again by making
-- the read models again.
alter table tournament_players
    alter column handicap type numeric(3, 1)
    using case
        when btrim(handicap) ~ '^[+-]?[0-9]{1,2}(\.[0-9])?$'
            then btrim(handicap)::numeric(3, 1)
    end;
