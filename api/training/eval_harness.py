"""
NeuroVoice Clinical Subject-Wise Cross-Validation & Benchmark Harness
Evaluates acoustic feature sets across subject-independent splits to ensure zero data leakage.
Datasets supported:
- UCI Machine Learning Repository (Parkinson Speech Dataset)
- UA-Speech Database (Dysarthria Formant Centralization)
- PC-GITA Multi-Lingual Phonation Corpus
"""

import numpy as np
from typing import Dict, List, Tuple, Any

class SubjectWiseCrossValidator:
    """
    K-Fold Subject-Independent Cross-Validation Harness.
    Guarantees that no patient's recordings are shared between train and test folds.
    """
    def __init__(self, n_splits: int = 5, seed: int = 42):
        self.n_splits = n_splits
        self.seed = seed

    def split(self, subject_ids: List[str]) -> List[Tuple[np.ndarray, np.ndarray]]:
        unique_subjects = np.unique(subject_ids)
        np.random.seed(self.seed)
        shuffled = np.random.permutation(unique_subjects)
        folds = np.array_split(shuffled, self.n_splits)

        splits = []
        subject_arr = np.array(subject_ids)
        for fold_subjects in folds:
            test_mask = np.isin(subject_arr, fold_subjects)
            train_mask = ~test_mask
            splits.append((np.where(train_mask)[0], np.where(test_mask)[0]))
        return splits

    def evaluate_metrics(self, y_true: np.ndarray, y_pred: np.ndarray) -> Dict[str, float]:
        """
        Calculates sensitivity, specificity, accuracy, and balanced accuracy.
        """
        tp = np.sum((y_true == 1) & (y_pred == 1))
        tn = np.sum((y_true == 0) & (y_pred == 0))
        fp = np.sum((y_true == 0) & (y_pred == 1))
        fn = np.sum((y_true == 1) & (y_pred == 0))

        sensitivity = tp / (tp + fn + 1e-8)
        specificity = tn / (tn + fp + 1e-8)
        accuracy = (tp + tn) / (len(y_true) + 1e-8)
        balanced_acc = (sensitivity + specificity) / 2.0

        return {
            "sensitivity": round(float(sensitivity), 4),
            "specificity": round(float(specificity), 4),
            "accuracy": round(float(accuracy), 4),
            "balanced_accuracy": round(float(balanced_acc), 4),
        }

if __name__ == "__main__":
    cv = SubjectWiseCrossValidator(n_splits=5)
    sample_subjects = ["sub-01", "sub-01", "sub-02", "sub-03", "sub-03", "sub-04", "sub-05"]
    splits = cv.split(sample_subjects)
    print(f"Generated {len(splits)} subject-independent evaluation splits successfully.")
