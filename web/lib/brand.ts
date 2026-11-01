/**
 * NeuroVoice Brand & Clinical Framing Constants
 * Single source of truth for terminology, disclaimers, and institutional credits.
 */

export const BRAND = {
  name: 'NeuroVoice',
  tagline: 'Your Voice Knows Before You Do.',
  hindiTagline: 'आपकी आवाज़ में है पहला संकेत।',
  researchDisclaimer: 'PROTOTYPE — Results are for research demonstration and screening support only. Not a clinical diagnosis. Consult a qualified neurologist.',
  shortDisclaimer: 'Research Screening Support Tool — Not a Medical Diagnosis',
  institutionalCredit: 'Developed in collaboration with Jabalpur Medical College',
  
  // Clean terminology (strictly avoided: "medical AI platform", "clinical-grade", "diagnostic", "clinical triage")
  category: 'Vocal Biomarker Research & Screening Support Tool',
  disorderNames: {
    pd: "Parkinson's Disease",
    ad: "Alzheimer's Disease",
    dysarthria: 'Dysarthria',
    postStroke: 'Post-Stroke Cognitive Impairment', // Replaced Post-Stroke Aphasia as required
  },
  
  normativeReferenceNote: 'Placeholder reference values based on clinical literature baselines. Formal population-stratified normative validation is underway.',
  sampleDataNotice: 'Sample data — to be replaced with verified clinical records.',
}
