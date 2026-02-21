# Local Hosting (Your Computer)

## Quick start

From this project folder:

```powershell
powershell -ExecutionPolicy Bypass -File .\start-local.ps1
```

Then open:

- `http://localhost:8080`

You can change the port:

```powershell
powershell -ExecutionPolicy Bypass -File .\start-local.ps1 -Port 9000
```

---

## Access from another device on your Wi-Fi

1. Find your IPv4 address:

```powershell
ipconfig
```

2. On phone/laptop (same network), open:

- `http://YOUR_IP:8080`

If it does not load, allow Python through Windows Firewall when prompted.

---

## Use a custom local domain on your own computer

You can map a local domain name (only works on your machine unless you edit hosts on each device).

1. Open hosts file as Administrator:

- `C:\Windows\System32\drivers\etc\hosts`

2. Add:

```txt
127.0.0.1 dino-pedia.local
127.0.0.1 www.dino-pedia.local
```

3. Open:

- `http://www.dino-pedia.local:8080`

---

## About `www.dino-pedia.com`

`www.dino-pedia.com` on the real internet requires:

- domain ownership
- DNS records
- public hosting (or home server + port forwarding + SSL)

For local-only testing, use `dino-pedia.local` as above.
