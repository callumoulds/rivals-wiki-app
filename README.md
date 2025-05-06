# Marvel Rivals Wiki – Progressive Web App

### How to deploy (100 % free)

1. Sign in to GitHub ▸ New repository ▸ `content`  
   *Keep private so Marvel/NetEase lawyers stay asleep.*
2. Add two JSON files and push:
   - **news.json** – matches Article model (see index.html)
   - **heroes.json** – matches Hero model
3. Grab the CSV publish‑to‑web link of your Google Sheet with meta stats.
4. Edit `js/app.js` – replace `YourUser` and `SheetID` with your IDs.
5. Push this entire folder to **another** repo, enable GitHub Pages  
   (*Settings ▸ Pages ▸ Branch: *`main`* / Root*).
6. Wait 30 sec – the PWA is now live at `https://<you>.github.io/<repo>/`.
7. Open that URL on iPhone ▸ Share ▸ *Add to Home Screen* – done.

Everything works offline (service‑worker cached). News/assets refresh whenever you have signal.

> **£0 spent.** No Mac, no signing, no expiry. If Apple ever kills PWAs you’re unlucky, but today they work.
