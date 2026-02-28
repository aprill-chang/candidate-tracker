# Candidate Tracker

A small web app that pulls candidate data from a saved [Ashby](https://ashbyhq.com) report and displays it in a table with columns: Candidate name, Job, Current interview stage, Current interview date (or "Scheduling"), and a **Note** field (stored in your browser only).

## Deploy on Vercel

1. **Import this repo** in [Vercel](https://vercel.com): Add New → Project → Import `aprill-chang/candidate-tracker`.
2. **Set environment variable:** In the project → Settings → Environment Variables, add:
   - **Key:** `ASHBY_API_KEY`
   - **Value:** your [Ashby API key](https://app.ashbyhq.com/admin/api/keys) (with **Reports – Read** permission)
3. **Redeploy** (Deployments → ⋯ → Redeploy) so the key is applied.
4. **Open the app:** Your deployment URL (e.g. `https://candidate-tracker-xxx.vercel.app`) will show the tracker at the root.

## Run locally

- Install [Vercel CLI](https://vercel.com/docs/cli): `npm i -g vercel`
- In this folder, create `.env.local` with: `ASHBY_API_KEY=your_key_here`
- Run: `vercel dev`
- Open: `http://localhost:3000`

Do not commit `.env` or `.env.local`.
