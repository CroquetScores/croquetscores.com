-- Every address a tournament has ever been found at, and the tournament it
-- leads to. An address is kept after the tournament moves, since an old link
-- still leads to it, and so is never given to another tournament: the address
-- is the key, and a tournament can hold many.
create table tournaments_by_address (
    address       text primary key,
    tournament_id text not null
);
