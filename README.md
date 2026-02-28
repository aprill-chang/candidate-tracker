# Minimalistic Photography Web App

A mobile-friendly, single-page gallery with a hero video, “Thank you for coming,” and seven clickable sections: Getting ready, First look, Ceremony, Cocktail hours, Group photo, Reception, After party.

## Run locally

- **Option 1:** Open `index.html` in a browser (file://). Note: some browsers restrict autoplay or external images when opened as file.
- **Option 2:** Serve the folder with a static server, e.g.:
  - `npx serve .`
  - `python3 -m http.server 8000` (then open http://localhost:8000)

## Adding your media

- **Hero video:** Add your video as `assets/hero-video.mp4`. Use MP4 (H.264) for broad support. The video is muted, looped, and set to autoplay for mobile.
- **Hero poster:** Optional. Add `assets/hero-poster.jpg` to show a still image before the video loads or on slow connections.
- **Section photos:** Replace the placeholder image URLs in `index.html` with your own. You can point `src` to files under `assets/` (e.g. `assets/getting-ready-1.jpg`) or to your own URLs. Each section has a `.photo-grid`; add or change `<img>` tags as needed.

No build step required. You can host the folder on Netlify, GitHub Pages, or any static host.

---

## Candidate Tracker (Ashby)

A separate page at **`/candidate-tracker.html`** pulls candidate data from a saved Ashby report and displays it in a table with columns: Candidate name, Job, Current interview stage, Current interview date (or "Scheduling"), and a **Note** textbox (stored in your browser only).

- **To use it:** Deploy this project to Vercel (or run `vercel dev` locally) so the `/api/ashby-report` serverless function is available. Open `/candidate-tracker.html`.
- **Environment variable:** Set **`ASHBY_API_KEY`** in Vercel (Project → Settings → Environment Variables) and in `.env` or `.env.local` for local dev. The key must have **Reports – Read** permission in [Ashby API keys](https://app.ashbyhq.com/admin/api/keys). Do not commit the API key.
