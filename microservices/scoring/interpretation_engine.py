"""
Stage 2: LLM Interpretation Engine
Sends scoring analysis to meta-llama/llama-3.3-70b-instruct via OpenRouter
and returns a rich structured payload for the React frontend.
"""

import json
import re
from openai import OpenAI


# ─────────────────────────────────────────────────────────────────────────────
# SYSTEM PROMPT (the full schema contract the LLM must follow)
# ─────────────────────────────────────────────────────────────────────────────

SYSTEM_PROMPT = """You are a senior reproductive medicine specialist and clinical data analyst.
You receive structured fertility scoring data from a clinically validated model and must produce
a SINGLE, valid JSON object that a React web application will render directly.

RULES:
1. Return ONLY raw JSON. No markdown fences. No explanation. No preamble.
2. Every field listed in the schema MUST be present. Never omit a key.
3. All score values are 0-100 integers unless otherwise stated.
4. status values must be EXACTLY one of: "Normal" | "Borderline" | "Low" | "High" | "Abnormal" | "Negative" | "Positive" | "Carrier" | "Immune" | "Not Immune"
5. color values must be EXACTLY one of: "emerald" | "rose" | "blue" | "violet" | "amber" | "orange" | "red"
6. Write plain English — no medical jargon. Imagine explaining to a well-educated but non-medical couple.
7. warnings array: empty [] if no warning for that domain. Otherwise 1-3 short warning strings.
8. criticalities: list the most important medical flags that need expert attention. Max 5 items.
9. missing_tests: list IMPORTANT tests not found in the reports. Be specific. Max 8 per person.
10. baby_planning_window: "0-3 years" | "3-7 years" | "7-10 years" | ">10 years" — pick the SINGLE best match.
11. consultation_urgency: "Routine" | "Soon" | "Urgent" | "Immediate"
12. All text fields: concise, warm, non-alarmist. Max 2 sentences each.
"""

RESPONSE_SCHEMA = """
OUTPUT JSON SCHEMA (produce exactly this structure):

{
  "overall_compatibility_score": <integer 0-100>,
  "overall_compatibility_label": <string e.g. "Excellent" | "Good" | "Fair" | "Needs Attention" | "Critical">,
  "overall_compatibility_summary": <string — 1 sentence summary for the hero card>,

  "fertility_mfr": {
    "mfr_percent": <float>,
    "category": <string>,
    "prob_6_month": <float>,
    "prob_12_month": <float>,
    "monthly_conception_chance_label": <string e.g. "~12% per cycle">,
    "clinical_recommendation": <string — 1-2 sentences>
  },

  "matrix": {
    "genetics": {
      "color": <color>,
      "section_score": <integer 0-100>,
      "params": [
        {
          "name": <string>,
          "female_value": <string>,
          "female_status": <status>,
          "male_value": <string>,
          "male_status": <status>,
          "compatibility_score": <integer 0-100>,
          "flag": <null | "warning" | "critical">,
          "note": <string — one short plain-English sentence>
        }
      ]
    },
    "fertility": {
      "color": <color>,
      "section_score": <integer 0-100>,
      "params": [
        {
          "name": <string>,
          "female_value": <string>,
          "female_status": <status>,
          "male_value": <string>,
          "male_status": <status>,
          "compatibility_score": <integer 0-100>,
          "flag": <null | "warning" | "critical">,
          "note": <string>
        }
      ]
    },
    "chronic_health": {
      "color": <color>,
      "section_score": <integer 0-100>,
      "params": [
        {
          "name": <string>,
          "female_value": <string>,
          "female_status": <status>,
          "male_value": <string>,
          "male_status": <status>,
          "compatibility_score": <integer 0-100>,
          "flag": <null | "warning" | "critical">,
          "note": <string>
        }
      ]
    },
    "infection_risk": {
      "color": <color>,
      "section_score": <integer 0-100>,
      "params": [
        {
          "name": <string>,
          "female_value": <string>,
          "female_status": <status>,
          "male_value": <string>,
          "male_status": <status>,
          "compatibility_score": <integer 0-100>,
          "flag": <null | "warning" | "critical">,
          "note": <string>
        }
      ]
    },
    "lifestyle_metabolic": {
      "color": <color>,
      "section_score": <integer 0-100>,
      "params": [
        {
          "name": <string>,
          "female_value": <string>,
          "female_status": <status>,
          "male_value": <string>,
          "male_status": <status>,
          "compatibility_score": <integer 0-100>,
          "flag": <null | "warning" | "critical">,
          "note": <string>
        }
      ]
    },
    "blood_compatibility": {
      "color": <color>,
      "section_score": <integer 0-100>,
      "params": [
        {
          "name": <string>,
          "female_value": <string>,
          "female_status": <status>,
          "male_value": <string>,
          "male_status": <status>,
          "compatibility_score": <integer 0-100>,
          "flag": <null | "warning" | "critical">,
          "note": <string>
        }
      ]
    }
  },

  "health_domains": [
    {
      "name": <string>,
      "score": <integer 0-100>,
      "color": <color>,
      "what_it_means": <string — plain English, 1-2 sentences>,
      "why_it_matters": <string — plain English, 1-2 sentences>,
      "warnings": [<string>, ...]
    }
  ],

  "baby_planning_window": {
    "optimal_window": <"0-3 years" | "3-7 years" | "7-10 years" | ">10 years">,
    "confidence": <"High" | "Moderate" | "Low">,
    "explanation": <string — 2 sentences explaining why this window>,
    "current_position_percent": <integer 0-100, where on the 0-10yr timeline are they now, 0=just starting>
  },

  "criticalities": [
    {
      "title": <string — short title e.g. "Elevated TSH / Hypothyroidism">,
      "description": <string — 1 sentence plain English>,
      "severity": <"critical" | "warning" | "info">,
      "person": <"female" | "male" | "couple">,
      "action": <string — what should they do>
    }
  ],

  "missing_tests": {
    "female": [
      {
        "test_name": <string>,
        "why_important": <string — 1 sentence>,
        "category": <"Fertility" | "Hormonal" | "Genetic" | "Infection" | "Metabolic" | "Structural">
      }
    ],
    "male": [
      {
        "test_name": <string>,
        "why_important": <string — 1 sentence>,
        "category": <"Fertility" | "Hormonal" | "Genetic" | "Infection" | "Metabolic" | "Structural">
      }
    ]
  },

  "missing_tests_summary": {
    "female_count": <integer>,
    "male_count": <integer>,
    "total_count": <integer>,
    "categories": [
      {
        "name": <string>,
        "pending": <integer>,
        "icon_emoji": <string>
      }
    ]
  },

  "key_kpis": {
    "female_biological_score": <integer 0-100>,
    "male_biological_score": <integer 0-100>,
    "combined_biological_score": <integer 0-100>,
    "lifestyle_multiplier_percent": <integer 0-100, convert 0-1 multiplier to percent>,
    "behavioral_multiplier_percent": <integer 0-100>,
    "rh_compatibility_risk": <"No Risk" | "Low Risk" | "Moderate Risk" | "High Risk">,
    "hemoglobin_variant_risk": <"No Risk" | "Carrier Risk" | "High Risk">,
    "thyroid_status_female": <string e.g. "Hypothyroid" | "Optimal" | "Hyperthyroid" | "Borderline">,
    "thyroid_status_male": <string e.g. "Normal" | "Borderline" | "Abnormal">,
    "semen_quality_grade": <"Excellent" | "Good" | "Fair" | "Poor" | "Critical">,
    "overall_infection_clearance": <"Clear" | "Flagged">,
    "genetic_compatibility_risk": <"Low" | "Moderate" | "High">,
    "metabolic_health_score": <integer 0-100>,
    "age_fertility_alignment": <"Excellent" | "Good" | "Fair" | "Declining" | "Critical">
  },

  "actionable_insights": [
    {
      "priority": <integer 1-5, 1 = highest>,
      "title": <string>,
      "description": <string — 1-2 sentences>,
      "timeframe": <"Immediate" | "Within 1 month" | "Within 3 months" | "Within 6 months" | "Long-term">,
      "category": <"Medical" | "Lifestyle" | "Testing" | "Specialist">,
      "applies_to": <"female" | "male" | "couple">
    }
  ],

  "consultation_urgency": <"Routine" | "Soon" | "Urgent" | "Immediate">,
  "consultation_reason": <string — why this urgency level>,

  "report_meta": {
    "female_name": <string or "Female Partner">,
    "male_name": <string or "Male Partner">,
    "female_age": <integer>,
    "male_age": <integer>,
    "female_clinical_profile": <string e.g. "Hypothyroid">,
    "male_clinical_profile": <string e.g. "Asthenozoospermia">,
    "analysis_version": "2.0"
  }
}
"""

USER_PROMPT_TEMPLATE = """
Analyze the following fertility scoring results and produce the structured JSON report.

═══════════════════════════════════════════════
FEMALE PATIENT DATA
═══════════════════════════════════════════════
{female_llm_data}

Female Scoring Results:
- Biological Score (normalized): {female_bio_score}/100
- Raw Score: {female_raw_score}/115
- Absolute Barrier: {female_barrier}
- Component Scores: {female_components}
- Absolute barrier reason (if any): {female_barrier_reason}

═══════════════════════════════════════════════
MALE PATIENT DATA
═══════════════════════════════════════════════
{male_llm_data}

Male Scoring Results:
- Biological Score (normalized): {male_bio_score}/100
- Raw Score: {male_raw_score}/115
- Absolute Barrier: {male_barrier}
- Component Scores: {male_components}
- Absolute barrier reason (if any): {male_barrier_reason}

═══════════════════════════════════════════════
COMBINED COUPLE ANALYSIS
═══════════════════════════════════════════════
- Combined Biological Score: {combined_bio_score}/100
- Lifestyle Multiplier: {lifestyle_mult} (product of BMI, smoking, alcohol, exercise, sleep, stress, regional factors)
- Behavioral Multiplier: {behavioral_mult} (coital frequency + ovulation tracking)
- Final Adjusted Score: {final_score}/100
- Monthly Fecundability Rate (MFR): {mfr_percent}%
- MFR Category: {mfr_category}
- 6-Month Pregnancy Probability: {prob_6m}%
- 12-Month Pregnancy Probability: {prob_12m}%
- Primary Clinical Recommendation: {recommendation}

═══════════════════════════════════════════════
LIFESTYLE INPUTS
═══════════════════════════════════════════════
{lifestyle_context}

═══════════════════════════════════════════════
STEP-BY-STEP SCORING PIPELINE (key steps)
═══════════════════════════════════════════════
{scoring_steps_summary}

Now produce the complete JSON report following the schema exactly.
"""


def call_openrouter_interpretation(
    stage1_result: dict,
    openrouter_api_key: str,
    lifestyle_context: dict,
) -> dict:
    """
    Send stage 1 scoring results to OpenRouter (llama-3.3-70b-instruct)
    and return the structured frontend payload.
    """

    # ── Build female/male extracted data summaries ──
    extraction = stage1_result.get("extraction", {})
    female_llm_data = _summarize_extracted(extraction.get("female_llm_structured", {}).get("data", {}))
    male_llm_data = _summarize_extracted(extraction.get("male_llm_structured", {}).get("data", {}))

    fs = stage1_result["female_scoring"]
    ms = stage1_result["male_scoring"]
    cr = stage1_result["combined_result"]

    # ── Build scoring steps summary (condensed) ──
    female_steps_summary = _summarize_steps(fs.get("steps", []))
    male_steps_summary = _summarize_steps(ms.get("steps", []))
    combined_steps_summary = _summarize_steps(cr.get("steps", []))

    scoring_steps_summary = (
        f"FEMALE STEPS:\n{female_steps_summary}\n\n"
        f"MALE STEPS:\n{male_steps_summary}\n\n"
        f"COMBINED STEPS:\n{combined_steps_summary}"
    )

    lifestyle_str = "\n".join([f"  {k}: {v}" for k, v in lifestyle_context.items()])

    user_prompt = USER_PROMPT_TEMPLATE.format(
        female_llm_data=female_llm_data,
        female_bio_score=fs["total_normalized"],
        female_raw_score=fs["total_raw"],
        female_barrier=fs["absolute_barrier"],
        female_components=json.dumps(fs.get("component_scores", {})),
        female_barrier_reason=fs.get("barrier_reason", "None"),

        male_llm_data=male_llm_data,
        male_bio_score=ms["total_normalized"],
        male_raw_score=ms["total_raw"],
        male_barrier=ms["absolute_barrier"],
        male_components=json.dumps(ms.get("component_scores", {})),
        male_barrier_reason=ms.get("barrier_reason", "None"),

        combined_bio_score=cr["combined_bio_score"],
        lifestyle_mult=cr["lifestyle_multiplier"],
        behavioral_mult=cr["behavioral_multiplier"],
        final_score=cr["final_score"],
        mfr_percent=cr["mfr_percent"],
        mfr_category=cr["mfr_category"],
        prob_6m=cr["prob_6m"],
        prob_12m=cr["prob_12m"],
        recommendation=cr["recommendation"],

        lifestyle_context=lifestyle_str,
        scoring_steps_summary=scoring_steps_summary,
    )

    # ── OpenRouter API call ──
    client = OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=openrouter_api_key,
    )

    try:
        response = client.chat.completions.create(
            model="meta-llama/llama-3.3-70b-instruct",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT + "\n\n" + RESPONSE_SCHEMA},
                {"role": "user", "content": user_prompt},
            ],
            max_tokens=4000,
            temperature=0.15,
            extra_headers={
                "HTTP-Referer": "https://heartful.health",
                "X-Title": "Fertility Compatibility Scoring System v2.0",
            },
        )

        raw = response.choices[0].message.content.strip()

        # Strip markdown fences if model adds them
        raw = re.sub(r'^```(?:json)?\s*', '', raw, flags=re.MULTILINE)
        raw = re.sub(r'\s*```\s*$', '', raw, flags=re.MULTILINE)
        raw = raw.strip()

        parsed = json.loads(raw)
        return {
            "success": True,
            "data": parsed,
            "raw_output": raw,
            "model": "meta-llama/llama-3.3-70b-instruct",
            "tokens_used": response.usage.total_tokens if response.usage else None,
        }

    except json.JSONDecodeError as e:
        return {
            "success": False,
            "error": f"JSON parse error: {str(e)}",
            "raw_output": raw if 'raw' in dir() else "",
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "raw_output": "",
        }


# ─────────────────────────────────────────────────────────────────────────────
# HELPERS
# ─────────────────────────────────────────────────────────────────────────────

def _summarize_extracted(data: dict) -> str:
    """Convert LLM-extracted dict into a readable block for the prompt."""
    if not data:
        return "No structured data available."
    lines = []
    for k, v in data.items():
        if v is not None and v != [] and v != "null" and v != "":
            lines.append(f"  {k.replace('_', ' ').title()}: {v}")
    return "\n".join(lines) if lines else "No data extracted."


def _summarize_steps(steps: list) -> str:
    """Condense scoring steps into a readable summary for the prompt."""
    lines = []
    for step in steps:
        name = step.get("name", "")
        score = step.get("score", "")
        max_s = step.get("max_score", "")
        details = step.get("details", "")
        if max_s and max_s > 0:
            lines.append(f"  • {name}: {score}/{max_s} — {details[:120]}")
        elif details:
            lines.append(f"  • {name}: {details[:120]}")
    return "\n".join(lines) if lines else "  No steps available."