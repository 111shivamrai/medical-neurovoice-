# NeuroVoice

> **"Your Voice Carries the Truth. We Listen for It."**  
> *Vocal Neurological Biomarker Research & Screening Support Tool*  
> *Developed in collaboration with Jabalpur Medical College, MP, India*

---

> [!IMPORTANT]
> **PROTOTYPE SCORING — NOT VALIDATED CLINICALLY — FOR RESEARCH DEMONSTRATION ONLY**  
> NeuroVoice is an investigational screening support and research platform. It does NOT provide clinical diagnoses or triage. All acoustic scores, risk indicators, and generated reports must be evaluated by licensed medical specialists.

---

## 🔬 Honesty Audit (Pipeline Stages & Computation Verification)

In accordance with our commitment to scientific rigor and transparency, the table below documents every stage of the NeuroVoice processing pipeline, detailing whether the stage performs real computation or uses evidence-based heuristic modeling.

| Stage | Name | Computation Status | File / Implementation | Details |
|---|---|---|---|---|
| **Stage 1** | **Audio Validation & Noise Reduction** | **REAL** | `api/app/pipeline/acoustic.py` | Validates format/duration/size. Applies `noisereduce` spectral gating or `scipy.signal.wiener` noise filtering; computes real Signal-to-Noise Ratio (SNR in dB). |
| **Stage 2** | **Language & Phonation Alignment** | **REAL** | `api/app/pipeline/acoustic.py` | Pitch contour tracking and voice activity segmentation tailored for sustained phonation `/a/` in Hindi or English prompts. |
| **Stage 3** | **25ms Window Segmentation** | **REAL** | `api/app/pipeline/acoustic.py` | `librosa.util.frame` framing with 25ms window length and 10ms hop size with Hann tapering. |
| **Stage 4** | **MFCC Extraction (Coefficients 1–13)** | **REAL** | `api/app/pipeline/acoustic.py` | `librosa.feature.mfcc(n_mfcc=13)` extracting cepstral coefficients and deltas across all phonation frames. |
| **Stage 5** | **Acoustic Biomarker Extraction** | **REAL** | `api/app/pipeline/acoustic.py` | `parselmouth.Sound` (Praat C++ bindings) extracting real Fundamental Frequency ($F_0$), Local Jitter, Local Shimmer, Harmonics-to-Noise Ratio (HNR in dB), Formants ($F_1, F_2, F_3$), Recurrence Period Density Entropy (RPDE), Pitch Period Entropy (PPE), and pause ratio. |
| **Stage 6** | **Deep Temporal Model (CNN-GRU)** | **HEURISTIC INTERFACE** | `api/app/pipeline/acoustic.py` | Abstracted behind `RiskModel` interface. In prototype mode, `EvidenceHeuristicRiskModel` uses literature-backed acoustic thresholds (e.g. jitter > 1.04%, shimmer > 3.81%, HNR < 20 dB, PPE > 0.2) until trained neural weights are validated with clinical trials. |
| **Stage 7** | **Tabular Biomarker Model (LightGBM)** | **HEURISTIC INTERFACE** | `api/app/pipeline/acoustic.py` | Pluggable under `RiskModel` interface; currently runs calibrated evidence-based acoustic scoring. |
| **Stage 8** | **Cross-Attention Fusion (wav2vec 2.0)** | **HEURISTIC INTERFACE** | `api/app/pipeline/acoustic.py` | Pre-configured fusion weight combiner normalizing acoustic metrics with normative voice ranges. |
| **Stage 9** | **SHAP Feature Explainability** | **REAL** | `api/app/pipeline/acoustic.py` | Computes directional feature impacts (`shap_impact`) based on patient acoustic deviations relative to healthy baseline normative distributions (e.g., glottal perturbation, amplitude cycles, harmonic purity). |

---

## 🏗️ Monorepo Architecture

NeuroVoice is structured as a unified monorepo so that the frontend and backend operate together on **one port (`3000`)** in the browser using Next.js App Router rewrites:

```
neurovoice/
├── package.json           # Root orchestrator (concurrently starts web + api)
├── render.yaml            # Render Blueprint for FastAPI backend
├── vercel.json            # Vercel configuration for Next.js frontend
├── .env.example           # Unified template for environment variables
├── .gitignore             # Strict exclusion of .env, keys, and credentials
│
├── api/                   # FastAPI Backend (Python 3.11)
│   ├── requirements.txt   # Pinned production dependencies
│   ├── runtime.txt        # python-3.11.9
│   ├── service-account.json (gitignored, private Firebase Admin credentials)
│   └── app/
│       ├── main.py        # FastAPI server & route registration
│       ├── config.py      # Environment configuration & Firebase Admin
│       ├── pipeline/
│       │   └── acoustic.py # REAL Praat & Librosa feature extractor + RiskModel interface
│       ├── routes/        # /api/analyse, /api/reports, /api/doctors, /api/appointments
│       └── services/      # database.py (MongoDB + in-memory fallback), pdf_generator.py
│
└── web/                   # Next.js 14 App Router Frontend (TypeScript & Tailwind)
    ├── app/
    │   ├── page.tsx       # 11-section landing page with 3D Robot & GSAP pipeline
    │   ├── layout.tsx     # ThemeProvider, SmoothScroll, metadata
    │   ├── globals.css    # Strict semantic design tokens (Light + Dark modes)
    │   ├── (auth)/        # Sign-in, Sign-up, Onboarding
    │   ├── dashboard/     # Command Centre, Floating Dock, Scan, History, Care, Profile
    │   ├── admin/         # Role-gated admin portal & research export
    │   └── simple/        # High-contrast ASHA Worker Hindi-first screening mode
    ├── components/        # RobotCanvas (3D R3F), Waveforms, Charts, FloatingDock, Nav
    └── lib/               # brand.ts (Single source of truth for branding)
```

---

## ⚡ Quick Start (Localhost)

### 1. Prerequisites
- Node.js 18+ (tested on Node 22)
- Python 3.11 or 3.12 (or virtual environment)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/111shivamrai/medical-neurovoice-.git
cd medical-neurovoice-

# Install web dependencies
cd web && npm install && cd ..

# Setup Python virtual environment
python3 -m venv venv
source venv/bin/activate
pip install -r api/requirements.txt
```

### 3. Start Both Services with One Command
```bash
npm run dev
```

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **API (Proxied):** [http://localhost:3000/api/health](http://localhost:3000/api/health)
- **Direct FastAPI Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🚀 Cloud Deployment

### Web Frontend (Vercel)
1. Import repository into Vercel.
2. Set Root Directory to `web` (or deploy from root with provided `vercel.json`).
3. Framework Preset: **Next.js**.
4. Set Environment Variables:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`: Your Firebase web API key
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`: `neurovoice-3c2c7.firebaseapp.com`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: `neurovoice-3c2c7`

### API Backend (Render)
1. Create a new Web Service from the repo on Render using `render.yaml`.
2. Python Version: `3.11.9`.
3. Build Command: `pip install -r requirements.txt` (within `api/` directory).
4. Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
5. Upload private `service-account.json` to Secret Files on Render.
6. Set `MONGODB_URI` in Environment variables.

---

## 🔒 Security & Privacy
- **Zero Raw Audio Retention:** Recorded patient audio files are discarded immediately following acoustic feature vector extraction, unless explicit patient consent is provided for research training.
- **Role-Gated Endpoints:** Admin data export is restricted to authenticated users possessing the `admin` role claim.
- **Secret Hygiene:** All service account JSON keys and `.env` credentials are strictly ignored in `.gitignore` and never committed to source control.

---

## 📄 Licensing & Research Attribution
Developed in collaboration with Jabalpur Medical College, Madhya Pradesh, India.  
For research collaboration, clinical validation trials, or inquiries, contact: `research@neurovoice.org`.
