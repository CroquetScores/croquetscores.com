-- Every time somebody asked for a way back in, by the address they asked from,
-- so that the forgot password page cannot be used to try address after
-- address. It holds no email address: how often an address is written to is
-- counted where every email is counted (emails_written), and this is only the
-- asking.
create table password_reset_askings (
    id          bigserial   primary key,
    ip_address  text        not null,
    asked_at    timestamptz not null
);

-- What the limit asks: how often one IP address has asked lately.
create index password_reset_askings_by_ip_address on password_reset_askings (ip_address, asked_at);
