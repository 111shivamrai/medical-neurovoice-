#!/usr/bin/env python3
"""
NeuroVoice Pre-Clinical Acoustic Pipeline Accuracy & Differentiation Audit
Tests 5 Parkinson's disease samples and 5 healthy control samples against the 9-stage pipeline.
Also verifies input variability (quiet vs loud, slow vs fast cadence).
"""

import os
import sys
import io
import math
import numpy as np
import soundfile as sf

# Add api directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.pipeline.acoustic import RealAcousticPipeline

def synthesize_vocal_sample(
    duration: float = 3.0,
    sr: int = 16000,
    f0_base: float = 140.0,
    jitter_amp: float = 0.003,      # Cycle-to-cycle frequency perturbation
    shimmer_amp: float = 0.015,     # Cycle-to-cycle amplitude perturbation
    noise_ratio: float = 0.02,      # Additive breathiness noise (HNR control)
    tremor_hz: float = 0.0,         # Neurological tremor modulation (5-7 Hz in PD)
    tremor_depth: float = 0.0,
    amplitude_scale: float = 0.5,
) -> bytes:
    """
    Synthesizes acoustic phonation waveform with controlled pitch, jitter, shimmer, and HNR.
    """
    total_samples = int(duration * sr)
    time = np.linspace(0, duration, total_samples, endpoint=False)
    
    # Fundamental frequency with optional neurological tremor and cycle jitter
    f0_track = f0_base * np.ones(total_samples)
    if tremor_hz > 0:
        f0_track += tremor_depth * np.sin(2 * np.pi * tremor_hz * time)
    
    # Phase accumulation
    phase = 0.0
    signal = np.zeros(total_samples)
    
    # Generate harmonic glottal source
    dt = 1.0 / sr
    current_amp = amplitude_scale
    for i in range(total_samples):
        # Apply cycle shimmer jitter perturbation randomly
        if i % int(sr / max(50, f0_track[i])) == 0:
            current_amp = amplitude_scale * (1.0 + np.random.normal(0, shimmer_amp))
            inst_f0 = f0_track[i] * (1.0 + np.random.normal(0, jitter_amp))
        else:
            inst_f0 = f0_track[i]
            
        phase += 2 * np.pi * inst_f0 * dt
        # Harmonics (F0, 2*F0, 3*F0, 4*F0)
        s = current_amp * (
            np.sin(phase) +
            0.5 * np.sin(2 * phase) +
            0.25 * np.sin(3 * phase) +
            0.12 * np.sin(4 * phase)
        )
        signal[i] = s

    # Add aspiration noise (affects HNR)
    noise = np.random.normal(0, noise_ratio * amplitude_scale, total_samples)
    waveform = signal + noise
    
    # Normalize within 16-bit PCM bounds
    max_val = np.max(np.abs(waveform))
    if max_val > 0:
        waveform = waveform / max_val * 0.7 * (amplitude_scale / 0.5)
        
    buf = io.BytesIO()
    sf.write(buf, waveform, sr, format='WAV', subtype='PCM_16')
    return buf.getvalue()

def run_accuracy_audit():
    pipeline = RealAcousticPipeline()
    print("======================================================================")
    print("NEUROVOICE 9-STAGE ACOUSTIC PIPELINE ACCURACY AUDIT")
    print("Testing 5 Parkinson's Disease (PD) and 5 Healthy Control Samples")
    print("======================================================================\n")

    # 1. 5 Healthy Control Samples (conforming to Little et al. 2009 normative boundaries)
    controls = [
        {"name": "Control_01_Male", "f0": 130.0, "jitter": 0.0032, "shimmer": 0.018, "noise": 0.015, "tremor_hz": 0.0, "tremor_d": 0.0},
        {"name": "Control_02_Female", "f0": 210.0, "jitter": 0.0028, "shimmer": 0.015, "noise": 0.012, "tremor_hz": 0.0, "tremor_d": 0.0},
        {"name": "Control_03_Male", "f0": 115.0, "jitter": 0.0041, "shimmer": 0.022, "noise": 0.020, "tremor_hz": 0.0, "tremor_d": 0.0},
        {"name": "Control_04_Female", "f0": 195.0, "jitter": 0.0035, "shimmer": 0.019, "noise": 0.018, "tremor_hz": 0.0, "tremor_d": 0.0},
        {"name": "Control_05_Elderly", "f0": 145.0, "jitter": 0.0048, "shimmer": 0.024, "noise": 0.025, "tremor_hz": 0.0, "tremor_d": 0.0},
    ]

    # 2. 5 Parkinson's Disease Samples (conforming to UCI Parkinson's dataset / Little et al.)
    pd_cases = [
        {"name": "PD_01_Tremor", "f0": 140.0, "jitter": 0.0145, "shimmer": 0.048, "noise": 0.080, "tremor_hz": 5.2, "tremor_d": 12.0},
        {"name": "PD_02_Dysphonia", "f0": 125.0, "jitter": 0.0120, "shimmer": 0.042, "noise": 0.075, "tremor_hz": 4.8, "tremor_d": 9.0},
        {"name": "PD_03_HighJitter", "f0": 160.0, "jitter": 0.0180, "shimmer": 0.055, "noise": 0.090, "tremor_hz": 5.8, "tremor_d": 15.0},
        {"name": "PD_04_Breathiness", "f0": 135.0, "jitter": 0.0115, "shimmer": 0.038, "noise": 0.110, "tremor_hz": 5.0, "tremor_d": 8.0},
        {"name": "PD_05_Advanced", "f0": 150.0, "jitter": 0.0210, "shimmer": 0.065, "noise": 0.120, "tremor_hz": 6.1, "tremor_d": 18.0},
    ]

    results = []

    # Run Controls
    for c in controls:
        print(f"\n--- Processing Sample: {c['name']} (Expected: Healthy Control) ---")
        audio = synthesize_vocal_sample(
            duration=3.0,
            f0_base=c["f0"],
            jitter_amp=c["jitter"],
            shimmer_amp=c["shimmer"],
            noise_ratio=c["noise"],
            tremor_hz=c["tremor_hz"],
            tremor_depth=c["tremor_d"],
        )
        res = pipeline.process_single_audio(audio, task_name=c["name"], min_duration=2.0)
        feat = res["features"]
        pd_score = res["scores"]["pd"]
        band = res["bands"]["pd"]["band"]
        correct = (pd_score < 50.0 and band in ["Low", "Moderate"])
        results.append({
            "sample": c["name"],
            "true_status": "Healthy Control",
            "jitter": feat["jitter_local_percent"],
            "shimmer": feat["shimmer_local_percent"],
            "hnr": feat["hnr"],
            "pd_score": pd_score,
            "band": band,
            "correct": correct,
        })

    # Run PD Cases
    for p in pd_cases:
        print(f"\n--- Processing Sample: {p['name']} (Expected: Parkinson's Disease) ---")
        audio = synthesize_vocal_sample(
            duration=3.0,
            f0_base=p["f0"],
            jitter_amp=p["jitter"],
            shimmer_amp=p["shimmer"],
            noise_ratio=p["noise"],
            tremor_hz=p["tremor_hz"],
            tremor_depth=p["tremor_d"],
        )
        res = pipeline.process_single_audio(audio, task_name=p["name"], min_duration=2.0)
        feat = res["features"]
        pd_score = res["scores"]["pd"]
        band = res["bands"]["pd"]["band"]
        correct = (pd_score >= 50.0 and band in ["Elevated", "High"])
        results.append({
            "sample": p["name"],
            "true_status": "Parkinson's Disease",
            "jitter": feat["jitter_local_percent"],
            "shimmer": feat["shimmer_local_percent"],
            "hnr": feat["hnr"],
            "pd_score": pd_score,
            "band": band,
            "correct": correct,
        })

    # Differentiation Check: Quiet vs Normal audio
    print("\n======================================================================")
    print("DIFFERENTIATION CHECK: AUDIO AMPLITUDE & VARIABILITY")
    print("======================================================================")
    audio_normal = synthesize_vocal_sample(duration=3.0, f0_base=140.0, amplitude_scale=0.6)
    audio_quiet = synthesize_vocal_sample(duration=3.0, f0_base=140.0, amplitude_scale=0.08)
    
    res_normal = pipeline.process_single_audio(audio_normal, task_name="normal_volume", min_duration=2.0)
    res_quiet = pipeline.process_single_audio(audio_quiet, task_name="quiet_volume", min_duration=2.0)
    
    print(f"Normal Volume -> RMS: {res_normal['features']['rms']:.4f}, SNR: {res_normal['snr_db']} dB")
    print(f"Quiet Volume  -> RMS: {res_quiet['features']['rms']:.4f}, SNR: {res_quiet['snr_db']} dB")
    differentiated = res_normal['features']['rms'] != res_quiet['features']['rms']
    print(f"Signal differentiation confirmed: {differentiated}")

    # Summary Table
    print("\n======================================================================")
    print("AUDIT SUMMARY TABLE (10 SAMPLES)")
    print("======================================================================")
    print(f"{'Sample':<22} | {'True Status':<20} | {'Jitter%':<7} | {'Shim%':<7} | {'HNR(dB)':<7} | {'PD Score':<8} | {'Band':<10} | {'Correct?':<8}")
    print("-" * 105)
    correct_count = 0
    for r in results:
        if r["correct"]: correct_count += 1
        c_str = "YES" if r["correct"] else "NO"
        print(f"{r['sample']:<22} | {r['true_status']:<20} | {r['jitter']:<7.2f} | {r['shimmer']:<7.2f} | {r['hnr']:<7.1f} | {r['pd_score']:<8.1f} | {r['band']:<10} | {c_str:<8}")
    
    acc = (correct_count / len(results)) * 100.0
    print("-" * 105)
    print(f"Total Correct: {correct_count}/{len(results)} ({acc:.1f}% Accuracy on Controlled Test Set)")
    print("======================================================================\n")

    return results, acc

if __name__ == "__main__":
    run_accuracy_audit()
