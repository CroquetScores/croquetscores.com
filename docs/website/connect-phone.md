# Opening the development site on a phone

How to open the site you are running on this machine on a phone, to see it at a phone's width and use it with a thumb.

## Why it needs https

The site's cookies — the session, the theme and the language — are marked secure (`src/web/common/session.ts`), so a browser keeps them only over https. The one exception browsers make is `localhost`, and a phone cannot reach this machine as `localhost`. So over plain http from a phone the public pages open, but signing in does not stick, and the admin cannot be used.

The way to a phone is therefore an https address that leads to the site. A tunnel gives one.

## With a tunnel

1. Build the admin and start the site, in a WSL terminal:

   ```bash
   npm run build:admin
   npm run dev
   ```

   The site listens on port 3000, or on `PORT` where `.env` says another.

2. In a second WSL terminal, open a tunnel to it:

   ```bash
   npx cloudflared tunnel --url http://127.0.0.1:3000 --http-host-header localhost:3000
   ```

   The first time, this downloads Cloudflare's tunnel program. No account is needed. After a few seconds it prints an address like `https://something-random.trycloudflare.com`.

   The `--http-host-header` is needed. The site works out which website a request is for from the host it was addressed to, and answers "Misdirected request" to a host it does not know, which the tunnel's random address is. The flag has the tunnel say `localhost:3000` to the site instead, which it takes for development. The phone still sees the https address.

3. Open that address on the phone.

4. Stop the tunnel with Ctrl+C when you are done. The address is not kept, so the next tunnel has a new one.

Which website the site is — Croquet Scores or Gateball Scores — comes from `.env`, not from the address, so the tunnel's address serves it as it is.

Three things to know:

- The site still thinks it is at `http://localhost:3000`, so a link it makes from its own address, such as one in an email, and the return addresses of signing in with Google or Facebook, point there and do not work from the phone.
- Anyone with the address reaches your development site while the tunnel is open. It is random and not guessable, but do not share it, and do not leave the tunnel running.
- What the phone sends goes through Cloudflare rather than staying on your network.
