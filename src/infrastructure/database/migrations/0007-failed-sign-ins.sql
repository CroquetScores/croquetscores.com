-- Every signing in that failed, so that the sign in page cannot be used to
-- guess passwords: an email address that has failed often enough is held for
-- an hour, and so is an IP address that has failed often enough whichever
-- address it gave.
--
-- It holds the address as it is found — trimmed and in lower case — rather than
-- as it was typed, so that writing it another way does not count afresh. A row
-- is written only when a signing in fails, so nothing here says which
-- addresses have accounts: an address nobody registered is counted exactly as
-- one that is.
create table failed_sign_ins (
    id            bigserial   primary key,
    email_address text        not null,
    ip_address    text        not null,
    failed_at     timestamptz not null
);

-- What each limit asks: how often one address, or one IP address, has failed
-- lately.
create index failed_sign_ins_by_email_address on failed_sign_ins (email_address, failed_at);
create index failed_sign_ins_by_ip_address on failed_sign_ins (ip_address, failed_at);
