import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Download, Share2, Upload, AlertCircle, FileText, ArrowRight, CheckCircle2, ShieldCheck, Zap, Activity, Heart, Award, ShieldAlert, ChevronDown, ChevronUp, Sparkles, MessageCircle, ArrowLeft, AlertTriangle } from 'lucide-react';
import { ScoreGauge } from '@/components/ScoreGauge';
import { cn } from '@/lib/utils';

interface ScoreStepData {
    name: string;
    score: number;
    max_score: number;
    details: string;
    sub_steps?: string[];
}

interface ScoringDetails {
    total_raw: number;
    total_normalized: number;
    absolute_barrier: boolean;
    barrier_reason?: string;
    component_scores: Record<string, number>;
    steps: ScoreStepData[];
}

interface CombinedDetails {
    combined_bio_score: number;
    lifestyle_multiplier: number;
    behavioral_multiplier: number;
    final_score: number;
    mfr_percent: number;
    mfr_category: string;
    prob_6m: number;
    prob_12m: number;
    recommendation: string;
    steps: ScoreStepData[];
}

interface FullAnalysisResult {
    extraction: {
        female_pdf_text_preview: string;
        male_pdf_text_preview: string;
        female_llm_structured: any;
        male_llm_structured: any;
    };
    female_scoring: ScoringDetails;
    male_scoring: ScoringDetails;
    combined_result: CombinedDetails;
}

// Sensible simulated fallback result for first page loads
const fallbackResult: FullAnalysisResult = {
    extraction: {
        female_pdf_text_preview: "",
        male_pdf_text_preview: "",
        female_llm_structured: {
            data: {
                name: "Anjali Sharma",
                age: 28,
                amh: 3.2,
                fsh: 6.8,
                tsh: 4.2,
                prolactin: 15.5,
                estradiol: 45.0,
            }
        },
        male_llm_structured: {
            data: {
                name: "Rahul Sharma",
                age: 31,
                semen_volume_ml: 3.0,
                sperm_concentration_million_per_ml: 45,
                total_motility_percent: 65,
                progressive_motility_percent: 55,
                sperm_morphology_normal_percent: 6,
                total_testosterone: 550,
            }
        }
    },
    female_scoring: {
        total_raw: 92,
        total_normalized: 80.0,
        absolute_barrier: false,
        component_scores: {
            age: 23,
            ovarian_reserve: 20,
            menstrual_ovulation: 20,
            hormonal_balance: 14,
            structural: 15,
            clinical_conditions: 15
        },
        steps: [
            { name: "3.1 Age-Adjusted Fertility Score", score: 23, max_score: 25, details: "Age 28 → Excellent fertility potential (23/25 pts)" },
            { name: "3.2 Ovarian Reserve Score", score: 20, max_score: 20, details: "AMH 3.2 ng/mL | FSH 6.8 mIU/mL → Optimal reserve (20/20 pts)" },
            { name: "3.3 Menstrual & Ovulation Score", score: 20, max_score: 20, details: "Regular cycles (28 days) with confirmed ovulation (20/20 pts)" },
            { name: "3.4 Hormonal Balance Score", score: 14, max_score: 20, details: "TSH 4.2 mIU/L (Borderline high) | Prolactin 15.5 (14/20 pts)" },
            { name: "3.5 Structural Health Score", score: 15, max_score: 15, details: "Normal uterus & ovaries, patent Fallopian tubes (15/15 pts)" },
            { name: "3.6 Clinical Conditions Score", score: 15, max_score: 15, details: "No PCOS or Endometriosis features (15/15 pts)" }
        ]
    },
    male_scoring: {
        total_raw: 94,
        total_normalized: 81.7,
        absolute_barrier: false,
        component_scores: {
            age: 24,
            semen_analysis: 36,
            hormonal_profile: 19,
            structural: 15,
            dfi: 12
        },
        steps: [
            { name: "4.1 Age-Adjusted Score", score: 24, max_score: 25, details: "Age 31 → Peak male range (24/25 pts)" },
            { name: "4.2 Semen Analysis Score", score: 36, max_score: 40, details: "Conc 45M/mL | Motility 55% | Morphology 6% (36/40 pts)" },
            { name: "4.3 Hormonal Profile Score", score: 19, max_score: 20, details: "Total Testosterone 550 ng/dL | FSH 4.2 (19/20 pts)" },
            { name: "4.4 Structural Assessment Score", score: 15, max_score: 15, details: "Normal testicular volume, no varicocele (15/15 pts)" },
            { name: "4.5 DNA Fragmentation Index", score: 12, max_score: 15, details: "DFI 18% → Good range (12/15 pts)" }
        ]
    },
    combined_result: {
        combined_bio_score: 80.9,
        lifestyle_multiplier: 0.94,
        behavioral_multiplier: 0.85,
        final_score: 64.6,
        mfr_percent: 16.2,
        mfr_category: "Good (15-19%)",
        prob_6m: 64.6,
        prob_12m: 87.5,
        recommendation: "Strong fertility compatibility overall. Biological scores for both partners are high. Her borderline high TSH level (4.2) and Vitamin D deficiency should be optimized with supplements, but they do not pose an absolute barrier to natural conception.",
        steps: [
            { name: "5.1 Combined Biological Score", score: 80.9, max_score: 100, details: "Bottleneck gap is small (1.7 pts) → Average of scores: 80.9/100" },
            { name: "6. Lifestyle Multiplier", score: 0.94, max_score: 1.00, details: "Combined score ×0.94 (penalized slightly for mild stress and irregular sleep)" },
            { name: "7. Behavioral Timing Multiplier", score: 0.85, max_score: 1.00, details: "Coital frequency timed around ovulation tracking app (×0.85)" }
        ]
    }
};

const SampleReportPage = () => {
    const { id } = useParams<{ id: string }>();
    const { session } = useApp();
    const navigate = useNavigate();

    const [femaleFile, setFemaleFile] = useState<File | null>(null);
    const [maleFile, setMaleFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'insights' | 'female' | 'male' | 'combined'>('insights');
    const [analysisResult, setAnalysisResult] = useState<FullAnalysisResult | null>(null);



    // Manual override state variables
    const [femaleAgeOverride, setFemaleAgeOverride] = useState<string>("27");
    const [femaleBmi, setFemaleBmi] = useState<number>(22.0);
    const [femaleSmoker, setFemaleSmoker] = useState<boolean>(false);
    const [femaleAlcohol, setFemaleAlcohol] = useState<number>(0);
    const [femaleExercise, setFemaleExercise] = useState<number>(3.0);
    const [femaleSleep, setFemaleSleep] = useState<number>(7.0);
    const [femaleStress, setFemaleStress] = useState<string>("Moderate");

    const [cycleLength, setCycleLength] = useState<number>(28);
    const [flowDuration, setFlowDuration] = useState<number>(5);
    const [painLevel, setPainLevel] = useState<string>("Minimal");
    const [pcosPhenotype, setPcosPhenotype] = useState<string>("None");
    const [endoStage, setEndoStage] = useState<string>("None");
    const [structuralFinding, setStructuralFinding] = useState<string>(
        "Normal uterus, normal ovaries, both tubes patent"
    );
    const [bilateralTubalBlock, setBilateralTubalBlock] = useState<boolean>(false);

    const [maleAgeOverride, setMaleAgeOverride] = useState<string>("31");
    const [maleBmi, setMaleBmi] = useState<number>(23.0);
    const [maleSmoker, setMaleSmoker] = useState<boolean>(false);
    const [maleAlcohol, setMaleAlcohol] = useState<number>(0);
    const [maleExercise, setMaleExercise] = useState<number>(3.0);
    const [maleSleep, setMaleSleep] = useState<number>(7.0);
    const [maleStress, setMaleStress] = useState<string>("Moderate");
    const [varicoceleGrade, setVaricoceleGrade] = useState<string>("None");
    const [dfiInput, setDfiInput] = useState<string>("");
    const [testicularVolume, setTesticularVolume] = useState<string>("");

    const [coitalFrequency, setCoitalFrequency] = useState<string>("Good");
    const [ovulationTracking, setOvulationTracking] = useState<string>("App");
    const [cityTier, setCityTier] = useState<string>("Metro");
    const [pm25, setPm25] = useState<number>(75.0);
    const [airPurifier, setAirPurifier] = useState<boolean>(false);
    const [occupationalHazard, setOccupationalHazard] = useState<string>("None");

    // Collapsible states
    const [femaleContextOpen, setFemaleContextOpen] = useState<boolean>(false);
    const [maleContextOpen, setMaleContextOpen] = useState<boolean>(false);
    const [coupleContextOpen, setCoupleContextOpen] = useState<boolean>(false);

    useEffect(() => {
        if (!id || !session?.access_token) return;
        
        const fetchMatch = async () => {
            try {
                const res = await fetch(`http://localhost:4000/api/matches/${id}`, {
                    headers: {
                        "Authorization": `Bearer ${session.access_token}`
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    
                    // Prepopulate manual overrides from database
                    const populateLifestyle = (person: any) => {
                        if (!person || !person.lifestyle) return;
                        const l = person.lifestyle;
                        const ageStr = person.age?.toString() || "";
                        
                        let bmi = 22.0;
                        if (l.weightValue && l.heightValue) {
                            const hMeters = l.heightUnit === 'cm' ? l.heightValue / 100 : (l.heightUnit === 'in' ? l.heightValue * 0.0254 : l.heightValue);
                            const wKg = l.weightUnit === 'kg' ? l.weightValue : (l.weightUnit === 'lbs' ? l.weightValue * 0.453592 : l.weightValue);
                            bmi = Number((wKg / (hMeters * hMeters)).toFixed(1));
                        }

                        const isSmoker = l.smokingHabit && l.smokingHabit !== 'Never';
                        let alcohol = 0;
                        if (l.drinkingHabit === 'Socially') alcohol = 2;
                        else if (l.drinkingHabit === 'Regularly') alcohol = 7;
                        
                        let exercise = 3.0;
                        if (l.activityLevel === 'Active') exercise = 5.0;
                        else if (l.activityLevel === 'Sedentary') exercise = 1.0;
                        
                        let sleep = 7.0;
                        if (l.sleepPattern === 'Less than 6 hours') sleep = 5.5;
                        else if (l.sleepPattern === 'More than 8 hours') sleep = 8.5;
                        
                        let stress = "Moderate";
                        if (l.workStyle === 'High Stress') stress = "High";
                        
                        if (person.gender === 'female') {
                            if (ageStr) setFemaleAgeOverride(ageStr);
                            setFemaleBmi(bmi);
                            setFemaleSmoker(isSmoker);
                            setFemaleAlcohol(alcohol);
                            setFemaleExercise(exercise);
                            setFemaleSleep(sleep);
                            setFemaleStress(stress);
                        } else if (person.gender === 'male') {
                            if (ageStr) setMaleAgeOverride(ageStr);
                            setMaleBmi(bmi);
                            setMaleSmoker(isSmoker);
                            setMaleAlcohol(alcohol);
                            setMaleExercise(exercise);
                            setMaleSleep(sleep);
                            setMaleStress(stress);
                        }
                    };

                    populateLifestyle(data.user);
                    populateLifestyle(data.prospect);

                    if (data.analysisResults && data.analysisResults.length > 0) {
                        setAnalysisResult(data.analysisResults[0].resultData);
                        setActiveTab('insights');
                    }
                }
            } catch (err) {
                console.error("Failed to fetch match", err);
            }
        };
        fetchMatch();
    }, [id, session]);

    const handleFemaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFemaleFile(e.target.files[0]);
            setError(null);
        }
    };

    const handleMaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setMaleFile(e.target.files[0]);
            setError(null);
        }
    };

    const handleUploadAndAnalyze = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!femaleFile || !maleFile) {
            setError("Please upload both Female and Male PDF health reports to begin analysis.");
            return;
        }

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append("female_pdf", femaleFile);
        formData.append("male_pdf", maleFile);

        // Appending all manual overrides & metadata
        if (femaleAgeOverride.trim()) {
            formData.append("female_age", femaleAgeOverride);
        }
        formData.append("female_bmi", femaleBmi.toString());
        formData.append("female_smoker", femaleSmoker.toString());
        formData.append("female_alcohol", femaleAlcohol.toString());
        formData.append("female_exercise", femaleExercise.toString());
        formData.append("female_sleep", femaleSleep.toString());
        formData.append("female_stress", femaleStress);
        formData.append("cycle_length_days", cycleLength.toString());
        formData.append("flow_duration_days", flowDuration.toString());
        formData.append("pain_level", painLevel);
        formData.append("pcos_phenotype", pcosPhenotype);
        formData.append("endometriosis_stage", endoStage);
        formData.append("structural_finding", structuralFinding);
        formData.append("bilateral_tubal_block", bilateralTubalBlock.toString());

        if (maleAgeOverride.trim()) {
            formData.append("male_age", maleAgeOverride);
        }
        formData.append("male_bmi", maleBmi.toString());
        formData.append("male_smoker", maleSmoker.toString());
        formData.append("male_alcohol", maleAlcohol.toString());
        formData.append("male_exercise", maleExercise.toString());
        formData.append("male_sleep", maleSleep.toString());
        formData.append("male_stress", maleStress);
        formData.append("varicocele_grade", varicoceleGrade);
        if (dfiInput.trim()) {
            formData.append("dfi", dfiInput);
        }
        if (testicularVolume.trim()) {
            formData.append("testicular_volume", testicularVolume);
        }

        formData.append("coital_frequency", coitalFrequency);
        formData.append("ovulation_tracking", ovulationTracking);
        formData.append("regional_city_tier", cityTier);
        formData.append("pm25", pm25.toString());
        formData.append("air_purifier", airPurifier.toString());
        formData.append("occupational_hazard", occupationalHazard);
        if (!id) {
            setError("No match ID found. Please go back to dashboard and select a match.");
            return;
        }
        
        try {
            const response = await fetch(`http://localhost:4000/api/matches/${id}/analyze`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${session?.access_token}`
                },
                body: formData,
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.details?.detail || errData.error || "Analysis failed. Ensure valid PDFs are uploaded.");
            }

            const data = await response.json();
            const result = data.analysisResults?.[0]?.resultData || data.data || data;
            setAnalysisResult(result);
            setActiveTab('combined');
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred during report analysis.");
        } finally {
            setLoading(false);
        }
    };

    const baseResult = analysisResult || fallbackResult;
    const activeResult = baseResult.stage1 ? baseResult.stage1 : baseResult;

    // Destructure active data segments
    const fSc = activeResult.female_scoring || { total_normalized: 0, steps: [] };
    const mSc = activeResult.male_scoring || { total_normalized: 0, steps: [] };
    const comb = activeResult.combined_result || { final_score: 0, steps: [] };
    const fLlm = activeResult.extraction?.female_llm_structured?.data || {};
    const mLlm = activeResult.extraction?.male_llm_structured?.data || {};
    
    // Stage 2 data
    const s2 = baseResult.stage2?.data || null;

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Page Header */}
            <section className="bg-white pt-20 pb-8 border-b border-slate-200">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 font-sans">Lab-Driven Premarital Compatibility Analysis</h1>
                            <p className="text-slate-600">Analyze raw clinical markers from NABL reports to compute biological match scores.</p>
                        </div>
                        {analysisResult && (
                            <div className="flex gap-3">
                                <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-sm font-medium transition-colors">
                                    <Share2 className="w-4 h-4" /> Share
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 bg-[#17CB96] text-white rounded-lg hover:bg-[#15b586] text-sm font-medium shadow-sm transition-colors">
                                    <Download className="w-4 h-4" /> Download PDF
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12">
                <div className="grid lg:grid-cols-[1fr_2.4fr] gap-8 max-w-7xl mx-auto">
                    
                    {/* Left Column: File Drop-zones */}
                    <div className="flex flex-col gap-6">
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 mb-4 font-sans flex items-center gap-2">
                                <Upload className="w-5 h-5 text-[#17CB96]" />
                                Analyze Lab Reports
                            </h3>
                            <form onSubmit={handleUploadAndAnalyze} className="space-y-5">
                                {/* Female Upload */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                        Female Health Report (PDF)
                                    </label>
                                    <div className="relative border-2 border-dashed border-slate-200 hover:border-[#17CB96] rounded-xl p-4 text-center cursor-pointer transition-all">
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={handleFemaleChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        <div className="flex flex-col items-center gap-2">
                                            {femaleFile ? (
                                                <>
                                                    <FileText className="w-8 h-8 text-[#17CB96]" />
                                                    <span className="text-sm font-medium text-slate-700 truncate max-w-full px-2">
                                                        {femaleFile.name}
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <Upload className="w-8 h-8 text-slate-400" />
                                                    <span className="text-xs text-slate-500">Upload Female Lab Report</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Male Upload */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                        Male Semen/Hormone Report (PDF)
                                    </label>
                                    <div className="relative border-2 border-dashed border-slate-200 hover:border-[#17CB96] rounded-xl p-4 text-center cursor-pointer transition-all">
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={handleMaleChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        <div className="flex flex-col items-center gap-2">
                                            {maleFile ? (
                                                <>
                                                    <FileText className="w-8 h-8 text-[#17CB96]" />
                                                    <span className="text-sm font-medium text-slate-700 truncate max-w-full px-2">
                                                        {maleFile.name}
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <Upload className="w-8 h-8 text-slate-400" />
                                                    <span className="text-xs text-slate-500">Upload Male Lab Report</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Collapsible Overrides Section */}
                                <div className="space-y-3 mt-4 pt-4 border-t border-slate-100">
                                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                        Manual Overrides & Context
                                    </h4>

                                    {/* 1. Female Context Accordion */}
                                    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
                                        <button
                                            type="button"
                                            onClick={() => setFemaleContextOpen(!femaleContextOpen)}
                                            className="w-full flex justify-between items-center p-3 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100/80 transition-colors"
                                        >
                                            <span className="flex items-center gap-1.5">👩 Female Factors</span>
                                            {femaleContextOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                        </button>
                                        {femaleContextOpen && (
                                            <div className="p-3.5 space-y-3.5 border-t border-slate-150 text-xs text-slate-600">
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Age Override</label>
                                                        <input
                                                            type="number"
                                                            value={femaleAgeOverride}
                                                            onChange={(e) => setFemaleAgeOverride(e.target.value)}
                                                            className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#17CB96] text-xs font-medium"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-slate-500 mb-1">BMI</label>
                                                        <input
                                                            type="number"
                                                            step="0.1"
                                                            value={femaleBmi}
                                                            onChange={(e) => setFemaleBmi(Number(e.target.value))}
                                                            className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#17CB96] text-xs font-medium"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Alcohol (units/wk)</label>
                                                        <input
                                                            type="number"
                                                            value={femaleAlcohol}
                                                            onChange={(e) => setFemaleAlcohol(Number(e.target.value))}
                                                            className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#17CB96] text-xs font-medium"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Exercise (hrs/wk)</label>
                                                        <input
                                                            type="number"
                                                            step="0.5"
                                                            value={femaleExercise}
                                                            onChange={(e) => setFemaleExercise(Number(e.target.value))}
                                                            className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#17CB96] text-xs font-medium"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Sleep (hrs/night)</label>
                                                        <input
                                                            type="number"
                                                            step="0.5"
                                                            value={femaleSleep}
                                                            onChange={(e) => setFemaleSleep(Number(e.target.value))}
                                                            className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#17CB96] text-xs font-medium"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Stress Level</label>
                                                        <select
                                                            value={femaleStress}
                                                            onChange={(e) => setFemaleStress(e.target.value)}
                                                            className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#17CB96] text-xs font-medium"
                                                        >
                                                            <option value="Low">Low</option>
                                                            <option value="Moderate">Moderate</option>
                                                            <option value="High">High</option>
                                                            <option value="Severe">Severe</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Cycle Length (days)</label>
                                                        <input
                                                            type="number"
                                                            value={cycleLength}
                                                            onChange={(e) => setCycleLength(Number(e.target.value))}
                                                            className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#17CB96] text-xs font-medium"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Flow Duration (days)</label>
                                                        <input
                                                            type="number"
                                                            value={flowDuration}
                                                            onChange={(e) => setFlowDuration(Number(e.target.value))}
                                                            className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#17CB96] text-xs font-medium"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-3 gap-2">
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Dysmenorrhea</label>
                                                        <select
                                                            value={painLevel}
                                                            onChange={(e) => setPainLevel(e.target.value)}
                                                            className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#17CB96] text-xs font-medium"
                                                        >
                                                            <option value="Minimal">Minimal</option>
                                                            <option value="Moderate">Moderate</option>
                                                            <option value="Severe">Severe</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-slate-500 mb-1">PCOS Pheno</label>
                                                        <select
                                                            value={pcosPhenotype}
                                                            onChange={(e) => setPcosPhenotype(e.target.value)}
                                                            className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#17CB96] text-xs font-medium"
                                                        >
                                                            <option value="None">None</option>
                                                            <option value="A">A</option>
                                                            <option value="B">B</option>
                                                            <option value="C">C</option>
                                                            <option value="D">D</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Endometriosis</label>
                                                        <select
                                                            value={endoStage}
                                                            onChange={(e) => setEndoStage(e.target.value)}
                                                            className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#17CB96] text-xs font-medium"
                                                        >
                                                            <option value="None">None</option>
                                                            <option value="1">Stage 1</option>
                                                            <option value="2">Stage 2</option>
                                                            <option value="3">Stage 3</option>
                                                            <option value="4">Stage 4</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Structural Finding (TVS/HSG)</label>
                                                    <select
                                                        value={structuralFinding}
                                                        onChange={(e) => setStructuralFinding(e.target.value)}
                                                        className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#17CB96] text-xs font-medium"
                                                    >
                                                        <option value="Normal uterus, normal ovaries, both tubes patent">Normal uterus/ovaries, patent tubes</option>
                                                        <option value="Small fibroids (<3cm, intramural)">Small fibroids (&lt;3cm)</option>
                                                        <option value="Medium fibroids (3-5cm, intramural)">Medium fibroids (3-5cm)</option>
                                                        <option value="Large fibroids (>5cm) or multiple">Large fibroids (&gt;5cm)</option>
                                                        <option value="Submucosal fibroid (in cavity)">Submucosal fibroid</option>
                                                        <option value="Endometrial polyp">Endometrial polyp</option>
                                                        <option value="Thin endometrium (<7mm mid-cycle)">Thin endometrium (&lt;7mm)</option>
                                                        <option value="Adenomyosis (mild)">Adenomyosis (mild)</option>
                                                        <option value="Adenomyosis (severe)">Adenomyosis (severe)</option>
                                                        <option value="Ovarian cysts (functional)">Ovarian cysts (functional)</option>
                                                        <option value="Endometrioma (chocolate cyst <4cm)">Endometrioma (&lt;4cm)</option>
                                                        <option value="Endometrioma (>4cm or bilateral)">Endometrioma (&gt;4cm/bilat)</option>
                                                        <option value="Hydrosalpinx (unilateral)">Hydrosalpinx (unilateral)</option>
                                                        <option value="Hydrosalpinx (bilateral)">Hydrosalpinx (bilateral)</option>
                                                        <option value="One tube blocked, one patent">One tube blocked, one patent</option>
                                                    </select>
                                                </div>

                                                <div className="flex items-center gap-2 pt-1.5">
                                                    <input
                                                        type="checkbox"
                                                        id="f_smoker"
                                                        checked={femaleSmoker}
                                                        onChange={(e) => setFemaleSmoker(e.target.checked)}
                                                        className="rounded border-slate-350 text-[#17CB96] focus:ring-[#17CB96] h-4 w-4"
                                                    />
                                                    <label htmlFor="f_smoker" className="font-semibold text-slate-700">Active Smoker</label>
                                                </div>

                                                <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                                                    <input
                                                        type="checkbox"
                                                        id="bilateral_block"
                                                        checked={bilateralTubalBlock}
                                                        onChange={(e) => setBilateralTubalBlock(e.target.checked)}
                                                        className="rounded border-slate-350 text-rose-500 focus:ring-rose-500 h-4 w-4"
                                                    />
                                                    <label htmlFor="bilateral_block" className="font-semibold text-rose-700">Bilateral Tubal Block (ABSOLUTE BARRIER)</label>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* 2. Male Context Accordion */}
                                    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
                                        <button
                                            type="button"
                                            onClick={() => setMaleContextOpen(!maleContextOpen)}
                                            className="w-full flex justify-between items-center p-3 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100/80 transition-colors"
                                        >
                                            <span className="flex items-center gap-1.5">👨 Male Factors</span>
                                            {maleContextOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                        </button>
                                        {maleContextOpen && (
                                            <div className="p-3.5 space-y-3.5 border-t border-slate-150 text-xs text-slate-600">
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Age Override</label>
                                                        <input
                                                            type="number"
                                                            value={maleAgeOverride}
                                                            onChange={(e) => setMaleAgeOverride(e.target.value)}
                                                            className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#17CB96] text-xs font-medium"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-slate-500 mb-1">BMI</label>
                                                        <input
                                                            type="number"
                                                            step="0.1"
                                                            value={maleBmi}
                                                            onChange={(e) => setMaleBmi(Number(e.target.value))}
                                                            className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#17CB96] text-xs font-medium"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Alcohol (units/wk)</label>
                                                        <input
                                                            type="number"
                                                            value={maleAlcohol}
                                                            onChange={(e) => setMaleAlcohol(Number(e.target.value))}
                                                            className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#17CB96] text-xs font-medium"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Exercise (hrs/wk)</label>
                                                        <input
                                                            type="number"
                                                            step="0.5"
                                                            value={maleExercise}
                                                            onChange={(e) => setMaleExercise(Number(e.target.value))}
                                                            className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#17CB96] text-xs font-medium"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Sleep (hrs/night)</label>
                                                        <input
                                                            type="number"
                                                            step="0.5"
                                                            value={maleSleep}
                                                            onChange={(e) => setMaleSleep(Number(e.target.value))}
                                                            className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#17CB96] text-xs font-medium"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Stress Level</label>
                                                        <select
                                                            value={maleStress}
                                                            onChange={(e) => setMaleStress(e.target.value)}
                                                            className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#17CB96] text-xs font-medium"
                                                        >
                                                            <option value="Low">Low</option>
                                                            <option value="Moderate">Moderate</option>
                                                            <option value="High">High</option>
                                                            <option value="Severe">Severe</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-3 gap-2">
                                                    <div className="col-span-2">
                                                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Varicocele Grade</label>
                                                        <select
                                                            value={varicoceleGrade}
                                                            onChange={(e) => setVaricoceleGrade(e.target.value)}
                                                            className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#17CB96] text-xs font-medium"
                                                        >
                                                            <option value="None">None</option>
                                                            <option value="Subclinical">Subclinical</option>
                                                            <option value="Grade1">Grade 1</option>
                                                            <option value="Grade2">Grade 2</option>
                                                            <option value="Grade3">Grade 3</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-slate-500 mb-1">DFI %</label>
                                                        <input
                                                            type="number"
                                                            value={dfiInput}
                                                            placeholder="N/A"
                                                            onChange={(e) => setDfiInput(e.target.value)}
                                                            className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#17CB96] text-xs font-medium"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Testicular Volume (mL, if known)</label>
                                                    <input
                                                        type="number"
                                                        value={testicularVolume}
                                                        placeholder="N/A"
                                                        onChange={(e) => setTesticularVolume(e.target.value)}
                                                        className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#17CB96] text-xs font-medium"
                                                    />
                                                </div>

                                                <div className="flex items-center gap-2 pt-1.5">
                                                    <input
                                                        type="checkbox"
                                                        id="m_smoker"
                                                        checked={maleSmoker}
                                                        onChange={(e) => setMaleSmoker(e.target.checked)}
                                                        className="rounded border-slate-350 text-[#17CB96] focus:ring-[#17CB96] h-4 w-4"
                                                    />
                                                    <label htmlFor="m_smoker" className="font-semibold text-slate-700">Active Smoker</label>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* 3. Couple Context Accordion */}
                                    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
                                        <button
                                            type="button"
                                            onClick={() => setCoupleContextOpen(!coupleContextOpen)}
                                            className="w-full flex justify-between items-center p-3 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100/80 transition-colors"
                                        >
                                            <span className="flex items-center gap-1.5">💑 Couple & Lifestyle Factors</span>
                                            {coupleContextOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                        </button>
                                        {coupleContextOpen && (
                                            <div className="p-3.5 space-y-3.5 border-t border-slate-150 text-xs text-slate-600">
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Coital Frequency</label>
                                                        <select
                                                            value={coitalFrequency}
                                                            onChange={(e) => setCoitalFrequency(e.target.value)}
                                                            className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#17CB96] text-xs font-medium"
                                                        >
                                                            <option value="Optimal">Optimal</option>
                                                            <option value="Good">Good</option>
                                                            <option value="Moderate">Moderate</option>
                                                            <option value="Suboptimal">Suboptimal</option>
                                                            <option value="Random">Random</option>
                                                            <option value="Infrequent">Infrequent</option>
                                                            <option value="None">None</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Ovulation Tracking</label>
                                                        <select
                                                            value={ovulationTracking}
                                                            onChange={(e) => setOvulationTracking(e.target.value)}
                                                            className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#17CB96] text-xs font-medium"
                                                        >
                                                            <option value="LH_Strips">LH Strips</option>
                                                            <option value="BBT">BBT</option>
                                                            <option value="Cervical_Mucus">Cervical Mucus</option>
                                                            <option value="Calendar">Calendar</option>
                                                            <option value="App">App</option>
                                                            <option value="None">None</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-slate-500 mb-1">City Tier (India)</label>
                                                        <select
                                                            value={cityTier}
                                                            onChange={(e) => setCityTier(e.target.value)}
                                                            className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#17CB96] text-xs font-medium"
                                                        >
                                                            <option value="Metro">Metro</option>
                                                            <option value="Tier2">Tier 2</option>
                                                            <option value="Tier3">Tier 3</option>
                                                            <option value="Rural">Rural</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-slate-500 mb-1">PM2.5 (µg/m³)</label>
                                                        <input
                                                            type="number"
                                                            value={pm25}
                                                            onChange={(e) => setPm25(Number(e.target.value))}
                                                            className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#17CB96] text-xs font-medium"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Occupational Hazard</label>
                                                    <select
                                                        value={occupationalHazard}
                                                        onChange={(e) => setOccupationalHazard(e.target.value)}
                                                        className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#17CB96] text-xs font-medium"
                                                    >
                                                        <option value="None">None</option>
                                                        <option value="Mild">Mild</option>
                                                        <option value="Moderate">Moderate</option>
                                                        <option value="HeavyMetal">Heavy Metal</option>
                                                        <option value="Radiation">Radiation</option>
                                                    </select>
                                                </div>

                                                <div className="flex items-center gap-2 pt-1.5">
                                                    <input
                                                        type="checkbox"
                                                        id="air_purifier"
                                                        checked={airPurifier}
                                                        onChange={(e) => setAirPurifier(e.target.checked)}
                                                        className="rounded border-slate-350 text-[#17CB96] focus:ring-[#17CB96] h-4 w-4"
                                                    />
                                                    <label htmlFor="air_purifier" className="font-semibold text-slate-700">HEPA Air Purifier at Home</label>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {error && (
                                    <div className="flex gap-2 p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-100">
                                        <AlertCircle className="w-4 h-4 shrink-0" />
                                        <span>{error}</span>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading || !femaleFile || !maleFile}
                                    className="w-full flex justify-center items-center gap-2 bg-[#D4544C] hover:bg-[#c24941] text-white py-3.5 px-4 rounded-xl font-bold text-base shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Parsing clinical values...
                                        </>
                                    ) : (
                                        <>
                                            Run Compatibility Engine
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Info banner */}
                        <div className="bg-[#EBF5F3] p-4 rounded-2xl border border-teal-100 text-teal-800 text-xs leading-relaxed">
                            <h4 className="font-bold flex items-center gap-1.5 mb-1.5">
                                <CheckCircle2 className="w-4 h-4" />
                                Diagnostic parameters analysed:
                            </h4>
                            <p>We evaluate Age, Hormones (TSH, Prolactin, Testosterone, FSH, LH, AMH), Semen Parameters, structural barriers, DNA fragmentation index, and dynamic couple multipliers.</p>
                        </div>
                    </div>

                    {/* Right Column: Display Tabs */}
                    <div className="flex flex-col gap-6">
                        
                        {/* Tab Switched Header (Medical Engine Deep Dive) */}
                        {activeTab !== 'insights' && (
                            <div className="flex flex-col gap-3">
                                <button 
                                    onClick={() => setActiveTab('insights')}
                                    className="self-start flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4" /> Back to AI Insights
                                </button>
                                <div className="flex bg-slate-200/60 p-1.5 rounded-xl gap-2 shadow-inner border border-slate-200">
                                    <button
                                        onClick={() => setActiveTab('female')}
                                        className={cn(
                                            "flex-1 py-3.5 px-4 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2",
                                            activeTab === 'female'
                                                ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                                                : "text-slate-600 hover:text-slate-900"
                                        )}
                                    >
                                        👩 Female Scoring ({fSc.total_normalized}/100)
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('male')}
                                        className={cn(
                                            "flex-1 py-3.5 px-4 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2",
                                            activeTab === 'male'
                                                ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                                                : "text-slate-600 hover:text-slate-900"
                                        )}
                                    >
                                        👨 Male Scoring ({mSc.total_normalized}/100)
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('combined')}
                                        className={cn(
                                            "flex-1 py-3.5 px-4 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2",
                                            activeTab === 'combined'
                                                ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                                                : "text-slate-600 hover:text-slate-900"
                                        )}
                                    >
                                        💑 Combined & MFR
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Tab Content Components */}
                        
                        {/* 0. AI INSIGHTS TAB */}
                        {activeTab === 'insights' && (
                            <div className="space-y-6">
                                {s2 ? (
                                    <>
                                        {/* Hero Overview */}
                                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700 p-8 shadow-lg text-center relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                                <Sparkles className="w-32 h-32 text-white" />
                                            </div>
                                            <div className="relative z-10">
                                                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Overall Compatibility Score</div>
                                                <div className="text-7xl font-extrabold text-white mb-2 tracking-tight">
                                                    {s2.overall_compatibility_score}<span className="text-4xl text-slate-400 font-medium">%</span>
                                                </div>
                                                <div className="text-2xl font-bold text-[#17CB96] mb-4">{s2.overall_compatibility_label}</div>
                                                <p className="text-slate-300 text-sm max-w-xl mx-auto leading-relaxed">
                                                    {s2.overall_compatibility_summary}
                                                </p>
                                                
                                                <div className="flex justify-center gap-4 mt-8">
                                                    <button className="flex items-center gap-2 px-6 py-3 bg-[#17CB96] text-white rounded-xl font-bold hover:bg-[#14b384] transition-all shadow-md">
                                                        <MessageCircle className="w-5 h-5" /> Chat with it
                                                    </button>
                                                    <button 
                                                        onClick={() => setActiveTab('combined')}
                                                        className="flex items-center gap-2 px-6 py-3 bg-slate-700 text-white rounded-xl font-bold hover:bg-slate-600 transition-all border border-slate-600"
                                                    >
                                                        <Activity className="w-5 h-5" /> Medical Engine Deep Dive
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Report Meta & Consultation Urgency */}
                                        <div className="grid md:grid-cols-4 gap-4">
                                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
                                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Female Patient</div>
                                                <div className="text-sm font-bold text-slate-800">{s2.report_meta?.female_name || '—'} ({s2.report_meta?.female_age || '?'} yrs)</div>
                                            </div>
                                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
                                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Male Patient</div>
                                                <div className="text-sm font-bold text-slate-800">{s2.report_meta?.male_name || '—'} ({s2.report_meta?.male_age || '?'} yrs)</div>
                                            </div>
                                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
                                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Female Profile</div>
                                                <div className="text-sm font-bold text-slate-800 truncate px-2" title={s2.report_meta?.female_clinical_profile}>{s2.report_meta?.female_clinical_profile || '—'}</div>
                                            </div>
                                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
                                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Male Profile</div>
                                                <div className="text-sm font-bold text-slate-800 truncate px-2" title={s2.report_meta?.male_clinical_profile}>{s2.report_meta?.male_clinical_profile || '—'}</div>
                                            </div>
                                        </div>

                                        {s2.consultation_urgency && (
                                            <div className={cn(
                                                "p-4 rounded-xl border flex items-start gap-3 shadow-sm",
                                                s2.consultation_urgency === 'Immediate' || s2.consultation_urgency === 'Urgent' 
                                                    ? "bg-rose-50 border-rose-200" 
                                                    : s2.consultation_urgency === 'Soon' 
                                                        ? "bg-amber-50 border-amber-200" 
                                                        : "bg-blue-50 border-blue-200"
                                            )}>
                                                <div className={cn(
                                                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                                                    s2.consultation_urgency === 'Immediate' || s2.consultation_urgency === 'Urgent' 
                                                        ? "bg-rose-100 text-rose-600" 
                                                        : s2.consultation_urgency === 'Soon' 
                                                            ? "bg-amber-100 text-amber-600" 
                                                            : "bg-blue-100 text-blue-600"
                                                )}>
                                                    {s2.consultation_urgency === 'Immediate' || s2.consultation_urgency === 'Urgent' ? <AlertTriangle className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
                                                </div>
                                                <div>
                                                    <h4 className={cn(
                                                        "text-sm font-bold",
                                                        s2.consultation_urgency === 'Immediate' || s2.consultation_urgency === 'Urgent' ? "text-rose-900" : s2.consultation_urgency === 'Soon' ? "text-amber-900" : "text-blue-900"
                                                    )}>
                                                        Consultation Urgency: {s2.consultation_urgency}
                                                    </h4>
                                                    <p className={cn(
                                                        "text-sm mt-0.5",
                                                        s2.consultation_urgency === 'Immediate' || s2.consultation_urgency === 'Urgent' ? "text-rose-700" : s2.consultation_urgency === 'Soon' ? "text-amber-700" : "text-blue-700"
                                                    )}>
                                                        {s2.consultation_reason}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Criticalities */}
                                        {s2.criticalities && s2.criticalities.length > 0 && (
                                            <div className="space-y-3">
                                                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                                    <AlertCircle className="w-5 h-5 text-rose-500" /> Critical Health Flags
                                                </h3>
                                                <div className="grid gap-3">
                                                    {s2.criticalities.map((crit: any, idx: number) => (
                                                        <div key={idx} className={cn(
                                                            "p-4 rounded-xl border flex items-start gap-4 shadow-sm",
                                                            crit.severity === 'critical' ? "bg-red-50 border-red-200" : crit.severity === 'warning' ? "bg-orange-50 border-orange-200" : "bg-slate-50 border-slate-200"
                                                        )}>
                                                            <div className={cn(
                                                                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border",
                                                                crit.severity === 'critical' ? "bg-red-100 text-red-600 border-red-200" : crit.severity === 'warning' ? "bg-orange-100 text-orange-600 border-orange-200" : "bg-white text-slate-600 border-slate-200"
                                                            )}>
                                                                <AlertTriangle className="w-4 h-4" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <h4 className="font-bold text-slate-900">{crit.title}</h4>
                                                                    <span className={cn(
                                                                        "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                                                                        crit.severity === 'critical' ? "bg-red-200 text-red-800" : crit.severity === 'warning' ? "bg-orange-200 text-orange-800" : "bg-slate-200 text-slate-800"
                                                                    )}>{crit.severity}</span>
                                                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-100 uppercase tracking-wider">{crit.person}</span>
                                                                </div>
                                                                <p className="text-sm text-slate-700 leading-relaxed mb-2">{crit.description}</p>
                                                                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 shadow-sm">
                                                                    <ArrowRight className="w-3.5 h-3.5 text-blue-500" /> Action: {crit.action}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Key KPIs Grid */}
                                        {s2.key_kpis && (
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                                    <Activity className="w-5 h-5 text-[#17CB96]" /> Key Health KPIs
                                                </h3>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                    {[
                                                        { label: "Female Bio Score", value: `${s2.key_kpis.female_biological_score}/100`, icon: "👩" },
                                                        { label: "Male Bio Score", value: `${s2.key_kpis.male_biological_score}/100`, icon: "👨" },
                                                        { label: "Combined Bio Score", value: `${s2.key_kpis.combined_biological_score}/100`, icon: "💑" },
                                                        { label: "Metabolic Health", value: `${s2.key_kpis.metabolic_health_score}/100`, icon: "🫀" },
                                                        { label: "Lifestyle Impact", value: `${s2.key_kpis.lifestyle_multiplier_percent}%`, icon: "🏃" },
                                                        { label: "Behavioral Timing", value: `${s2.key_kpis.behavioral_multiplier_percent}%`, icon: "📅" },
                                                        { label: "Semen Quality", value: s2.key_kpis.semen_quality_grade, icon: "🔬" },
                                                        { label: "Age-Fertility Align", value: s2.key_kpis.age_fertility_alignment, icon: "⏳" },
                                                        { label: "Female Thyroid", value: s2.key_kpis.thyroid_status_female, icon: "🦋" },
                                                        { label: "Male Thyroid", value: s2.key_kpis.thyroid_status_male, icon: "🦋" },
                                                        { label: "Genetic Risk", value: s2.key_kpis.genetic_compatibility_risk, icon: "🧬" },
                                                        { label: "Rh Compatibility", value: s2.key_kpis.rh_compatibility_risk, icon: "🩸" },
                                                        { label: "Haemoglobin Variant", value: s2.key_kpis.hemoglobin_variant_risk, icon: "🧪" },
                                                        { label: "Infection Screen", value: s2.key_kpis.overall_infection_clearance, icon: "🛡️" }
                                                    ].map((kpi, idx) => {
                                                        const valLower = String(kpi.value).toLowerCase();
                                                        let valColor = "text-slate-900";
                                                        if (["excellent", "good", "clear", "low risk", "no risk", "normal", "immune"].some(w => valLower.includes(w))) valColor = "text-emerald-600";
                                                        else if (["borderline", "fair", "moderate", "soon"].some(w => valLower.includes(w))) valColor = "text-amber-600";
                                                        else if (["poor", "critical", "high risk", "abnormal", "urgent", "hypothyroid"].some(w => valLower.includes(w))) valColor = "text-rose-600";
                                                        
                                                        return (
                                                            <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm text-center flex flex-col items-center justify-center min-h-[100px]">
                                                                <div className="text-2xl mb-1">{kpi.icon}</div>
                                                                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 leading-tight">{kpi.label}</div>
                                                                <div className={cn("text-sm font-extrabold", valColor)}>{kpi.value}</div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {/* Fertility MFR & Planning Window */}
                                        <div className="grid md:grid-cols-2 gap-6">
                                            {s2.fertility_mfr && (
                                                <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-2xl border border-slate-800 p-6 shadow-lg text-center relative overflow-hidden group hover:border-[#17CB96] transition-colors">
                                                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#17CB96] opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity"></div>
                                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Monthly Conception Chance</div>
                                                    <div className="text-5xl font-extrabold text-[#17CB96] mb-2">{s2.fertility_mfr.mfr_percent}<span className="text-2xl">%</span></div>
                                                    <div className="text-sm font-bold text-white mb-4">{s2.fertility_mfr.category}</div>
                                                    
                                                    <div className="grid grid-cols-2 gap-2 mb-4">
                                                        <div className="bg-slate-800/50 p-2 rounded-lg border border-slate-700/50">
                                                            <div className="text-[10px] text-slate-400 uppercase">6-Month Prob</div>
                                                            <div className="text-lg font-bold text-white">{s2.fertility_mfr.prob_6_month}%</div>
                                                        </div>
                                                        <div className="bg-slate-800/50 p-2 rounded-lg border border-slate-700/50">
                                                            <div className="text-[10px] text-slate-400 uppercase">12-Month Prob</div>
                                                            <div className="text-lg font-bold text-white">{s2.fertility_mfr.prob_12_month}%</div>
                                                        </div>
                                                    </div>
                                                    {s2.fertility_mfr.clinical_recommendation && (
                                                        <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/50 p-3 rounded-xl border border-slate-700">
                                                            💡 <strong>Recommendation:</strong> {s2.fertility_mfr.clinical_recommendation}
                                                        </p>
                                                    )}
                                                </div>
                                            )}

                                            {s2.baby_planning_window && (
                                                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                                                    <div className="flex items-center gap-2 mb-4">
                                                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                                                            <Activity className="w-4 h-4 text-indigo-500" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-sm font-bold text-slate-900">Optimal Planning Window</h3>
                                                            <p className="text-[10px] font-bold text-slate-500 uppercase">Confidence: <span className="text-indigo-600">{s2.baby_planning_window.confidence}</span></p>
                                                        </div>
                                                    </div>
                                                    <div className="text-3xl font-extrabold text-slate-900 mb-2">{s2.baby_planning_window.optimal_window}</div>
                                                    <p className="text-sm text-slate-600 leading-relaxed mb-6">{s2.baby_planning_window.explanation}</p>
                                                    
                                                    {/* Timeline */}
                                                    <div className="relative pt-4">
                                                        <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                                                            <span>0 Yrs</span>
                                                            <span>5 Yrs</span>
                                                            <span>10+ Yrs</span>
                                                        </div>
                                                        <div className="w-full h-2 bg-slate-100 rounded-full relative overflow-hidden">
                                                            <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-400 w-full opacity-30"></div>
                                                            <div className="absolute top-0 left-0 h-full bg-indigo-500 w-1.5 rounded-full z-10 transition-all duration-1000" style={{ left: `calc(${s2.baby_planning_window.current_position_percent}% - 3px)` }}></div>
                                                        </div>
                                                        <div className="absolute top-1" style={{ left: `calc(${s2.baby_planning_window.current_position_percent}% - 8px)` }}>
                                                            <div className="w-4 h-4 rounded-full border-2 border-white bg-indigo-600 shadow-md"></div>
                                                        </div>
                                                    </div>
                                                    <div className="text-center text-[10px] font-bold text-slate-500 mt-3">You are here</div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Actionable Insights */}
                                        {s2.actionable_insights && s2.actionable_insights.length > 0 && (
                                            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                                                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                                    <Zap className="w-5 h-5 text-amber-500" /> Actionable Insights
                                                </h3>
                                                <div className="grid gap-3">
                                                    {s2.actionable_insights.map((insight: any, idx: number) => (
                                                        <div key={idx} className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100/50 transition-colors">
                                                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 border border-slate-200 shadow-sm text-sm font-bold text-slate-500">
                                                                {idx + 1}
                                                            </div>
                                                            <div>
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <h4 className="font-bold text-slate-800">{insight.title}</h4>
                                                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 uppercase tracking-wider">{insight.timeframe}</span>
                                                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 uppercase tracking-wider">{insight.applies_to}</span>
                                                                </div>
                                                                <p className="text-sm text-slate-600 leading-relaxed">{insight.description}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Health Domains Grid */}
                                        {s2.health_domains && (
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                                    <Heart className="w-5 h-5 text-rose-500" /> Core Health Domains
                                                </h3>
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    {s2.health_domains.map((domain: any, idx: number) => (
                                                        <div key={idx} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                                                            <div className="flex justify-between items-start mb-3">
                                                                <h4 className="font-bold text-slate-800 text-base">{domain.name}</h4>
                                                                <span className="text-lg font-extrabold text-slate-900">{domain.score}/100</span>
                                                            </div>
                                                            <div className="w-full bg-slate-100 rounded-full h-1.5 mb-4">
                                                                <div className="h-1.5 rounded-full" style={{ width: `${domain.score}%`, backgroundColor: domain.color === 'emerald' ? '#10b981' : domain.color === 'rose' ? '#f43f5e' : domain.color === 'amber' ? '#f59e0b' : '#3b82f6' }}></div>
                                                            </div>
                                                            <p className="text-xs text-slate-600 mb-2 leading-relaxed"><strong>What it means:</strong> {domain.what_it_means}</p>
                                                            <p className="text-xs text-slate-500 leading-relaxed"><strong>Why it matters:</strong> {domain.why_it_matters}</p>
                                                            
                                                            {domain.warnings && domain.warnings.length > 0 && (
                                                                <div className="mt-3 space-y-1">
                                                                    {domain.warnings.map((warn: string, i: number) => (
                                                                        <div key={i} className="flex gap-1.5 text-[11px] text-amber-700 bg-amber-50 p-1.5 rounded border border-amber-100">
                                                                            <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> {warn}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Detailed Comparison Matrix */}
                                        {s2.matrix && (
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                                    <ShieldCheck className="w-5 h-5 text-indigo-500" /> Detailed Comparison Matrix
                                                </h3>
                                                <div className="space-y-3">
                                                    {[
                                                        { key: 'genetics', icon: '🧬', label: 'Genetics' },
                                                        { key: 'fertility', icon: '❤️', label: 'Fertility' },
                                                        { key: 'chronic_health', icon: '🫀', label: 'Chronic Health' },
                                                        { key: 'infection_risk', icon: '🛡️', label: 'Infection Risk' },
                                                        { key: 'lifestyle_metabolic', icon: '⚡', label: 'Lifestyle & Metabolic' },
                                                        { key: 'blood_compatibility', icon: '🩸', label: 'Blood Compatibility' }
                                                    ].map((sectionData) => {
                                                        const section = s2.matrix[sectionData.key];
                                                        if (!section || !section.params || section.params.length === 0) return null;
                                                        
                                                        return (
                                                            <details key={sectionData.key} className="group bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden" open={sectionData.key === 'genetics'}>
                                                                <summary className="flex items-center justify-between p-4 cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors list-none [&::-webkit-details-marker]:hidden">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="text-xl">{sectionData.icon}</div>
                                                                        <h4 className="font-bold text-slate-900">{sectionData.label}</h4>
                                                                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-600">
                                                                            Score: {section.section_score}/100
                                                                        </span>
                                                                    </div>
                                                                    <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" />
                                                                </summary>
                                                                <div className="p-4 border-t border-slate-200 bg-white">
                                                                    <div className="grid gap-3">
                                                                        {section.params.map((param: any, pIdx: number) => (
                                                                            <div key={pIdx} className="p-3 rounded-lg border border-slate-100 bg-slate-50 flex flex-col md:flex-row md:items-center gap-4">
                                                                                <div className="md:w-1/4">
                                                                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Parameter</div>
                                                                                    <div className="text-sm font-bold text-slate-900">{param.name}</div>
                                                                                </div>
                                                                                <div className="md:w-1/4">
                                                                                    <div className="text-[10px] font-bold text-pink-500 uppercase tracking-wider mb-1">Female</div>
                                                                                    <div className="text-sm font-semibold">{param.female_value} <span className="text-xs text-slate-500">({param.female_status})</span></div>
                                                                                </div>
                                                                                <div className="md:w-1/4">
                                                                                    <div className="text-[10px] font-bold text-blue-500 uppercase tracking-wider mb-1">Male</div>
                                                                                    <div className="text-sm font-semibold">{param.male_value} <span className="text-xs text-slate-500">({param.male_status})</span></div>
                                                                                </div>
                                                                                <div className="md:w-1/4 flex items-center justify-between">
                                                                                    <div>
                                                                                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Match Score</div>
                                                                                        <div className={cn(
                                                                                            "text-sm font-bold",
                                                                                            param.compatibility_score >= 80 ? "text-emerald-600" : param.compatibility_score >= 50 ? "text-amber-600" : "text-rose-600"
                                                                                        )}>{param.compatibility_score}/100</div>
                                                                                    </div>
                                                                                    {param.flag && (
                                                                                        <div className={cn(
                                                                                            "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider",
                                                                                            param.flag === 'critical' ? "bg-red-100 text-red-700 border border-red-200" : "bg-orange-100 text-orange-700 border border-orange-200"
                                                                                        )}>
                                                                                            {param.flag}
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                                {param.note && (
                                                                                    <div className="w-full text-xs text-slate-600 mt-2 pt-2 border-t border-slate-200 md:mt-0 md:pt-0 md:border-t-0">
                                                                                        <span className="font-semibold text-slate-500">Note:</span> {param.note}
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </details>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* Critical Missing Tests */}
                                        {(s2.missing_tests_summary?.total_count > 0 || (s2.missing_tests && (s2.missing_tests.female?.length > 0 || s2.missing_tests.male?.length > 0))) && (
                                            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border border-orange-200 p-6 space-y-6">
                                                <div className="flex gap-4">
                                                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-orange-100 flex items-center justify-center shrink-0">
                                                        <AlertCircle className="w-6 h-6 text-orange-500" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-bold text-slate-900">Critical Tests Missing</h3>
                                                        {s2.missing_tests_summary && (
                                                            <>
                                                                <p className="text-sm text-slate-600 mb-4">{s2.missing_tests_summary.total_count} important parameters were not found in the uploaded reports.</p>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {s2.missing_tests_summary.categories.map((cat: any, idx: number) => (
                                                                        <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-orange-100 rounded-full text-xs font-semibold text-orange-700 shadow-sm">
                                                                            {cat.icon_emoji} {cat.name} <span className="bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded-full text-[10px]">{cat.pending}</span>
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Detailed Missing Tests Lists */}
                                                {s2.missing_tests && (
                                                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                                                        {s2.missing_tests.female && s2.missing_tests.female.length > 0 && (
                                                            <div className="bg-white rounded-xl border border-orange-100 p-4 shadow-sm">
                                                                <h4 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
                                                                    👩 Female Missing Tests
                                                                </h4>
                                                                <ul className="space-y-3">
                                                                    {s2.missing_tests.female.map((test: any, idx: number) => (
                                                                        <li key={idx} className="text-sm">
                                                                            <div className="font-bold text-slate-700">{test.test_name} <span className="text-[10px] font-normal px-1.5 py-0.5 bg-slate-100 rounded text-slate-500 ml-1">{test.category}</span></div>
                                                                            <div className="text-xs text-slate-500 mt-0.5">{test.why_important}</div>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}
                                                        {s2.missing_tests.male && s2.missing_tests.male.length > 0 && (
                                                            <div className="bg-white rounded-xl border border-orange-100 p-4 shadow-sm">
                                                                <h4 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
                                                                    👨 Male Missing Tests
                                                                </h4>
                                                                <ul className="space-y-3">
                                                                    {s2.missing_tests.male.map((test: any, idx: number) => (
                                                                        <li key={idx} className="text-sm">
                                                                            <div className="font-bold text-slate-700">{test.test_name} <span className="text-[10px] font-normal px-1.5 py-0.5 bg-slate-100 rounded text-slate-500 ml-1">{test.category}</span></div>
                                                                            <div className="text-xs text-slate-500 mt-0.5">{test.why_important}</div>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-sm text-center">
                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Sparkles className="w-8 h-8 text-slate-300" />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 mb-2">No AI Insights Available</h3>
                                        <p className="text-slate-500 max-w-md mx-auto">Upload your reports and run the compatibility engine to generate your Stage 2 AI Interpretation.</p>
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {/* 1. FEMALE SCORING TAB */}
                        {activeTab === 'female' && (
                            <div className="space-y-6">
                                {/* Female score overview card */}
                                <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm grid md:grid-cols-[160px_1fr] gap-8 items-center">
                                    <div className="shrink-0 flex justify-center">
                                        <ScoreGauge score={fSc.total_normalized} size={150} />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Award className="w-5 h-5 text-[#DE457D]" />
                                            <h3 className="text-xl font-bold text-slate-900 font-sans">Female Biological Score</h3>
                                        </div>
                                        <p className="text-slate-600 text-sm">
                                            Calculated from age coefficient, ovarian reserve values, menstrual regularity patterns, and hormone balance ranges.
                                        </p>
                                        {fSc.absolute_barrier ? (
                                            <div className="flex gap-2 p-3 bg-rose-50 text-rose-800 text-xs rounded-lg border border-rose-100 items-center">
                                                <ShieldAlert className="w-4 h-4 shrink-0" />
                                                <span><strong>Absolute Barrier:</strong> {fSc.barrier_reason}</span>
                                            </div>
                                        ) : (
                                            <span className="inline-block bg-green-50 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-md border border-green-100">
                                                ✓ No Absolute Biological Barriers Detected
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Female components grid */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    {fSc.steps.map((step, i) => (
                                        <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                                            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                                                <h4 className="font-bold text-slate-900 text-sm font-sans">{step.name}</h4>
                                                <span className="text-xs font-bold text-[#DE457D] bg-pink-50 px-2 py-0.5 rounded border border-pink-100">
                                                    {step.score}/{step.max_score}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-600 leading-relaxed font-mono">
                                                {step.details}
                                            </p>
                                            {step.sub_steps && step.sub_steps.length > 0 && (
                                                <ul className="text-[11px] text-slate-500 list-disc list-inside space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                                    {step.sub_steps.map((sub, idx) => (
                                                        <li key={idx}>{sub}</li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 2. MALE SCORING TAB */}
                        {activeTab === 'male' && (
                            <div className="space-y-6">
                                {/* Male score overview card */}
                                <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm grid md:grid-cols-[160px_1fr] gap-8 items-center">
                                    <div className="shrink-0 flex justify-center">
                                        <ScoreGauge score={mSc.total_normalized} size={150} />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Award className="w-5 h-5 text-[#17CB96]" />
                                            <h3 className="text-xl font-bold text-slate-900 font-sans">Male Biological Score</h3>
                                        </div>
                                        <p className="text-slate-600 text-sm">
                                            Calculated from concentration, progressive motility, shape (morphology), seminal volume, DNA fragmentation rates, and structural attributes.
                                        </p>
                                        {mSc.absolute_barrier ? (
                                            <div className="flex gap-2 p-3 bg-rose-50 text-rose-800 text-xs rounded-lg border border-rose-100 items-center">
                                                <ShieldAlert className="w-4 h-4 shrink-0" />
                                                <span><strong>Absolute Barrier:</strong> {mSc.barrier_reason}</span>
                                            </div>
                                        ) : (
                                            <span className="inline-block bg-green-50 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-md border border-green-100">
                                                ✓ No Absolute Biological Barriers Detected
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Male components grid */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    {mSc.steps.map((step, i) => (
                                        <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                                            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                                                <h4 className="font-bold text-slate-900 text-sm font-sans">{step.name}</h4>
                                                <span className="text-xs font-bold text-[#17CB96] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                                                    {step.score}/{step.max_score}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-600 leading-relaxed font-mono">
                                                {step.details}
                                            </p>
                                            {step.sub_steps && step.sub_steps.length > 0 && (
                                                <ul className="text-[11px] text-slate-500 list-disc list-inside space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                                    {step.sub_steps.map((sub, idx) => (
                                                        <li key={idx}>{sub}</li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 3. COMBINED & MFR TAB */}
                        {activeTab === 'combined' && (
                            <div className="space-y-6">
                                {/* Combined score and MFR summary */}
                                <div className="bg-slate-900 text-white rounded-2xl p-8 shadow-sm grid md:grid-cols-[160px_1fr] gap-8 items-center">
                                    <div className="shrink-0 flex justify-center">
                                        <ScoreGauge score={Math.round(comb.final_score)} size={150} />
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Monthly Fecundability Rate (MFR)</span>
                                            <div className="text-3xl font-extrabold text-[#17CB96] mt-0.5">
                                                {comb.mfr_percent}% <span className="text-lg font-medium text-slate-300">({comb.mfr_category})</span>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-200 mb-1">Executive Clinical Action</h4>
                                            <p className="text-slate-300 text-xs leading-relaxed">
                                                {comb.recommendation}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Cumulative probabilities cards */}
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center space-y-2">
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">6-Month Cumulative Conception Rate</span>
                                        <div className="text-4xl font-extrabold text-slate-950 font-mono">{comb.prob_6m}%</div>
                                        <p className="text-[10px] text-slate-400">Probability of pregnancy within 6 months of active attempts.</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center space-y-2">
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">12-Month Cumulative Conception Rate</span>
                                        <div className="text-4xl font-extrabold text-slate-950 font-mono">{comb.prob_12m}%</div>
                                        <p className="text-[10px] text-slate-400">Probability of pregnancy within 12 months of active attempts.</p>
                                    </div>
                                </div>

                                {/* 12-Month Cumulative Conception Chart */}
                                {(() => {
                                    const mfr = comb.mfr_percent;
                                    const months = Array.from({ length: 12 }, (_, i) => i + 1);
                                    const probData = months.map(mo => {
                                        const r = mfr / 100;
                                        const p = r > 0 ? (1 - Math.pow(1 - r, mo)) * 100 : 0;
                                        return { month: mo, prob: Math.round(p * 10) / 10 };
                                    });

                                    // Resolve active color based on MFR
                                    let barColor = "#EF4444"; // critical (red-500)
                                    if (mfr >= 15) barColor = "#10B981"; // excellent (emerald-500)
                                    else if (mfr >= 10) barColor = "#34D399"; // good (emerald-400)
                                    else if (mfr >= 5) barColor = "#FBBF24"; // fair (amber-400)
                                    else if (mfr >= 2) barColor = "#F59E0B"; // low (amber-500)

                                    return (
                                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                                            <div>
                                                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                                    <Activity className="w-4 h-4 text-[#17CB96]" />
                                                    📈 Cumulative Conception Probability (12 Months)
                                                </h3>
                                                <p className="text-[11px] text-slate-500 mt-1">Conception rate probability progression month-by-month.</p>
                                            </div>
                                            <div className="flex items-end justify-between gap-1 md:gap-2 h-44 pt-6 pb-2 border-b border-slate-100 px-2">
                                                {probData.map((d) => {
                                                    const heightPercent = d.prob; // since probability max is 100%
                                                    return (
                                                        <div key={d.month} className="flex flex-col items-center flex-1 group relative">
                                                            {/* Tooltip */}
                                                            <div className="absolute bottom-full mb-2 bg-slate-950 text-white text-[10px] py-1 px-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 font-mono shadow-md">
                                                                Month {d.month}: {d.prob}%
                                                            </div>
                                                            <div className="text-[10px] text-slate-500 mb-1 font-mono font-bold">{Math.round(d.prob)}%</div>
                                                            <div 
                                                                className="w-full rounded-t-sm transition-all duration-300 min-h-[2px]"
                                                                style={{ 
                                                                    height: `${heightPercent * 1.2}px`, // scaled for display (max 120px)
                                                                    backgroundColor: barColor 
                                                                }}
                                                            />
                                                            <span className="text-[9px] text-slate-500 mt-2 font-medium">M{d.month}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })()}

                                {/* Bottleneck / Multipliers Pipeline */}
                                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                    <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                            <Activity className="w-4 h-4 text-[#17CB96]" />
                                            Calculation Pipeline (Combined Score Formulation)
                                        </h3>
                                    </div>
                                    <div className="divide-y divide-slate-100">
                                        {comb.steps.map((step, i) => (
                                            <div key={i} className="p-5 space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <h4 className="font-bold text-slate-800 text-sm font-sans">{step.name}</h4>
                                                    <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-mono">
                                                        {step.score}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-500 font-mono leading-relaxed">
                                                    {step.details}
                                                </p>
                                                {step.sub_steps && step.sub_steps.length > 0 && (
                                                    <ul className="text-[10px] text-slate-400 list-disc list-inside space-y-1 bg-slate-50/40 p-2.5 rounded-lg border border-slate-100/60 mt-2">
                                                        {step.sub_steps.map((sub, idx) => (
                                                            <li key={idx}>{sub}</li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default SampleReportPage;
