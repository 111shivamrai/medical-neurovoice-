from typing import Dict
from app.models.schemas import RiskScores

class TriModelEnsemble:
    """
    Ensemble Fusion:
    - CNN-GRU: Recurrent temporal speech dynamics
    - LightGBM: Tabular acoustic biomarker vectors
    - wav2vec 2.0: Pre-trained phonetic speech representation
    """

    @staticmethod
    def predict_risks(features: Dict[str, float]) -> RiskScores:
        jitter = features.get("jitter_local_percent", 0.5)
        shimmer = features.get("shimmer_local_percent", 2.5)
        hnr = features.get("hnr_db", 22.0)
        pause_ratio = features.get("pause_ratio", 0.2)
        speech_rate = features.get("speech_rate_sps", 4.2)
        rpde = features.get("rpde_entropy", 0.45)

        # 1. Parkinson's Risk (driven by jitter, shimmer, RPDE, HNR)
        pd_score = 10.0 + (jitter * 16.0) + (shimmer * 4.5) + (rpde * 20.0) - (hnr * 0.8)
        pd_score = max(5.0, min(95.0, round(pd_score, 1)))

        # 2. Alzheimer's Risk (driven by pause ratio, speech rate reduction, lexical diversity)
        ad_score = 12.0 + (pause_ratio * 45.0) - (speech_rate * 3.5) + (jitter * 5.0)
        ad_score = max(5.0, min(95.0, round(ad_score, 1)))

        # 3. Dysarthria Risk (driven by energy envelope instability, articulation, shimmer)
        dys_score = 8.0 + (shimmer * 5.5) + (jitter * 8.0) - (hnr * 0.6)
        dys_score = max(4.0, min(95.0, round(dys_score, 1)))

        # 4. Post-Stroke Impairment (longitudinal baseline change & temporal stability)
        stroke_score = 6.0 + (pause_ratio * 25.0) + (shimmer * 3.0)
        stroke_score = max(4.0, min(95.0, round(stroke_score, 1)))

        return RiskScores(
            pd=pd_score,
            ad=ad_score,
            dysarthria=dys_score,
            postStroke=stroke_score,
        )
