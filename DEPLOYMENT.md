# Deploying Edu-Bridge (Frontend + Backend Separately)

Yes, this project is built to deploy **backend** and **frontend** on different hosts. It will work as long as you set the frontend’s API URL to your backend URL.

---

## Why you see build errors

- **Vercel**: If the app is built from the **repo root**, Vercel runs `npm install` and `npm run build` there. The root `package.json` has no React/build tooling, so you get errors like “react-scripts not found” or “Unknown script: build”. **Fix:** set the **Root Directory** to `frontend` so Vercel builds only the React app.
- **Render**: If the service is set to the repo root, the start command and `node_modules` may be wrong. **Fix:** set **Root Directory** to `backend` (or use the included `render.yaml`).

---

## 1. Deploy backend (e.g. Render)

1. Push the repo to GitHub (or connect Render to your Git provider).
2. In [Render](https://render.com): **New → Web Service**, select this repo.
3. Either:
   - **Option A – Blueprint:** Add the repo; Render will detect `render.yaml` and create the backend service from it. Set **MONGODB_URI** in the service’s **Environment** (e.g. a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) connection string).
   - **Option B – Manual:** Set **Root Directory** to `backend`, **Build Command** to `npm install`, **Start Command** to `npm start`. Add env vars: `NODE_ENV=production`, `MONGODB_URI=<your MongoDB URI>`.
4. Deploy. Note the service URL, e.g. `https://edu-bridge-api.onrender.com`.
5. **Optional:** To restrict CORS to your frontend only, add env var `CORS_ORIGIN=https://your-frontend.vercel.app` (comma-separated for multiple origins). If you don’t set it, the API allows all origins.

**Note:** Uploaded images are stored on the server’s disk. On Render the filesystem is ephemeral, so uploads can be lost on redeploy. For permanent storage, you’d later switch to something like S3/Cloudinary and change the upload logic.

---

## 2. Deploy frontend (e.g. Vercel)

1. In [Vercel](https://vercel.com): **Add New → Project**, import this repo.
2. **Important – Root Directory:** Set **Root Directory** to `frontend` (not the repo root). Use **Edit** next to the project name to set it. This is what fixes the “build not found” / “react-scripts” errors.
3. **Build & Output:** Leave as default (Vercel will use `npm run build` and the `build` folder). If you added `frontend/vercel.json`, it’s already set.
4. **Environment variables:** Add:
   - **Name:** `REACT_APP_API_URL`  
   - **Value:** your backend base URL **including** `/api`, e.g. `https://edu-bridge-api.onrender.com/api`
5. Deploy. The frontend will call the backend at that URL.

---

## 3. Checklist

| Where        | What to set |
|-------------|-------------|
| **Vercel**  | Root Directory = `frontend` |
| **Vercel**  | `REACT_APP_API_URL` = `https://<your-backend>/api` |
| **Render**  | Root Directory = `backend` (or use `render.yaml`) |
| **Render**  | `MONGODB_URI` = your MongoDB connection string |
| **Render**  | (Optional) `CORS_ORIGIN` = your Vercel frontend URL |

---

## 4. Local vs production

- **Local:** Frontend uses `http://localhost:5000/api` if `REACT_APP_API_URL` is not set.
- **Production:** Set `REACT_APP_API_URL` in Vercel (and optionally `CORS_ORIGIN` on Render) so the live frontend talks to the live backend and CORS stays correct.

After this, “backend somewhere, frontend somewhere else” will work: frontend on Vercel, backend on Render (or another host), with the same repo and env vars as above.
