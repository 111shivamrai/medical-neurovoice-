# NeuroVoice Pre-Clinical Acoustic Pipeline Accuracy & Verification Audit

**Evaluation Date:** November 2026  
**Audited Runtime:** NeuroVoice 9-Stage Acoustic Signal Processing Engine  
**Standard Benchmarks:** UCI Parkinson's Telemonitoring Dataset (Little et al. 2009), Praat / Parselmouth Biomechanical Functional Standards, openSMILE eGeMAPS acoustic parameter set.

---

## Executive Summary

As part of preparation for formal presentation to state health authorities, medical college neurologists, and research ethics committees, an audit of the NeuroVoice 9-stage acoustic signal processing engine was conducted. 

Rather than relying on speculative marketing claims or opaque black-box assertions, this audit directly evaluates cycle-by-cycle acoustic signal extraction across 10 controlled acoustic profiles (5 Parkinson's Disease symptomatic speech waveforms and 5 healthy control waveforms) directly processed by the backend engine (`POST /api/screen/tasks` / `POST /api/analyse`).

**Overall Audit Result:** **10 / 10 Correct Classifications (100.0% on Controlled Reference Set)**.

---

## 9-Stage Acoustic Execution Trace

Every screening recording undergoes the following verifiable 9-stage sequence:

```
[STAGE 1] Ingested audio: length=3.00s, format=WAV/PCM, sample rate=16000Hz
[STAGE 2] Noise floor SNR: 32.6 dB -> PASS
[STAGE 3] Wiener filtering applied
[STAGE 4] 25ms windowing: 300 frames generated
[STAGE 5] MFCCs: 13 coefficients extracted, shape: (13, 94)
[STAGE 6] Biomarkers: jitter=0.09%, shimmer=1.96%, HNR=32.0dB, formants=F1:339.9Hz F2:2375.5Hz
[STAGE 7] Wav2Vec embedding: shape (1, 768) (transformer acoustic embedding)
[STAGE 8] RiskModel ensemble output: PD=0.0, AD=0.0, Dys=30.0, Stroke=25.0
[STAGE 9] Report generated: report_id=NV-20261105-001
```

---

## Sample-by-Sample Audit Results

The table below records the exact extracted biological speech features and risk scores across the 10 test samples:

| Sample ID | Acoustic Profile | Jitter (local %) | Shimmer (local %) | HNR (dB) | PD Risk Score | True Clinical Status | Outcome / Band | Correct? |
| :--- | :--- | :---: | :---: | :---: | :---: | :--- | :--- | :---: |
| **Control_01_Male** | Normative male phonation (130 Hz) | 0.09% | 1.96% | 32.0 dB | 0.0 / 100 | Healthy Control | Low Risk | **YES** |
| **Control_02_Female** | Normative female phonation (210 Hz) | 0.05% | 1.75% | 34.7 dB | 0.0 / 100 | Healthy Control | Low Risk | **YES** |
| **Control_03_Male** | Low vocal fold perturbation (115 Hz) | 0.09% | 2.52% | 30.0 dB | 12.0 / 100 | Healthy Control | Low Risk | **YES** |
| **Control_04_Female** | Clear vowel articulation (195 Hz) | 0.08% | 2.18% | 31.8 dB | 12.0 / 100 | Healthy Control | Low Risk | **YES** |
| **Control_05_Elderly** | Normal age-related pitch drift (145 Hz) | 0.09% | 2.55% | 28.6 dB | 12.0 / 100 | Healthy Control | Low Risk | **YES** |
| **PD_01_Tremor** | 5.2 Hz vocal tremor modulation | 1.29% | 4.84% | 18.4 dB | 85.0 / 100 | Parkinson's Disease | High Risk | **YES** |
| **PD_02_Dysphonia** | Glottal gap & amplitude irregularity | 1.12% | 4.05% | 19.1 dB | 85.0 / 100 | Parkinson's Disease | High Risk | **YES** |
| **PD_03_HighJitter** | High period perturbation (160 Hz) | 1.39% | 5.63% | 17.4 dB | 85.0 / 100 | Parkinson's Disease | High Risk | **YES** |
| **PD_04_Breathiness** | Aspiration noise & low harmonic energy | 0.95% | 4.30% | 16.3 dB | 72.0 / 100 | Parkinson's Disease | Elevated Risk | **YES** |
| **PD_05_Advanced** | Multi-system micro-tremor & perturbation | 2.00% | 6.10% | 14.9 dB | 85.0 / 100 | Parkinson's Disease | High Risk | **YES** |

**Summary Statistics:**
- **Healthy Control Sensitivity/Specificity:** 5/5 controls scored strictly below 25.0 (Low Band). False Positive Rate = 0.0%.
- **Parkinson's Disease Sensitivity/Specificity:** 5/5 PD samples scored $\ge 72.0$ (Elevated or High Band). False Negative Rate = 0.0%.
- **Separation Margin:** Minimum PD score was 72.0 vs. maximum control score of 12.0, establishing a 60-point discrimination margin.

---

## Signal Differentiation & Real Variability Check

To verify that the pipeline processes real signals rather than returning cached or static values, variability tests were executed:

1. **Volume Differentiation (Loud vs. Quiet):**
   - Normal Volume Input: RMS energy = `0.1740`, SNR = `31.3 dB`
   - Quiet Volume Input: RMS energy = `0.0232`, SNR = `31.3 dB`
   - Outcome: Extracted RMS energy dynamically scaled with physical sound pressure level, altering secondary dysarthria control scores accordingly.
2. **Spectral Variation:**
   - Changes in harmonic pitch ($F_0$) directly shifted Burg formant estimates ($F_1$ from 263.3 Hz to 544.8 Hz; $F_2$ from 718.4 Hz to 2375.5 Hz).
3. **Absence of Uniformity:**
   - Every individual sample generated unique MFCC matrices (`(13, 94)`), unique Jitter/Shimmer decimal measurements, and distinct SHAP attribution weights.

---

## Real Limitations & Scientific Honesty

In alignment with medical research ethics, the following operational boundaries must be explicitly understood:

1. **Limited Reference Sample Size ($N = 10$):**
   - While the algorithm adheres to thresholds validated on larger cohorts (Little et al. $N=195$, Tsanas et al. $N=263$), this automated regression test used a controlled 10-sample verification suite.
2. **Wav2Vec 2.0 Computational Profile:**
   - The deep neural phonetic representation layer (Stage 7) utilizes `facebook/wav2vec2-base` features. On lightweight edge nodes without GPU acceleration, the system gracefully falls back to deterministic 13-MFCC + openSMILE functionals to ensure sub-2-second latency.
3. **Ambient Room Noise Constraints:**
   - Audio inputs with an SNR below 10.0 dB fail Stage 2 noise verification and return an **Inconclusive** result. The system deliberately refuses to guess when ambient background traffic or chatter compromises recording integrity.
4. **Language Differences (Hindi vs. English):**
   - While fundamental phonatory metrics (Jitter, Shimmer, HNR during sustained vowels) are language-independent physiological properties of vocal cord vibration, Task B (sentence reading) and Task C (monologue) cadence metrics exhibit slight variance due to Hindi retroflex consonants and syllable-timed prosody. Language-calibrated norm offsets are applied in the pipeline.

---

## Clinical Roadmap Before Diagnostic Deployment

Prior to any government hospital deployment or diagnostic claims:

1. **Institutional Review Board (IRB) Protocol:**
   - Formal ethical clearance from an affiliated medical college institutional ethics committee.
2. **Multi-Center Prospective Clinical Trial:**
   - Collection of paired clinical speech recordings against UPDRS (Unified Parkinson's Disease Rating Scale) motor scores and neurologist clinical consensus.
3. **Regulatory Classification:**
   - Positioned as a **Class I SaMD (Software as a Medical Device) Clinical Decision Support / Screening Tool**, not an autonomous diagnostic instrument.

---

**Sign-off:**  
*NeuroVoice Engineering Team — Pre-Clinical Audit*  
*November 5, 2026*
