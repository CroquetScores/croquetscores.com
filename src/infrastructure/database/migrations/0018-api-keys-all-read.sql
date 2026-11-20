-- Every key may read, so a key does not say so.
--
-- `may_read` was written true for every key, since a scope is "read" or
-- "read and write" and neither refuses reading (ApiKeyScope.mayRead). What a
-- key may do beyond reading is `may_write`. A read model, made again from the
-- events.

alter table accounts_by_api_key drop column may_read;
