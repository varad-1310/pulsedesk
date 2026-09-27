"use client";

import React, { useState } from "react";
import Button from "./Button";
import { useToast } from "./ToastProvider";

interface PresetSymptom {
  label: string;
  symptoms: string;
  vitals: string;
  level: "P1 - Critical" | "P2 - Emergent" | "P3 - Urgent";
  suggestedAction: string;
  recommendedUnit: "ALS (Advanced Life Support)" | "BLS" | "Trauma Bay";
  confidence: number;
}

const PRESETS: PresetSymptom[] = [
  {
    label: "Chest Pain / STEMI Suspicion",
    symptoms: "Crushing retrosternal chest pain radiating to left jaw, diaphoresis, dyspnea",
    vitals: "HR: 114 bpm, BP: 90/60 mmHg, SpO2: 93%",
    level: "P1 - Critical",
    suggestedAction: "Stat 12-lead ECG, activate Cardiac Catheterization Lab, prepare IV Heparin & Aspirin 325mg",
    recommendedUnit: "ALS (Advanced Life Support)",
    confidence: 96,
  },
  {
    label: "Acute Respiratory Distress",
    symptoms: "Severe wheezing, accessory muscle use, cyanotic lips, unable to speak full sentences",
    vitals: "HR: 128 bpm, BP: 140/92 mmHg, SpO2: 84%",
    level: "P1 - Critical",
    suggestedAction: "High-flow non-rebreather mask 15L/min, continuous nebulization, prepare Rapid Sequence Intubation",
    recommendedUnit: "ALS (Advanced Life Support)",
    confidence: 94,
  },
  {
    label: "High-Speed Highway Trauma",
    symptoms: "Blunt thoracic trauma, suspected pelvic fracture, altered mental status GCS 11",
    vitals: "HR: 136 bpm, BP: 82/50 mmHg, SpO2: 91%",
    level: "P1 - Critical",
    suggestedAction: "Activate Massive Transfusion Protocol, reserve 2 units O-negative blood, alert Trauma Surgery team",
    recommendedUnit: "Trauma Bay",
    confidence: 98,
  },
  {
    label: "Suspected Acute Stroke (FAST+)",
    symptoms: "Right-sided hemiparesis, sudden facial droop, expressive aphasia, onset < 45 mins",
    vitals: "HR: 88 bpm, BP: 175/105 mmHg, SpO2: 97%",
    level: "P2 - Emergent",
    suggestedAction: "Clear non-contrast Head CT urgently, evaluate for IV tPA thrombolysis window",
    recommendedUnit: "ALS (Advanced Life Support)",
    confidence: 91,
  },
];

export default function AiTriageAssistant() {
  const { showToast } = useToast();
  const [selectedPreset, setSelectedPreset] = useState<PresetSymptom>(PRESETS[0]);
  const [customSymptom, setCustomSymptom] = useState(PRESETS[0].symptoms);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<PresetSymptom | null>(PRESETS[0]);

  function handleSelectPreset(preset: PresetSymptom) {
    setSelectedPreset(preset);
    setCustomSymptom(preset.symptoms);
    setAnalysisResult(preset);
  }

  function handleRunAnalysis() {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisResult(selectedPreset);
      showToast("AI Triage Complete", `Risk Level: ${selectedPreset.level}`, "info");
    }, 700);
  }

  return (
    <div className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50/70 via-white to-blue-50/60 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-indigo-100/80 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-indigo-600 text-white text-xs font-black shadow-xs">
              ✦
            </span>
            <h3 className="font-extrabold text-slate-900 text-base">
              PulseAI Clinical Triage & Urgency Predictor
            </h3>
            <span className="rounded-full bg-indigo-100 text-indigo-700 font-bold text-[10px] px-2 py-0.5 border border-indigo-200">
              MED-TRIAGE LLM v4.2
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time algorithmic risk stratifier for emergency triage and ambulance allocation
          </p>
        </div>

        {/* Rapid Presets */}
        <div className="flex flex-wrap items-center gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => handleSelectPreset(p)}
              className={`rounded-xl px-2.5 py-1 text-xs font-semibold transition-all ${
                selectedPreset.label === p.label
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {p.label.split("/")[0].trim()}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-12">
        {/* Left Input Field (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Patient Presentation / Vitals Feed
            </label>
            <textarea
              rows={3}
              value={customSymptom}
              onChange={(e) => setCustomSymptom(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white p-3.5 text-xs font-medium text-slate-800 shadow-inner outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              placeholder="Describe clinical presentation, trauma markers, or vitals..."
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-mono">
              Vitals: {selectedPreset.vitals}
            </span>
            <Button
              variant="primary"
              size="sm"
              icon={isAnalyzing ? "⚙️" : "✦"}
              onClick={handleRunAnalysis}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {isAnalyzing ? "Evaluating Matrix..." : "Calculate Urgency Score"}
            </Button>
          </div>
        </div>

        {/* Right Output Recommendation (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-white p-4 border border-indigo-100 shadow-xs flex flex-col justify-between">
          {analysisResult && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Recommended Protocol
                </span>
                <span className="rounded-full bg-rose-100 text-rose-800 font-extrabold text-[11px] px-2.5 py-0.5 border border-rose-200">
                  {analysisResult.level}
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 leading-snug">
                  {analysisResult.suggestedAction}
                </h4>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px]">
                <div className="rounded-xl bg-slate-50 p-2">
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">
                    Vehicle Type
                  </span>
                  <span className="font-bold text-slate-800">
                    {analysisResult.recommendedUnit}
                  </span>
                </div>
                <div className="rounded-xl bg-slate-50 p-2">
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">
                    AI Confidence
                  </span>
                  <span className="font-bold text-emerald-600">
                    {analysisResult.confidence}% High Match
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
