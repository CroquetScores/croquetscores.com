# Help for app developers

Croquet Scores has a public API, so that an app can follow a sport's tournaments without reading the site's pages. It answers in JSON, and it is at `/api/v0` during development or the api, it will be release at `/api/v1`.

## Where it stands {#where-it-stands}

The API is in development, which is why it is `v0`. When everyone concerned accepts it, it will become `v1`.

A change that breaks an app is never made to a version in place. It is made as a new version beside the old, so an app written against `v1` keeps working when `v2` arrives. What does not count as breaking is said next, so that an app can be written to expect it.

## Fields may be added {#fields-may-be-added}

A field may be added to an answer in the future, with no change of version, since an app that is written to ignore what it does not know is not broken by it. An app must therefore ignore any field it does not know, and must not fail on one, or on the order the fields come in.

What an app has been told is not changed without a new version: a field's name, its type and what it means.

The words of an error's `message` may be reworded at any time. An app reads the `code` and never the `message`.

## Reading cheaply {#reading-cheaply}

Every answer carries an `ETag`. Ask the same question again with it in `If-None-Match`, and the answer is `304` with nothing else when nothing changed. A tournament and a competition carry a `Last-Modified` too, which `If-Modified-Since` may be sent with. A list is told by its `ETag` alone, since a list that has lost a tournament has no newer date to say so by.

Each tournament in a list also carries an `etag` of its own, made of what it says. An app that is told a list has changed can tell which tournaments in it did without comparing them field by field.

A list of a year's tournaments takes `changedSince`, written as `2026-03-01T10:00:00Z`, so that an app that reads a year again asks only for what changed. A list is a page of at most 100, with the way to the next, and takes `page` and `pageSize`.

What each address answers is in [the API's endpoints](endpoints.md).

## Keys {#keys}

Reading is for anybody: a request with no key is answered as one with a key is. A key says whose allowance a request is counted against, and what the caller may do beyond reading.

Make a key in your account, under **API Keys**, with **Make a key**. Send it with each request as a bearer token:

```
Authorization: Bearer <the key>
```

Never put a key in an address, which browsers, proxies and logs all keep. Keep a key as secret as a password. A key that does not work is refused with `401`, so that an app that thinks it is sending one is told it is not.

## Allowances {#allowances}

Every request counts against an allowance, a minute's and a day's, whatever it asks for. A key starts with 60 a minute and 10,000 a day, which an administrator can raise for one partner. A request with no key, or with a key that does not work, counts against its address, with 10 a minute and 500 a day.

An app that has used its allowance is answered `429`, with how long to wait. A request answered `304` counts like any other.

## Errors {#errors}

Every error has the same shape:

```json
{
  "code": "Tournaments.YearMissing",
  "message": "Say which year, as year=2026.",
  "field": "year"
}
```

The `code` is what an app relies on. The `field` is the part of the request that was wrong, where one was. The `message` is for whoever reads a log.
