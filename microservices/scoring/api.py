"""
FastAPI backend for Fertility Compatibility Scoring System
Handles PDF extraction, LLM structuring via Groq, and score calculation
"""

import os
import json
import re
import tempfile
from typing import Optional
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import pdfplumber
import fitz  # PyMuPDF
from groq import Groq
from dotenv import load_dotenv
load_dotenv()

from scoring_engine import (
    FemaleData, MaleData, CoupleLifestyle,
    score_female, score_male, score_combined, ScoreStep
)
from interpretation_engine import call_openrouter_interpretation

app = FastAPI(title="Fertility Scoring API v2.0", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def extract_pdf_text(file_bytes: bytes) -> str:
    """Extract text from PDF using pdfplumber with PyMuPDF fallback."""
    text = ""
    try:
        with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
            tmp.write(file_bytes)
            tmp_path = tmp.name

        with pdfplumber.open(tmp_path) as pdf:
            for page in pdf.pages:
                t = page.extract_text()
                if t:
                    text += t + "\n"

        if not text.strip():
            doc = fitz.open(tmp_path)
            for page in doc:
                text += page.get_text() + "\n"

        os.unlink(tmp_path)
    except Exception as e:
        text = f"[PDF extraction error: {str(e)}]"
    return text


def call_groq_for_structured_data(report_text: str, gender: str, groq_api_key: str) -> dict:
    """Use Groq LLM to extract structured fertility-relevant parameters from a lab report."""
    client = Groq(api_key=groq_api_key)

    if gender.lower() == "female":
        prompt = f"""You are a medical data extraction expert. Extract fertility-relevant lab values from this female health report. 
Return ONLY a valid JSON object with these exact keys (use null for missing values):

{{
  "name": "patient name or null",
  "age": integer or null,
  "blood_group": "string or null",
  "rh_factor": "Positive or Negative or null",
  "hemoglobin": number or null,
  "tsh": number or null,
  "ft4": number or null,
  "t3_total": number or null,
  "t4_total": number or null,
  "fsh": number or null,
  "lh": number or null,
  "amh": number or null,
  "estradiol": number or null,
  "progesterone": number or null,
  "prolactin": number or null,
  "total_testosterone": number or null,
  "hba1c": number or null,
  "fasting_glucose": number or null,
  "total_cholesterol": number or null,
  "hdl": number or null,
  "ldl": number or null,
  "triglycerides": number or null,
  "vitamin_b12": number or null,
  "serum_ferritin": number or null,
  "rubella_igg": number or null,
  "rubella_immune": "Immune or Non-Immune or null",
  "hbsag": "Reactive or Non-Reactive or null",
  "anti_hcv": "Reactive or Non-Reactive or null",
  "hiv": "Reactive or Non-Reactive or null",
  "vdrl": "Reactive or Non-Reactive or null",
  "hba2_percent": number or null,
  "hemoglobin_variant_normal": true or false,
  "notable_findings": ["list any abnormal or noteworthy findings as strings"],
  "clinical_profile_label": "string describing clinical condition if stated e.g. Hypothyroid"
}}

REPORT TEXT:
{report_text}

Return ONLY the JSON object, no markdown, no explanation."""

    else:  # male
        prompt = f"""You are a medical data extraction expert. Extract fertility-relevant lab values from this male health report.
Return ONLY a valid JSON object with these exact keys (use null for missing values):

{{
  "name": "patient name or null",
  "age": integer or null,
  "blood_group": "string or null",
  "rh_factor": "Positive or Negative or null",
  "hemoglobin": number or null,
  "tsh": number or null,
  "t3_total": number or null,
  "t4_total": number or null,
  "fsh": number or null,
  "lh": number or null,
  "total_testosterone": number or null,
  "hba1c": number or null,
  "fasting_glucose": number or null,
  "total_cholesterol": number or null,
  "hdl": number or null,
  "ldl": number or null,
  "triglycerides": number or null,
  "vitamin_b12": number or null,
  "serum_ferritin": number or null,
  "hbsag": "Reactive or Non-Reactive or null",
  "anti_hcv": "Reactive or Non-Reactive or null",
  "hiv": "Reactive or Non-Reactive or null",
  "vdrl": "Reactive or Non-Reactive or null",
  "hba2_percent": number or null,
  "hemoglobin_variant_normal": true or false,
  "semen_volume_ml": number or null,
  "sperm_concentration_million_per_ml": number or null,
  "total_sperm_count_million": number or null,
  "total_motility_percent": number or null,
  "progressive_motility_percent": number or null,
  "non_progressive_motility_percent": number or null,
  "immotility_percent": number or null,
  "sperm_morphology_normal_percent": number or null,
  "sperm_vitality_percent": number or null,
  "semen_ph": number or null,
  "liquefaction_time_mins": number or null,
  "sperm_agglutination": "Absent or Present or null",
  "semen_interpretation": "string or null",
  "azoospermia": true or false,
  "notable_findings": ["list any abnormal or noteworthy findings as strings"],
  "clinical_profile_label": "string describing clinical condition e.g. Asthenozoospermia"
}}

REPORT TEXT:
{report_text}

Return ONLY the JSON object, no markdown, no explanation."""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=2000,
            temperature=0.1
        )
        raw = response.choices[0].message.content.strip()
        # Strip markdown code blocks if present
        raw = re.sub(r'^```(?:json)?\s*', '', raw)
        raw = re.sub(r'\s*```$', '', raw)
        return {"success": True, "data": json.loads(raw), "raw_llm_output": raw}
    except json.JSONDecodeError as e:
        return {"success": False, "error": f"JSON parse error: {str(e)}", "raw_llm_output": raw}
    except Exception as e:
        return {"success": False, "error": str(e), "raw_llm_output": ""}


def build_female_data(structured: dict, overrides: dict) -> FemaleData:
    """Build FemaleData from LLM-extracted data + user overrides."""
    d = structured.get("data", {})
    o = overrides

    age = o.get("age") or d.get("age") or 27
    tsh = d.get("tsh")
    # TSH >4 → likely hypothyroid based on clinical label
    if tsh is None and d.get("clinical_profile_label", "").lower() in ("hypothyroid", "hypothyroidism"):
        tsh = 6.0  # abnormal marker

    return FemaleData(
        age=int(age),
        amh=o.get("amh") or d.get("amh"),
        afc=o.get("afc") or d.get("afc"),
        fsh_day3=o.get("fsh_day3") or d.get("fsh"),
        cycle_length_days=int(o.get("cycle_length_days") or 28),
        progesterone_day21=o.get("progesterone_day21") or d.get("progesterone"),
        flow_duration_days=int(o.get("flow_duration_days") or 5),
        pain_level=o.get("pain_level", "Minimal"),
        tsh=tsh,
        prolactin=o.get("prolactin") or d.get("prolactin"),
        estradiol_day2=o.get("estradiol_day2") or d.get("estradiol"),
        total_testosterone=d.get("total_testosterone"),
        lh=d.get("lh"),
        fsh=d.get("fsh"),
        bilateral_tubal_block=o.get("bilateral_tubal_block", False),
        uterine_absence=o.get("uterine_absence", False),
        severe_ashermans=o.get("severe_ashermans", False),
        structural_finding=o.get("structural_finding", "Normal uterus, normal ovaries, both tubes patent"),
        pcos_phenotype=o.get("pcos_phenotype", "None"),
        endometriosis_stage=o.get("endometriosis_stage", "None"),
        bmi=o.get("female_bmi") or 22.0,
        smoker=o.get("female_smoker", False),
        alcohol_units_per_week=int(o.get("female_alcohol", 0)),
        exercise_hours_per_week=float(o.get("female_exercise", 3.0)),
        sleep_hours=float(o.get("female_sleep", 7.0)),
        stress_level=o.get("female_stress", "Moderate"),
        coital_frequency=o.get("coital_frequency", "Good"),
        ovulation_tracking=o.get("ovulation_tracking", "App"),
    )


def build_male_data(structured: dict, overrides: dict) -> MaleData:
    """Build MaleData from LLM-extracted data + user overrides."""
    d = structured.get("data", {})
    o = overrides

    age = o.get("age") or d.get("age") or 31

    return MaleData(
        age=int(age),
        sperm_concentration=d.get("sperm_concentration_million_per_ml"),
        progressive_motility=d.get("progressive_motility_percent"),
        morphology=d.get("sperm_morphology_normal_percent"),
        semen_volume=d.get("semen_volume_ml"),
        azoospermia=d.get("azoospermia", False),
        total_testosterone=d.get("total_testosterone"),
        free_testosterone=o.get("free_testosterone"),
        fsh=d.get("fsh"),
        lh=d.get("lh"),
        testicular_volume=o.get("testicular_volume"),
        varicocele_grade=o.get("varicocele_grade", "None"),
        dfi=o.get("dfi"),
        bmi=o.get("male_bmi") or 23.0,
        smoker=o.get("male_smoker", False),
        alcohol_units_per_week=int(o.get("male_alcohol", 0)),
        exercise_hours_per_week=float(o.get("male_exercise", 3.0)),
        sleep_hours=float(o.get("male_sleep", 7.0)),
        stress_level=o.get("male_stress", "Moderate"),
    )


def steps_to_dict(steps: list) -> list:
    result = []
    for s in steps:
        result.append({
            "name": s.name,
            "score": s.score,
            "max_score": s.max_score,
            "details": s.details,
            "sub_steps": s.sub_steps,
        })
    return result


@app.get("/health")
def health():
    return {"status": "ok", "version": "2.0.0"}


@app.post("/analyze")
async def analyze(
    female_pdf: UploadFile = File(...),
    male_pdf: UploadFile = File(...),
    groq_api_key: Optional[str] = Form(None),
    # Lifestyle & overrides (form fields)
    coital_frequency: str = Form("Good"),
    ovulation_tracking: str = Form("App"),
    regional_city_tier: str = Form("Metro"),
    pm25: float = Form(75.0),
    air_purifier: bool = Form(False),
    occupational_hazard: str = Form("None"),
    # Female extras
    female_age: Optional[int] = Form(None),
    female_bmi: Optional[float] = Form(22.0),
    female_smoker: bool = Form(False),
    female_alcohol: int = Form(0),
    female_exercise: float = Form(3.0),
    female_sleep: float = Form(7.0),
    female_stress: str = Form("Moderate"),
    cycle_length_days: int = Form(28),
    flow_duration_days: int = Form(5),
    pain_level: str = Form("Minimal"),
    pcos_phenotype: str = Form("None"),
    endometriosis_stage: str = Form("None"),
    structural_finding: str = Form("Normal uterus, normal ovaries, both tubes patent"),
    bilateral_tubal_block: bool = Form(False),
    # Male extras
    male_age: Optional[int] = Form(None),
    male_bmi: Optional[float] = Form(23.0),
    male_smoker: bool = Form(False),
    male_alcohol: int = Form(0),
    male_exercise: float = Form(3.0),
    male_sleep: float = Form(7.0),
    male_stress: str = Form("Moderate"),
    varicocele_grade: str = Form("None"),
    dfi: Optional[float] = Form(None),
    testicular_volume: Optional[float] = Form(None),
):
    # Resolve API Key from env if not provided
    resolved_groq_key = groq_api_key or os.getenv("GROQ_API_KEY", "").strip().strip("'\"")
    if not resolved_groq_key:
        raise HTTPException(status_code=400, detail="Groq API key is required. Provide in form or set GROQ_API_KEY env var.")

    # ── Step 1: Extract PDF text ──
    female_bytes = await female_pdf.read()
    male_bytes = await male_pdf.read()

    female_text = extract_pdf_text(female_bytes)
    male_text = extract_pdf_text(male_bytes)

    # ── Step 2: LLM extraction ──
    female_llm = call_groq_for_structured_data(female_text, "female", resolved_groq_key)
    male_llm = call_groq_for_structured_data(male_text, "male", resolved_groq_key)

    # ── Step 3: Build data objects ──
    female_overrides = {
        "age": female_age,
        "female_bmi": female_bmi,
        "female_smoker": female_smoker,
        "female_alcohol": female_alcohol,
        "female_exercise": female_exercise,
        "female_sleep": female_sleep,
        "female_stress": female_stress,
        "cycle_length_days": cycle_length_days,
        "flow_duration_days": flow_duration_days,
        "pain_level": pain_level,
        "pcos_phenotype": pcos_phenotype,
        "endometriosis_stage": endometriosis_stage,
        "structural_finding": structural_finding,
        "bilateral_tubal_block": bilateral_tubal_block,
        "coital_frequency": coital_frequency,
        "ovulation_tracking": ovulation_tracking,
    }
    male_overrides = {
        "age": male_age,
        "male_bmi": male_bmi,
        "male_smoker": male_smoker,
        "male_alcohol": male_alcohol,
        "male_exercise": male_exercise,
        "male_sleep": male_sleep,
        "male_stress": male_stress,
        "varicocele_grade": varicocele_grade,
        "dfi": dfi,
        "testicular_volume": testicular_volume,
    }

    female_obj = build_female_data(female_llm, female_overrides)
    male_obj = build_male_data(male_llm, male_overrides)

    # ── Step 4: Score ──
    female_result = score_female(female_obj)
    male_result = score_male(male_obj)

    lifestyle_obj = CoupleLifestyle(
        coital_frequency=coital_frequency,
        ovulation_tracking=ovulation_tracking,
        regional_city_tier=regional_city_tier,
        pm25=pm25,
        air_purifier=air_purifier,
        occupational_hazard=occupational_hazard,
    )

    f_norm = female_result["total_normalized"]
    m_norm = male_result["total_normalized"]
    combined_result = score_combined(f_norm, m_norm, female_obj, male_obj, lifestyle_obj)

    return JSONResponse({
        "extraction": {
            "female_pdf_text_preview": female_text[:500],
            "male_pdf_text_preview": male_text[:500],
            "female_llm_structured": female_llm,
            "male_llm_structured": male_llm,
        },
        "female_scoring": {
            "total_raw": female_result["total_raw"],
            "total_normalized": female_result["total_normalized"],
            "absolute_barrier": female_result["absolute_barrier"],
            "barrier_reason": female_result.get("barrier_reason", ""),
            "component_scores": female_result.get("component_scores", {}),
            "steps": steps_to_dict(female_result["steps"]),
        },
        "male_scoring": {
            "total_raw": male_result["total_raw"],
            "total_normalized": male_result["total_normalized"],
            "absolute_barrier": male_result["absolute_barrier"],
            "barrier_reason": male_result.get("barrier_reason", ""),
            "component_scores": male_result.get("component_scores", {}),
            "steps": steps_to_dict(male_result["steps"]),
        },
        "combined_result": {
            "combined_bio_score": combined_result["combined_bio_score"],
            "lifestyle_multiplier": combined_result["lifestyle_multiplier"],
            "behavioral_multiplier": combined_result["behavioral_multiplier"],
            "final_score": combined_result["final_score"],
            "mfr_percent": combined_result["mfr_percent"],
            "mfr_category": combined_result["mfr_category"],
            "prob_6m": combined_result["prob_6m"],
            "prob_12m": combined_result["prob_12m"],
            "recommendation": combined_result["recommendation"],
            "steps": steps_to_dict(combined_result["steps"]),
        }
    })


@app.post("/interpret")
async def interpret(
    openrouter_api_key: Optional[str] = Form(None),
    stage1_result: str = Form(...),   # JSON string of the /analyze response
    # Lifestyle context for the interpretation prompt
    coital_frequency: str = Form("Good"),
    ovulation_tracking: str = Form("App"),
    regional_city_tier: str = Form("Metro"),
    pm25: float = Form(75.0),
    air_purifier: bool = Form(False),
    occupational_hazard: str = Form("None"),
    female_bmi: float = Form(22.0),
    male_bmi: float = Form(23.0),
    female_smoker: bool = Form(False),
    male_smoker: bool = Form(False),
    female_stress: str = Form("Moderate"),
    male_stress: str = Form("Moderate"),
):
    """
    Stage 2: Takes the /analyze output and sends it to OpenRouter
    (meta-llama/llama-3.3-70b-instruct) for rich structured interpretation.
    Returns a frontend-ready JSON payload.
    """
    resolved_openrouter_key = openrouter_api_key or os.getenv("OPENROUTER_API_KEY", "").strip().strip("'\"")
    if not resolved_openrouter_key:
        raise HTTPException(status_code=400, detail="OpenRouter API key is required. Provide in form or set OPENROUTER_API_KEY env var.")

    try:
        stage1 = json.loads(stage1_result)
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=400, detail=f"Invalid stage1_result JSON: {str(e)}")

    lifestyle_context = {
        "Coital Frequency": coital_frequency,
        "Ovulation Tracking": ovulation_tracking,
        "City Tier": regional_city_tier,
        "PM2.5 Level": f"{pm25} µg/m³",
        "HEPA Air Purifier": "Yes" if air_purifier else "No",
        "Occupational Hazard": occupational_hazard,
        "Female BMI": female_bmi,
        "Male BMI": male_bmi,
        "Female Smoker": "Yes" if female_smoker else "No",
        "Male Smoker": "Yes" if male_smoker else "No",
        "Female Stress Level": female_stress,
        "Male Stress Level": male_stress,
    }

    result = call_openrouter_interpretation(
        stage1_result=stage1,
        openrouter_api_key=resolved_openrouter_key,
        lifestyle_context=lifestyle_context,
    )

    return JSONResponse(result)


@app.post("/analyze_and_interpret")
async def analyze_and_interpret(
    female_pdf: UploadFile = File(...),
    male_pdf: UploadFile = File(...),
    groq_api_key: Optional[str] = Form(None),
    openrouter_api_key: Optional[str] = Form(None),
    # All the same form fields as /analyze
    coital_frequency: str = Form("Good"),
    ovulation_tracking: str = Form("App"),
    regional_city_tier: str = Form("Metro"),
    pm25: float = Form(75.0),
    air_purifier: bool = Form(False),
    occupational_hazard: str = Form("None"),
    female_age: Optional[int] = Form(None),
    female_bmi: Optional[float] = Form(22.0),
    female_smoker: bool = Form(False),
    female_alcohol: int = Form(0),
    female_exercise: float = Form(3.0),
    female_sleep: float = Form(7.0),
    female_stress: str = Form("Moderate"),
    cycle_length_days: int = Form(28),
    flow_duration_days: int = Form(5),
    pain_level: str = Form("Minimal"),
    pcos_phenotype: str = Form("None"),
    endometriosis_stage: str = Form("None"),
    structural_finding: str = Form("Normal uterus, normal ovaries, both tubes patent"),
    bilateral_tubal_block: bool = Form(False),
    male_age: Optional[int] = Form(None),
    male_bmi: Optional[float] = Form(23.0),
    male_smoker: bool = Form(False),
    male_alcohol: int = Form(0),
    male_exercise: float = Form(3.0),
    male_sleep: float = Form(7.0),
    male_stress: str = Form("Moderate"),
    varicocele_grade: str = Form("None"),
    dfi: Optional[float] = Form(None),
    testicular_volume: Optional[float] = Form(None),
):
    """
    Full pipeline: PDF → Groq extraction → Score → OpenRouter interpretation.
    Single endpoint that runs Stage 1 + Stage 2 sequentially.
    Returns both the raw scoring data AND the interpreted frontend payload.
    """
    # Resolve API keys from env if not provided
    resolved_groq_key = groq_api_key or os.getenv("GROQ_API_KEY", "").strip().strip("'\"")
    resolved_openrouter_key = openrouter_api_key or os.getenv("OPENROUTER_API_KEY", "").strip().strip("'\"")

    if not resolved_groq_key:
        raise HTTPException(status_code=400, detail="Groq API key is required. Provide in form or set GROQ_API_KEY env var.")
    if not resolved_openrouter_key:
        raise HTTPException(status_code=400, detail="OpenRouter API key is required. Provide in form or set OPENROUTER_API_KEY env var.")

    # ── Re-read files (need to read them here since they're UploadFile objects) ──
    female_bytes = await female_pdf.read()
    male_bytes = await male_pdf.read()

    female_text = extract_pdf_text(female_bytes)
    male_text = extract_pdf_text(male_bytes)

    female_llm = call_groq_for_structured_data(female_text, "female", resolved_groq_key)
    male_llm = call_groq_for_structured_data(male_text, "male", resolved_groq_key)

    female_overrides = {
        "age": female_age,
        "female_bmi": female_bmi,
        "female_smoker": female_smoker,
        "female_alcohol": female_alcohol,
        "female_exercise": female_exercise,
        "female_sleep": female_sleep,
        "female_stress": female_stress,
        "cycle_length_days": cycle_length_days,
        "flow_duration_days": flow_duration_days,
        "pain_level": pain_level,
        "pcos_phenotype": pcos_phenotype,
        "endometriosis_stage": endometriosis_stage,
        "structural_finding": structural_finding,
        "bilateral_tubal_block": bilateral_tubal_block,
        "coital_frequency": coital_frequency,
        "ovulation_tracking": ovulation_tracking,
    }
    male_overrides = {
        "age": male_age,
        "male_bmi": male_bmi,
        "male_smoker": male_smoker,
        "male_alcohol": male_alcohol,
        "male_exercise": male_exercise,
        "male_sleep": male_sleep,
        "male_stress": male_stress,
        "varicocele_grade": varicocele_grade,
        "dfi": dfi,
        "testicular_volume": testicular_volume,
    }

    female_obj = build_female_data(female_llm, female_overrides)
    male_obj = build_male_data(male_llm, male_overrides)

    female_result = score_female(female_obj)
    male_result = score_male(male_obj)

    lifestyle_obj = CoupleLifestyle(
        coital_frequency=coital_frequency,
        ovulation_tracking=ovulation_tracking,
        regional_city_tier=regional_city_tier,
        pm25=pm25,
        air_purifier=air_purifier,
        occupational_hazard=occupational_hazard,
    )

    f_norm = female_result["total_normalized"]
    m_norm = male_result["total_normalized"]
    combined_result = score_combined(f_norm, m_norm, female_obj, male_obj, lifestyle_obj)

    stage1_payload = {
        "extraction": {
            "female_pdf_text_preview": female_text[:500],
            "male_pdf_text_preview": male_text[:500],
            "female_llm_structured": female_llm,
            "male_llm_structured": male_llm,
        },
        "female_scoring": {
            "total_raw": female_result["total_raw"],
            "total_normalized": female_result["total_normalized"],
            "absolute_barrier": female_result["absolute_barrier"],
            "barrier_reason": female_result.get("barrier_reason", ""),
            "component_scores": female_result.get("component_scores", {}),
            "steps": steps_to_dict(female_result["steps"]),
        },
        "male_scoring": {
            "total_raw": male_result["total_raw"],
            "total_normalized": male_result["total_normalized"],
            "absolute_barrier": male_result["absolute_barrier"],
            "barrier_reason": male_result.get("barrier_reason", ""),
            "component_scores": male_result.get("component_scores", {}),
            "steps": steps_to_dict(male_result["steps"]),
        },
        "combined_result": {
            "combined_bio_score": combined_result["combined_bio_score"],
            "lifestyle_multiplier": combined_result["lifestyle_multiplier"],
            "behavioral_multiplier": combined_result["behavioral_multiplier"],
            "final_score": combined_result["final_score"],
            "mfr_percent": combined_result["mfr_percent"],
            "mfr_category": combined_result["mfr_category"],
            "prob_6m": combined_result["prob_6m"],
            "prob_12m": combined_result["prob_12m"],
            "recommendation": combined_result["recommendation"],
            "steps": steps_to_dict(combined_result["steps"]),
        }
    }

    lifestyle_context = {
        "Coital Frequency": coital_frequency,
        "Ovulation Tracking": ovulation_tracking,
        "City Tier": regional_city_tier,
        "PM2.5 Level": f"{pm25} µg/m³",
        "HEPA Air Purifier": "Yes" if air_purifier else "No",
        "Occupational Hazard": occupational_hazard,
        "Female BMI": female_bmi,
        "Male BMI": male_bmi,
        "Female Smoker": "Yes" if female_smoker else "No",
        "Male Smoker": "Yes" if male_smoker else "No",
        "Female Stress Level": female_stress,
        "Male Stress Level": male_stress,
    }

    stage2_result = call_openrouter_interpretation(
        stage1_result=stage1_payload,
        openrouter_api_key=resolved_openrouter_key,
        lifestyle_context=lifestyle_context,
    )

    return JSONResponse({
        "stage1": stage1_payload,
        "stage2": stage2_result,
    })


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)