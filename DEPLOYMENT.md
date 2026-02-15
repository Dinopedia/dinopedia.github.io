# Dino-pedia Domain Setup

This project is now configured with a `CNAME` file for `www.dino-pedia.com`.

To make the domain actually work on the public internet:

1. Choose a static host (`Cloudflare Pages`, `Netlify`, `Vercel`, or `GitHub Pages`).
2. Deploy this repo as a static site.
3. In your DNS provider:
   - Add `CNAME` record:
     - `Host`: `www`
     - `Target`: your hosting domain (for example `your-site.pages.dev` / `your-site.netlify.app`)
4. (Recommended) Add redirect for apex domain:
   - Redirect `dino-pedia.com` -> `https://www.dino-pedia.com`
5. In your hosting dashboard:
   - Add custom domain `www.dino-pedia.com`
   - Enable HTTPS certificate

After DNS propagates, `https://www.dino-pedia.com` will resolve.
