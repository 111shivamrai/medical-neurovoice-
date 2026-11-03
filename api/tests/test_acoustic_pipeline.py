import unittest
import numpy as np
import io
import soundfile as sf
from app.pipeline.acoustic import RealAcousticPipeline

class TestRealAcousticPipeline(unittest.TestCase):
    def setUp(self):
        self.pipeline = RealAcousticPipeline()
        
        # Generate a synthetic 3-second 440Hz test audio WAV buffer
        sr = 16000
        t = np.linspace(0, 3.2, int(sr * 3.2), endpoint=False)
        audio_data = 0.5 * np.sin(2 * np.pi * 440 * t)
        
        buf = io.BytesIO()
        sf.write(buf, audio_data, sr, format='WAV')
        self.test_wav_3s = buf.getvalue()

        # Generate a synthetic 15.5-second test audio WAV buffer
        t15 = np.linspace(0, 15.5, int(sr * 15.5), endpoint=False)
        audio_data15 = 0.5 * np.sin(2 * np.pi * 220 * t15)
        buf15 = io.BytesIO()
        sf.write(buf15, audio_data15, sr, format='WAV')
        self.test_wav_15s = buf15.getvalue()

    def test_single_audio_processing(self):
        res = self.pipeline.process_audio(
            audio_bytes=self.test_wav_3s,
            filename="test.wav",
            language="hi",
        )
        self.assertIn("risk_scores", res)
        self.assertIn("bands", res)
        self.assertIn("shap_values", res)
        self.assertIn("quality", res)
        self.assertGreater(len(res["shap_values"]), 0)

    def test_three_tasks_processing(self):
        res = self.pipeline.process_three_tasks(
            audio_a=self.test_wav_3s,
            audio_b=self.test_wav_3s,
            audio_c=self.test_wav_15s,
            language="en",
        )
        self.assertIn("risk_scores", res)
        self.assertIn("bands", res)
        self.assertIn("shap_values", res)
        self.assertIn("tasks", res)
        self.assertIn("suggestions", res)
        self.assertIn("recommended_specialist", res)

if __name__ == '__main__':
    unittest.main()
