"""
Fertility Compatibility Scoring Engine v2.0
Implements the Clinically Validated Fertility Compatibility Model
"""

from dataclasses import dataclass, field
from typing import Optional
import math


# ─────────────────────────────────────────
# DATA MODELS
# ─────────────────────────────────────────

@dataclass
class FemaleData:
    age: int = 27
    # Ovarian reserve
    amh: Optional[float] = None          # ng/mL
    afc: Optional[int] = None            # antral follicle count
    fsh_day3: Optional[float] = None     # mIU/mL
    # Menstrual / ovulation
    cycle_length_days: Optional[int] = 28
    progesterone_day21: Optional[float] = None  # ng/mL
    flow_duration_days: Optional[int] = 5
    pain_level: str = "Minimal"          # "Minimal" | "Moderate" | "Severe"
    # Hormonal balance
    tsh: Optional[float] = None          # mIU/L
    prolactin: Optional[float] = None    # ng/mL
    estradiol_day2: Optional[float] = None  # pg/mL
    total_testosterone: Optional[float] = None  # ng/dL
    lh: Optional[float] = None
    fsh: Optional[float] = None
    # Structural
    bilateral_tubal_block: bool = False
    uterine_absence: bool = False
    severe_ashermans: bool = False
    structural_finding: str = "Normal uterus, normal ovaries, both tubes patent"
    # Clinical conditions
    pcos_phenotype: str = "None"         # None | A | B | C | D
    endometriosis_stage: str = "None"    # None | 1 | 2 | 3 | 4
    # Lifestyle
    bmi: Optional[float] = 22.0
    smoker: bool = False
    alcohol_units_per_week: int = 0
    exercise_hours_per_week: float = 3.0
    sleep_hours: float = 7.0
    stress_level: str = "Moderate"       # Low | Moderate | High | Severe
    # Behavioral
    coital_frequency: str = "Good"       # Optimal | Good | Moderate | Suboptimal | Random | Infrequent | None
    ovulation_tracking: str = "App"      # LH_Strips | BBT | Cervical_Mucus | Calendar | App | None


@dataclass
class MaleData:
    age: int = 31
    # Semen analysis (WHO 2021)
    sperm_concentration: Optional[float] = None  # million/mL
    progressive_motility: Optional[float] = None  # %
    morphology: Optional[float] = None   # % normal forms
    semen_volume: Optional[float] = None  # mL
    azoospermia: bool = False
    # Hormonal
    total_testosterone: Optional[float] = None  # ng/dL
    free_testosterone: Optional[float] = None   # ng/dL (if available)
    fsh: Optional[float] = None          # mIU/mL
    lh: Optional[float] = None           # mIU/mL
    # Structural
    testicular_volume: Optional[float] = None   # mL per testis
    varicocele_grade: str = "None"       # None | Subclinical | Grade1 | Grade2 | Grade3
    # DFI
    dfi: Optional[float] = None          # %
    # Lifestyle
    bmi: Optional[float] = 23.0
    smoker: bool = False
    alcohol_units_per_week: int = 0
    exercise_hours_per_week: float = 3.0
    sleep_hours: float = 7.0
    stress_level: str = "Moderate"


@dataclass
class CoupleLifestyle:
    coital_frequency: str = "Good"
    ovulation_tracking: str = "App"
    regional_city_tier: str = "Metro"    # Metro | Tier2 | Tier3 | Rural
    pm25: Optional[float] = 60.0
    air_purifier: bool = False
    occupational_hazard: str = "None"    # None | Mild | Moderate | HeavyMetal | Radiation


# ─────────────────────────────────────────
# STEP-BY-STEP SCORING
# ─────────────────────────────────────────

@dataclass
class ScoreStep:
    name: str
    score: float
    max_score: float
    details: str
    sub_steps: list = field(default_factory=list)


def score_female(f: FemaleData) -> dict:
    steps = []

    # ── ABSOLUTE BARRIER CHECK ──
    barriers = []
    if f.bilateral_tubal_block:
        barriers.append("Bilateral tubal block detected")
    if f.uterine_absence:
        barriers.append("Uterine absence detected")
    if f.severe_ashermans:
        barriers.append("Severe Asherman's syndrome detected")

    if barriers:
        steps.append(ScoreStep(
            name="⛔ ABSOLUTE BARRIER CHECK",
            score=0, max_score=0,
            details=f"BARRIER FOUND: {'; '.join(barriers)}. MFR = 0%. EXIT to IVF pathway.",
        ))
        return {"total_raw": 0, "total_normalized": 0, "steps": steps,
                "absolute_barrier": True, "barrier_reason": "; ".join(barriers)}

    steps.append(ScoreStep(
        name="✅ ABSOLUTE BARRIER CHECK",
        score=0, max_score=0,
        details="No absolute barriers detected. Proceeding with full scoring."
    ))

    # ── 3.1 AGE SCORE (max 25) ──
    age_score = _female_age_score(f.age)
    steps.append(ScoreStep(
        name="3.1 Age-Adjusted Fertility Score",
        score=age_score, max_score=25,
        details=f"Age {f.age} → {age_score}/25 points. "
                f"Coefficient: {age_score/25:.2f}. {_female_age_status(f.age)}"
    ))

    # ── 3.2 OVARIAN RESERVE SCORE (max 20) ──
    amh_pts, afc_pts, fsh_pts, ovarian_details = _ovarian_reserve_score(f)
    ovarian_score = min(20, 0.50 * amh_pts + 0.30 * afc_pts + 0.20 * fsh_pts)
    steps.append(ScoreStep(
        name="3.2 Ovarian Reserve Score",
        score=round(ovarian_score, 1), max_score=20,
        details=ovarian_details,
        sub_steps=[
            f"AMH component (50% weight): {amh_pts:.1f} pts",
            f"AFC component (30% weight): {afc_pts:.1f} pts",
            f"FSH component (20% weight): {fsh_pts:.1f} pts",
            f"Formula: 0.50×{amh_pts:.1f} + 0.30×{afc_pts:.1f} + 0.20×{fsh_pts:.1f} = {ovarian_score:.1f}"
        ]
    ))

    # ── 3.3 MENSTRUAL / OVULATION SCORE (max 20) ──
    menstrual_base, menstrual_mods, menstrual_details = _menstrual_score(f)
    menstrual_score = min(20, menstrual_base + menstrual_mods)
    steps.append(ScoreStep(
        name="3.3 Menstrual Cycle & Ovulation Score",
        score=menstrual_score, max_score=20,
        details=menstrual_details,
        sub_steps=[
            f"Cycle pattern base score: {menstrual_base}",
            f"Flow duration & dysmenorrhea modifiers: +{menstrual_mods}",
            f"Total: {menstrual_score}/20"
        ]
    ))

    # ── 3.4 HORMONAL BALANCE SCORE (max 20) ──
    tsh_pts, prl_pts, e2_pts, tt_pts, lhfsh_pts, hormonal_details = _hormonal_balance_score(f)
    hormonal_score = tsh_pts + prl_pts + e2_pts + tt_pts + lhfsh_pts
    steps.append(ScoreStep(
        name="3.4 Hormonal Balance Score",
        score=hormonal_score, max_score=20,
        details=hormonal_details,
        sub_steps=[
            f"TSH (max 5): {tsh_pts} pts",
            f"Prolactin (max 5): {prl_pts} pts",
            f"Estradiol Day2-3 (max 3): {e2_pts} pts",
            f"Total Testosterone (max 4): {tt_pts} pts",
            f"LH/FSH Ratio (max 3): {lhfsh_pts} pts",
        ]
    ))

    # ── 3.5 STRUCTURAL HEALTH SCORE (max 15) ──
    structural_score, structural_details = _structural_score(f.structural_finding)
    steps.append(ScoreStep(
        name="3.5 Structural Health Score",
        score=structural_score, max_score=15,
        details=structural_details
    ))

    # ── 3.6 CLINICAL CONDITIONS SCORE (max 15) ──
    pcos_score, endo_score, clinical_details = _clinical_conditions_score(f)
    clinical_score = pcos_score + endo_score
    steps.append(ScoreStep(
        name="3.6 Clinical Conditions Score",
        score=clinical_score, max_score=15,
        details=clinical_details,
        sub_steps=[
            f"PCOS component: {pcos_score} pts",
            f"Endometriosis component: {endo_score} pts"
        ]
    ))

    # ── 3.7 TOTAL FEMALE BIOLOGICAL SCORE ──
    raw_total = age_score + ovarian_score + menstrual_score + hormonal_score + structural_score + clinical_score
    normalized = min(100, (raw_total / 115) * 100)

    steps.append(ScoreStep(
        name="3.7 Female Total Biological Score",
        score=round(normalized, 1), max_score=100,
        details=(
            f"Raw total: {raw_total:.1f} / 115 maximum points\n"
            f"Normalized = ({raw_total:.1f} / 115) × 100 = {normalized:.1f}/100\n"
            f"Components: Age({age_score}) + OvarianReserve({ovarian_score:.1f}) + "
            f"Menstrual({menstrual_score}) + Hormonal({hormonal_score}) + "
            f"Structural({structural_score}) + Clinical({clinical_score})"
        )
    ))

    return {
        "total_raw": round(raw_total, 1),
        "total_normalized": round(normalized, 1),
        "steps": steps,
        "absolute_barrier": False,
        "component_scores": {
            "age": age_score,
            "ovarian_reserve": round(ovarian_score, 1),
            "menstrual_ovulation": menstrual_score,
            "hormonal_balance": hormonal_score,
            "structural": structural_score,
            "clinical_conditions": clinical_score
        }
    }


def score_male(m: MaleData) -> dict:
    steps = []

    # ── ABSOLUTE BARRIER CHECK ──
    if m.azoospermia or (m.sperm_concentration is not None and m.sperm_concentration == 0):
        steps.append(ScoreStep(
            name="⛔ ABSOLUTE BARRIER CHECK",
            score=0, max_score=0,
            details="Azoospermia detected. Natural conception not possible. Exit to TESE/ICSI pathway."
        ))
        return {"total_raw": 0, "total_normalized": 0, "steps": steps,
                "absolute_barrier": True, "barrier_reason": "Azoospermia"}

    steps.append(ScoreStep(
        name="✅ ABSOLUTE BARRIER CHECK",
        score=0, max_score=0,
        details="No absolute barriers. Proceeding with full scoring."
    ))

    # ── 4.1 AGE SCORE (max 25) ──
    age_score = _male_age_score(m.age)
    steps.append(ScoreStep(
        name="4.1 Age-Adjusted Fertility Score",
        score=age_score, max_score=25,
        details=f"Age {m.age} → {age_score}/25. {_male_age_status(m.age)}"
    ))

    # ── 4.2 SEMEN ANALYSIS SCORE (max 40) ──
    conc_pts, motility_pts, morph_pts, vol_pts, semen_details = _semen_analysis_score(m)
    semen_score = conc_pts + motility_pts + morph_pts + vol_pts
    # Normozoospermia bonus
    bonus = 0
    if (m.sperm_concentration and m.sperm_concentration >= 40
            and m.progressive_motility and m.progressive_motility >= 60
            and m.morphology and m.morphology >= 8
            and m.semen_volume and 2 <= m.semen_volume <= 5):
        bonus = 3
    semen_score = min(40, semen_score + bonus)
    steps.append(ScoreStep(
        name="4.2 Semen Analysis Score",
        score=semen_score, max_score=40,
        details=semen_details + (f" [Normozoospermia bonus: +{bonus}]" if bonus else ""),
        sub_steps=[
            f"Concentration score (max 12): {conc_pts}",
            f"Progressive motility score (max 12): {motility_pts}",
            f"Morphology score (max 10): {morph_pts}",
            f"Volume score (max 6): {vol_pts}",
            f"Normozoospermia bonus: +{bonus}",
            f"Total: {semen_score}/40"
        ]
    ))

    # ── 4.3 HORMONAL PROFILE SCORE (max 20) ──
    tt_pts, ft_pts, fsh_pts, lh_pts, hormonal_details = _male_hormonal_score(m)
    hormonal_score = tt_pts + ft_pts + fsh_pts + lh_pts
    steps.append(ScoreStep(
        name="4.3 Hormonal Profile Score",
        score=hormonal_score, max_score=20,
        details=hormonal_details,
        sub_steps=[
            f"Total Testosterone (max 8): {tt_pts}",
            f"Free Testosterone (max 6): {ft_pts}",
            f"FSH (max 3): {fsh_pts}",
            f"LH (max 3): {lh_pts}",
        ]
    ))

    # ── 4.4 STRUCTURAL ASSESSMENT (max 15) ──
    tv_pts, varicocele_pts, struct_details = _male_structural_score(m)
    structural_score = tv_pts + varicocele_pts
    steps.append(ScoreStep(
        name="4.4 Structural Assessment Score",
        score=structural_score, max_score=15,
        details=struct_details,
        sub_steps=[
            f"Testicular volume (max 8): {tv_pts}",
            f"Varicocele grade (max 7): {varicocele_pts}",
        ]
    ))

    # ── 4.5 DNA FRAGMENTATION INDEX (max 15) ──
    dfi_score, dfi_details = _dfi_score(m.dfi)
    steps.append(ScoreStep(
        name="4.5 DNA Fragmentation Index (DFI) Score",
        score=dfi_score, max_score=15,
        details=dfi_details
    ))

    # ── 4.6 MALE TOTAL BIOLOGICAL SCORE ──
    raw_total = age_score + semen_score + hormonal_score + structural_score + dfi_score
    normalized = min(100, (raw_total / 115) * 100)

    steps.append(ScoreStep(
        name="4.6 Male Total Biological Score",
        score=round(normalized, 1), max_score=100,
        details=(
            f"Raw total: {raw_total:.1f} / 115 maximum points\n"
            f"Normalized = ({raw_total:.1f} / 115) × 100 = {normalized:.1f}/100\n"
            f"Components: Age({age_score}) + Semen({semen_score}) + "
            f"Hormonal({hormonal_score}) + Structural({structural_score}) + DFI({dfi_score})"
        )
    ))

    return {
        "total_raw": round(raw_total, 1),
        "total_normalized": round(normalized, 1),
        "steps": steps,
        "absolute_barrier": False,
        "component_scores": {
            "age": age_score,
            "semen_analysis": semen_score,
            "hormonal_profile": hormonal_score,
            "structural": structural_score,
            "dfi": dfi_score
        }
    }


def score_combined(female_score: float, male_score: float,
                   f: FemaleData, m: MaleData, lifestyle: CoupleLifestyle) -> dict:
    steps = []

    # Check for absolute barriers in both partners
    female_barrier = f.bilateral_tubal_block or f.uterine_absence or f.severe_ashermans
    male_barrier = m.azoospermia or (m.sperm_concentration is not None and m.sperm_concentration == 0)

    if female_barrier or male_barrier:
        mfr_category = "Critical (<2%) — IVF pathway recommended"
        recommendation = "🚨 Absolute barrier detected. Immediate referral to Reproductive Endocrinologist for IVF/ICSI evaluation."
        steps.append(ScoreStep(
            name="⛔ COMBINED BIOLOGICAL SCORE (Absolute Barrier)",
            score=0, max_score=100,
            details=f"Absolute barrier present in: {'Female' if female_barrier else ''} {'Male' if male_barrier else ''}. natural conception not possible. Exit to IVF/ICSI pathway."
        ))
        return {
            "combined_bio_score": 0.0,
            "lifestyle_multiplier": 0.0,
            "behavioral_multiplier": 0.0,
            "final_score": 0.0,
            "mfr_percent": 0.0,
            "mfr_category": mfr_category,
            "prob_6m": 0.0,
            "prob_12m": 0.0,
            "recommendation": recommendation,
            "steps": steps
        }

    # ── SECTION 5: COMBINED COUPLE SCORE ──
    gap = abs(female_score - male_score)
    lower = min(female_score, male_score)
    higher = max(female_score, male_score)

    if gap <= 10:
        combined_bio = (female_score + male_score) / 2
        formula_used = f"Gap ≤ 10 → Average: ({female_score:.1f} + {male_score:.1f}) / 2"
    elif gap <= 20:
        combined_bio = lower * 0.55 + higher * 0.45
        formula_used = f"Gap 11-20 → Weighted: {lower:.1f}×0.55 + {higher:.1f}×0.45"
    else:
        combined_bio = lower * 0.60 + higher * 0.40
        formula_used = f"Gap > 20 → Bottleneck: {lower:.1f}×0.60 + {higher:.1f}×0.40"

    steps.append(ScoreStep(
        name="5.1 Combined Biological Score (Bottleneck Formula)",
        score=round(combined_bio, 1), max_score=100,
        details=f"Female: {female_score:.1f}/100 | Male: {male_score:.1f}/100 | Gap: {gap:.1f}\n{formula_used} = {combined_bio:.1f}",
        sub_steps=[
            f"Female biological score: {female_score:.1f}",
            f"Male biological score: {male_score:.1f}",
            f"Score gap: {gap:.1f}",
            f"Formula applied: {formula_used}",
            f"Combined biological score: {combined_bio:.1f}"
        ]
    ))

    # ── SECTION 6: LIFESTYLE MULTIPLIERS ──
    f_bmi_mult = _female_bmi_multiplier(f.bmi)
    m_bmi_mult = _male_bmi_multiplier(m.bmi)
    tobacco_mult = 0.70 if f.smoker or m.smoker else 1.00
    f_alcohol = _alcohol_multiplier(f.alcohol_units_per_week)
    m_alcohol = _alcohol_multiplier(m.alcohol_units_per_week)
    f_activity = _activity_multiplier(f.exercise_hours_per_week)
    m_activity = _activity_multiplier(m.exercise_hours_per_week)
    f_sleep = _sleep_multiplier(f.sleep_hours)
    m_sleep = _sleep_multiplier(m.sleep_hours)
    f_stress = _stress_multiplier(f.stress_level)
    m_stress = _stress_multiplier(m.stress_level)
    regional_mult = _regional_multiplier(lifestyle.regional_city_tier, lifestyle.pm25, lifestyle.air_purifier)
    occ_mult = _occupational_multiplier(lifestyle.occupational_hazard)

    lifestyle_mult = (f_bmi_mult * m_bmi_mult * tobacco_mult *
                      f_alcohol * m_alcohol * f_activity * m_activity *
                      f_sleep * m_sleep * f_stress * m_stress *
                      regional_mult * occ_mult)
    lifestyle_mult = round(max(0.05, min(1.00, lifestyle_mult)), 4)

    steps.append(ScoreStep(
        name="6. Lifestyle & Environmental Multiplier",
        score=lifestyle_mult, max_score=1.00,
        details=f"Combined lifestyle multiplier: {lifestyle_mult:.4f}",
        sub_steps=[
            f"Female BMI ({f.bmi}): ×{f_bmi_mult}",
            f"Male BMI ({m.bmi}): ×{m_bmi_mult}",
            f"Tobacco: ×{tobacco_mult}",
            f"Female alcohol ({f.alcohol_units_per_week} units/wk): ×{f_alcohol}",
            f"Male alcohol ({m.alcohol_units_per_week} units/wk): ×{m_alcohol}",
            f"Female activity ({f.exercise_hours_per_week} hrs/wk): ×{f_activity}",
            f"Male activity ({m.exercise_hours_per_week} hrs/wk): ×{m_activity}",
            f"Female sleep ({f.sleep_hours} hrs): ×{f_sleep}",
            f"Male sleep ({m.sleep_hours} hrs): ×{m_sleep}",
            f"Female stress ({f.stress_level}): ×{f_stress}",
            f"Male stress ({m.stress_level}): ×{m_stress}",
            f"Regional/PM2.5 ({lifestyle.regional_city_tier}, PM2.5={lifestyle.pm25}): ×{regional_mult}",
            f"Occupational hazard ({lifestyle.occupational_hazard}): ×{occ_mult}",
            f"Combined: {lifestyle_mult:.4f}"
        ]
    ))

    adjusted_score = combined_bio * lifestyle_mult
    steps.append(ScoreStep(
        name="Lifestyle-Adjusted Score",
        score=round(adjusted_score, 2), max_score=100,
        details=f"Combined bio ({combined_bio:.1f}) × Lifestyle multiplier ({lifestyle_mult:.4f}) = {adjusted_score:.2f}"
    ))

    # ── SECTION 7: BEHAVIORAL FACTORS ──
    coital_mult = _coital_frequency_multiplier(lifestyle.coital_frequency)
    tracking_mult = _tracking_multiplier(lifestyle.ovulation_tracking)
    behavioral_mult = coital_mult * tracking_mult
    behavioral_mult = round(behavioral_mult, 4)

    steps.append(ScoreStep(
        name="7. Behavioral Factors Multiplier",
        score=behavioral_mult, max_score=1.00,
        details=f"Coital frequency ({lifestyle.coital_frequency}): ×{coital_mult} | Ovulation tracking ({lifestyle.ovulation_tracking}): ×{tracking_mult}",
        sub_steps=[
            f"Coital frequency pattern ({lifestyle.coital_frequency}): ×{coital_mult}",
            f"Ovulation tracking method ({lifestyle.ovulation_tracking}): ×{tracking_mult}",
            f"Combined behavioral: {behavioral_mult:.4f}"
        ]
    ))

    # ── FINAL MFR CALCULATION ──
    final_score = adjusted_score * behavioral_mult
    mfr_percent = (final_score / 100) * 25

    steps.append(ScoreStep(
        name="Final Score Before MFR",
        score=round(final_score, 2), max_score=100,
        details=f"Adjusted ({adjusted_score:.2f}) × Behavioral ({behavioral_mult:.4f}) = {final_score:.2f}"
    ))

    mfr_category = _mfr_category(mfr_percent)
    prob_6m = _cumulative_prob(mfr_percent, 6)
    prob_12m = _cumulative_prob(mfr_percent, 12)

    steps.append(ScoreStep(
        name="7. MFR% — Monthly Fecundability Rate",
        score=round(mfr_percent, 2), max_score=25,
        details=(
            f"MFR = (Final Score / 100) × 25% = ({final_score:.2f}/100) × 25 = {mfr_percent:.2f}%\n"
            f"Category: {mfr_category}\n"
            f"6-Month Cumulative Probability: {prob_6m:.1f}%\n"
            f"12-Month Cumulative Probability: {prob_12m:.1f}%"
        ),
        sub_steps=[
            f"Formula: MFR = (Final_Score/100) × 25%",
            f"= ({final_score:.2f}/100) × 25 = {mfr_percent:.2f}%",
            f"Category: {mfr_category}",
            f"6-month probability: 1-(1-{mfr_percent/100:.4f})^6 = {prob_6m:.1f}%",
            f"12-month probability: 1-(1-{mfr_percent/100:.4f})^12 = {prob_12m:.1f}%"
        ]
    ))

    recommendation = _generate_recommendation(mfr_category, mfr_percent, f, m)

    return {
        "combined_bio_score": round(combined_bio, 1),
        "lifestyle_multiplier": lifestyle_mult,
        "behavioral_multiplier": behavioral_mult,
        "final_score": round(final_score, 2),
        "mfr_percent": round(mfr_percent, 2),
        "mfr_category": mfr_category,
        "prob_6m": round(prob_6m, 1),
        "prob_12m": round(prob_12m, 1),
        "recommendation": recommendation,
        "steps": steps
    }


# ─────────────────────────────────────────
# HELPER SCORING FUNCTIONS
# ─────────────────────────────────────────

def _female_age_score(age: int) -> int:
    if age <= 24: return 25
    if age <= 29: return 23
    if age <= 32: return 21
    if age <= 34: return 18
    if age <= 36: return 15
    if age <= 38: return 12
    if age <= 40: return 8
    if age <= 42: return 5
    if age <= 44: return 3
    return 1


def _female_age_status(age: int) -> str:
    if age <= 24: return "Peak fertility"
    if age <= 29: return "Excellent"
    if age <= 32: return "Very good"
    if age <= 34: return "Good"
    if age <= 36: return "Moderate decline begins"
    if age <= 38: return "Accelerated decline"
    if age <= 40: return "Significant decline"
    if age <= 42: return "Very low"
    if age <= 44: return "Near minimal"
    return "Minimal"


def _male_age_score(age: int) -> int:
    if age <= 29: return 25
    if age <= 35: return 24
    if age <= 40: return 22
    if age <= 45: return 19
    if age <= 50: return 16
    if age <= 55: return 12
    return 8


def _male_age_status(age: int) -> str:
    if age <= 29: return "Peak fertility"
    if age <= 35: return "Excellent"
    if age <= 40: return "Good - mild decline"
    if age <= 45: return "Moderate decline"
    if age <= 50: return "Significant decline"
    return "Substantially reduced"


def _ovarian_reserve_score(f: FemaleData):
    age = f.age
    amh = f.amh
    afc = f.afc
    fsh = f.fsh_day3

    # AMH scoring (age-specific)
    amh_pts = 10  # default mid-range if not available
    amh_detail = "AMH: not provided (default 10 pts)"
    if amh is not None:
        if age <= 30:
            if amh > 3.0:   amh_pts = 20
            elif amh >= 2.0: amh_pts = 20
            elif amh >= 1.5: amh_pts = 17
            elif amh >= 1.0: amh_pts = 12
            elif amh >= 0.5: amh_pts = 7
            else:            amh_pts = 3
        elif age <= 35:
            if amh > 2.5:    amh_pts = 20
            elif amh >= 1.5: amh_pts = 18
            elif amh >= 1.0: amh_pts = 14
            elif amh >= 0.7: amh_pts = 9
            else:             amh_pts = 4
        elif age <= 40:
            if amh > 2.0:    amh_pts = 20
            elif amh >= 1.0: amh_pts = 16
            elif amh >= 0.7: amh_pts = 12
            elif amh >= 0.3: amh_pts = 6
            else:             amh_pts = 2
        else:  # 41-45
            if amh > 1.5:    amh_pts = 18
            elif amh >= 0.7: amh_pts = 12
            elif amh >= 0.3: amh_pts = 7
            else:             amh_pts = 2
        amh_detail = f"AMH {amh} ng/mL (age {age}) → {amh_pts}/20 raw pts"

    # AFC scoring
    afc_pts = 10
    afc_detail = "AFC: not provided (default 10 pts)"
    if afc is not None:
        if afc > 20:    afc_pts = 20
        elif afc >= 12: afc_pts = 20
        elif afc >= 8:  afc_pts = 17
        elif afc >= 5:  afc_pts = 12
        elif afc >= 3:  afc_pts = 7
        else:           afc_pts = 3
        afc_detail = f"AFC {afc} follicles → {afc_pts}/20 raw pts"

    # FSH scoring
    fsh_pts = 10
    fsh_detail = "FSH Day 3: not provided (default 10 pts)"
    if fsh is not None:
        if fsh < 8:     fsh_pts = 20
        elif fsh <= 10: fsh_pts = 20
        elif fsh <= 12: fsh_pts = 14  # Fair
        elif fsh <= 15: fsh_pts = 7   # Diminished
        else:           fsh_pts = 3   # Very low
        fsh_detail = f"FSH Day3 {fsh} mIU/mL → {fsh_pts}/20 raw pts"

    details = f"{amh_detail} | {afc_detail} | {fsh_detail}"
    return amh_pts, afc_pts, fsh_pts, details


def _menstrual_score(f: FemaleData):
    days = f.cycle_length_days
    prog = f.progesterone_day21

    if days is None: days = 28

    if days < 25:
        base, pattern = 11, "Polymenorrhea (Short Luteal)"
    elif days <= 35:
        if prog is not None:
            if prog > 15:    base, pattern = 20, "Regular, Optimal Ovulation"
            elif prog >= 10: base, pattern = 18, "Regular, Good Ovulation"
            elif prog >= 5:  base, pattern = 13, "Regular, Possible Luteal Defect"
            else:            base, pattern = 8,  "Regular, No Ovulation Confirmed"
        else:
            base, pattern = 15, "Regular cycle (ovulation unconfirmed)"
    elif days <= 90:
        base, pattern = 7, "Oligomenorrhea (Sporadic)"
    else:
        base, pattern = 0, "Amenorrhea (>6 months)"

    mods = 0
    flow = f.flow_duration_days or 5
    if 3 <= flow <= 7:
        mods += 2
    if f.pain_level == "Minimal":
        mods += 2

    details = (f"Pattern: {pattern} | Cycle: {days} days | "
               f"Day21 Progesterone: {prog or 'N/A'} ng/mL | "
               f"Flow: {flow} days | Pain: {f.pain_level}")
    return base, mods, details


def _hormonal_balance_score(f: FemaleData):
    # TSH (max 5)
    tsh = f.tsh
    if tsh is None: tsh_pts, tsh_d = 3, "TSH: N/A (default 3)"
    elif 0.5 <= tsh <= 2.5: tsh_pts, tsh_d = 5, f"TSH {tsh} mIU/L → Optimal (5/5)"
    elif 2.5 < tsh <= 4.0:  tsh_pts, tsh_d = 3, f"TSH {tsh} mIU/L → Suboptimal (3/5)"
    else:                    tsh_pts, tsh_d = 0, f"TSH {tsh} mIU/L → Abnormal (0/5)"

    # Prolactin (max 5)
    prl = f.prolactin
    if prl is None: prl_pts, prl_d = 3, "Prolactin: N/A (default 3)"
    elif prl < 25:  prl_pts, prl_d = 5, f"Prolactin {prl} ng/mL → Optimal (5/5)"
    elif prl <= 50: prl_pts, prl_d = 3, f"Prolactin {prl} ng/mL → Suboptimal (3/5)"
    else:           prl_pts, prl_d = 0, f"Prolactin {prl} ng/mL → Abnormal (0/5)"

    # Estradiol Day 2-3 (max 3)
    e2 = f.estradiol_day2
    if e2 is None:            e2_pts, e2_d = 2, "Estradiol: N/A (default 2)"
    elif 30 <= e2 <= 80:      e2_pts, e2_d = 3, f"E2 {e2} pg/mL → Optimal (3/3)"
    elif 20 <= e2 < 30 or 80 < e2 <= 100: e2_pts, e2_d = 2, f"E2 {e2} pg/mL → Suboptimal (2/3)"
    else:                     e2_pts, e2_d = 0, f"E2 {e2} pg/mL → Abnormal (0/3)"

    # Total Testosterone (max 4) — female reference <50 ng/dL
    tt = f.total_testosterone
    if tt is None: tt_pts, tt_d = 2, "Testosterone: N/A (default 2)"
    elif tt < 40:  tt_pts, tt_d = 4, f"Testosterone {tt} ng/dL → Optimal (4/4)"
    elif tt <= 60: tt_pts, tt_d = 2, f"Testosterone {tt} ng/dL → Suboptimal (2/4)"
    else:          tt_pts, tt_d = 0, f"Testosterone {tt} ng/dL → Abnormal (0/4)"

    # LH/FSH Ratio (max 3)
    lh = f.lh
    fsh = f.fsh
    if lh and fsh and fsh > 0:
        ratio = lh / fsh
        if 1.0 <= ratio <= 1.5:   lhfsh_pts, lhfsh_d = 3, f"LH/FSH ratio {ratio:.2f} → Optimal (3/3)"
        elif 1.5 < ratio <= 2.5:  lhfsh_pts, lhfsh_d = 2, f"LH/FSH ratio {ratio:.2f} → Suboptimal (2/3)"
        else:                      lhfsh_pts, lhfsh_d = 0, f"LH/FSH ratio {ratio:.2f} → Abnormal (0/3)"
    else:
        lhfsh_pts, lhfsh_d = 2, "LH/FSH ratio: N/A (default 2)"

    details = f"{tsh_d} | {prl_d} | {e2_d} | {tt_d} | {lhfsh_d}"
    return tsh_pts, prl_pts, e2_pts, tt_pts, lhfsh_pts, details


def _structural_score(finding: str):
    score_map = {
        "Normal uterus, normal ovaries, both tubes patent": 15,
        "Small fibroids (<3cm, intramural)": 14,
        "Medium fibroids (3-5cm, intramural)": 12,
        "Large fibroids (>5cm) or multiple": 9,
        "Submucosal fibroid (in cavity)": 4,
        "Endometrial polyp": 11,
        "Thin endometrium (<7mm mid-cycle)": 10,
        "Adenomyosis (mild)": 11,
        "Adenomyosis (severe)": 7,
        "Ovarian cysts (functional)": 14,
        "Endometrioma (chocolate cyst <4cm)": 9,
        "Endometrioma (>4cm or bilateral)": 5,
        "Hydrosalpinx (unilateral)": 7,
        "Hydrosalpinx (bilateral)": 4,
        "One tube blocked, one patent": 10,
    }
    score = score_map.get(finding, 12)
    return score, f"Structural finding: '{finding}' → {score}/15 points"


def _clinical_conditions_score(f: FemaleData):
    pcos_map = {
        "None": 8, "A": 2, "B": 4, "C": 5, "D": 6
    }
    endo_map = {
        "None": 7, "1": 6, "2": 5, "3": 3, "4": 1
    }
    pcos_pts = pcos_map.get(f.pcos_phenotype, 8)
    endo_pts = endo_map.get(str(f.endometriosis_stage), 7)
    details = (f"PCOS phenotype: {f.pcos_phenotype} → {pcos_pts}/8 pts | "
               f"Endometriosis stage: {f.endometriosis_stage} → {endo_pts}/7 pts | "
               f"Combined: {pcos_pts + endo_pts}/15")
    return pcos_pts, endo_pts, details


def _semen_analysis_score(m: MaleData):
    # Concentration (0-12)
    conc = m.sperm_concentration
    if conc is None: conc_pts, conc_d = 8, "Concentration N/A (default 8)"
    elif conc >= 40:  conc_pts, conc_d = 12, f"Conc {conc}M/mL → Optimal (12)"
    elif conc >= 30:  conc_pts, conc_d = 11, f"Conc {conc}M/mL → Good (11)"
    elif conc >= 20:  conc_pts, conc_d = 9,  f"Conc {conc}M/mL → Adequate (9)"
    elif conc >= 16:  conc_pts, conc_d = 8,  f"Conc {conc}M/mL → WHO Threshold (8)"
    elif conc >= 10:  conc_pts, conc_d = 5,  f"Conc {conc}M/mL → Mild Oligo (5)"
    elif conc >= 5:   conc_pts, conc_d = 3,  f"Conc {conc}M/mL → Moderate Oligo (3)"
    elif conc >= 1:   conc_pts, conc_d = 1,  f"Conc {conc}M/mL → Severe Oligo (1)"
    elif conc > 0:    conc_pts, conc_d = 0.5, f"Conc {conc}M/mL → Crypto (0.5)"
    else:             conc_pts, conc_d = 0,   "Azoospermia → 0"

    # Progressive Motility (0-12)
    mot = m.progressive_motility
    if mot is None: motility_pts, mot_d = 7, "PR Motility N/A (default 7)"
    elif mot >= 60:  motility_pts, mot_d = 12, f"PR motility {mot}% → Optimal (12)"
    elif mot >= 50:  motility_pts, mot_d = 11, f"PR motility {mot}% → Good (11)"
    elif mot >= 40:  motility_pts, mot_d = 9,  f"PR motility {mot}% → Adequate (9)"
    elif mot >= 32:  motility_pts, mot_d = 8,  f"PR motility {mot}% → WHO Threshold (8)"
    elif mot >= 25:  motility_pts, mot_d = 6,  f"PR motility {mot}% → Mild Asthenospermia (6)"
    elif mot >= 15:  motility_pts, mot_d = 4,  f"PR motility {mot}% → Moderate Astheno (4)"
    elif mot >= 5:   motility_pts, mot_d = 2,  f"PR motility {mot}% → Severe Astheno (2)"
    else:            motility_pts, mot_d = 0,   f"PR motility {mot}% → No motility (0)"

    # Morphology (0-10)
    morph = m.morphology
    if morph is None:  morph_pts, morph_d = 6, "Morphology N/A (default 6)"
    elif morph >= 8:   morph_pts, morph_d = 10, f"Morphology {morph}% → Optimal (10)"
    elif morph >= 6:   morph_pts, morph_d = 9,  f"Morphology {morph}% → Good (9)"
    elif morph >= 4:   morph_pts, morph_d = 7,  f"Morphology {morph}% → WHO Normal (7)"
    elif morph >= 3:   morph_pts, morph_d = 5,  f"Morphology {morph}% → Mild Terato (5)"
    elif morph >= 2:   morph_pts, morph_d = 3,  f"Morphology {morph}% → Moderate Terato (3)"
    elif morph >= 1:   morph_pts, morph_d = 1,  f"Morphology {morph}% → Severe Terato (1)"
    else:              morph_pts, morph_d = 0.5, f"Morphology {morph}% → Very severe (0.5)"

    # Volume (0-6)
    vol = m.semen_volume
    if vol is None: vol_pts, vol_d = 5, "Volume N/A (default 5)"
    elif 2.0 <= vol <= 5.0: vol_pts, vol_d = 6, f"Volume {vol}mL → Optimal (6)"
    elif 1.5 <= vol < 2.0:  vol_pts, vol_d = 5, f"Volume {vol}mL → WHO Threshold (5)"
    elif 1.0 <= vol < 1.5:  vol_pts, vol_d = 3, f"Volume {vol}mL → Low volume (3)"
    elif vol < 1.0:          vol_pts, vol_d = 1, f"Volume {vol}mL → Very low (1)"
    else:                    vol_pts, vol_d = 4, f"Volume {vol}mL → High (dilution effect) (4)"

    details = f"{conc_d} | {mot_d} | {morph_d} | {vol_d}"
    return conc_pts, motility_pts, morph_pts, vol_pts, details


def _male_hormonal_score(m: MaleData):
    tt = m.total_testosterone
    if tt is None: tt_pts, tt_d = 5, "Total T: N/A (default 5)"
    elif 400 <= tt <= 900: tt_pts, tt_d = 8, f"Total T {tt} ng/dL → Optimal (8)"
    elif 300 <= tt < 400:  tt_pts, tt_d = 5, f"Total T {tt} ng/dL → Suboptimal (5)"
    else:                   tt_pts, tt_d = 0, f"Total T {tt} ng/dL → Abnormal (0)"

    ft = m.free_testosterone
    if ft is None: ft_pts, ft_d = 3, "Free T: N/A (default 3)"
    elif 12 <= ft <= 25: ft_pts, ft_d = 6, f"Free T {ft} ng/dL → Optimal (6)"
    elif 9 <= ft < 12:   ft_pts, ft_d = 4, f"Free T {ft} ng/dL → Suboptimal (4)"
    else:                 ft_pts, ft_d = 0, f"Free T {ft} ng/dL → Abnormal (0)"

    fsh = m.fsh
    if fsh is None:      fsh_pts, fsh_d = 2, "FSH: N/A (default 2)"
    elif 1.5 <= fsh <= 8:  fsh_pts, fsh_d = 3, f"FSH {fsh} mIU/mL → Normal (3)"
    elif 8 < fsh <= 12:    fsh_pts, fsh_d = 2, f"FSH {fsh} mIU/mL → Suboptimal (2)"
    else:                   fsh_pts, fsh_d = 0, f"FSH {fsh} mIU/mL → Abnormal (0)"

    lh = m.lh
    if lh is None:       lh_pts, lh_d = 2, "LH: N/A (default 2)"
    elif 1.7 <= lh <= 6:   lh_pts, lh_d = 3, f"LH {lh} mIU/mL → Normal (3)"
    elif 6 < lh <= 8.6:    lh_pts, lh_d = 2, f"LH {lh} mIU/mL → Suboptimal (2)"
    else:                   lh_pts, lh_d = 0, f"LH {lh} mIU/mL → Abnormal (0)"

    return tt_pts, ft_pts, fsh_pts, lh_pts, f"{tt_d} | {ft_d} | {fsh_d} | {lh_d}"


def _male_structural_score(m: MaleData):
    tv = m.testicular_volume
    if tv is None: tv_pts, tv_d = 6, "Testicular volume: N/A (default 6)"
    elif tv > 18:    tv_pts, tv_d = 8, f"Testicular volume {tv}mL → Excellent (8)"
    elif tv >= 15:   tv_pts, tv_d = 8, f"Testicular volume {tv}mL → Normal (8)"
    elif tv >= 12:   tv_pts, tv_d = 6, f"Testicular volume {tv}mL → Borderline (6)"
    elif tv >= 8:    tv_pts, tv_d = 3, f"Testicular volume {tv}mL → Small (3)"
    else:            tv_pts, tv_d = 1, f"Testicular volume {tv}mL → Very small (1)"

    varico = m.varicocele_grade
    varico_map = {
        "None": 7, "Subclinical": 6, "Grade1": 5, "Grade2": 3, "Grade3": 1
    }
    varico_pts = varico_map.get(varico, 7)
    varico_d = f"Varicocele: {varico} → {varico_pts}/7"

    return tv_pts, varico_pts, f"{tv_d} | {varico_d}"


def _dfi_score(dfi: Optional[float]):
    if dfi is None: return 12, "DFI: not provided (default 12/15)"
    if dfi < 15:   return 15, f"DFI {dfi}% → Excellent (<15%) (15/15)"
    if dfi <= 20:  return 12, f"DFI {dfi}% → Good (15-20%) (12/15)"
    if dfi <= 25:  return 9,  f"DFI {dfi}% → Fair (21-25%) (9/15)"
    if dfi <= 30:  return 5,  f"DFI {dfi}% → Poor (26-30%) (5/15)"
    return 2, f"DFI {dfi}% → Very Poor (>30%) (2/15)"


# ── MULTIPLIERS ──

def _female_bmi_multiplier(bmi):
    if bmi is None: return 1.0
    if bmi < 18.5: return 0.70
    if bmi <= 24.9: return 1.00
    if bmi <= 29.9: return 0.93
    if bmi <= 34.9: return 0.80
    if bmi <= 39.9: return 0.65
    return 0.50


def _male_bmi_multiplier(bmi):
    if bmi is None: return 1.0
    if bmi < 18.5: return 0.85
    if bmi <= 24.9: return 1.00
    if bmi <= 29.9: return 0.95
    if bmi <= 34.9: return 0.88
    return 0.75


def _alcohol_multiplier(units):
    if units == 0: return 1.00
    if units <= 7: return 0.97
    if units <= 14: return 0.90
    if units <= 21: return 0.80
    return 0.65


def _activity_multiplier(hours_per_week):
    if hours_per_week < 1: return 0.85
    if hours_per_week <= 5: return 1.00
    if hours_per_week <= 10: return 1.02
    return 0.90  # over-exercise


def _sleep_multiplier(hours):
    if 7 <= hours <= 9: return 1.00
    if 6 <= hours < 7 or 9 < hours <= 10: return 0.95
    return 0.85


def _stress_multiplier(level):
    return {"Low": 1.00, "Moderate": 0.95, "High": 0.85, "Severe": 0.70}.get(level, 0.95)


def _regional_multiplier(tier, pm25, air_purifier):
    base = {"Metro": 0.95, "Tier2": 0.97, "Tier3": 1.00, "Rural": 1.00}.get(tier, 0.95)
    pm_adj = 0
    if pm25 is not None:
        if pm25 < 35: pm_adj = 0.02
        elif pm25 <= 75: pm_adj = 0
        elif pm25 <= 115: pm_adj = -0.03
        elif pm25 <= 150: pm_adj = -0.06
        else: pm_adj = -0.10
    purifier_bonus = 0.03 if air_purifier else 0
    return round(base + pm_adj + purifier_bonus, 4)


def _occupational_multiplier(hazard):
    return {
        "None": 1.00, "Mild": 0.97,
        "Moderate": 0.90, "HeavyMetal": 0.85, "Radiation": 0.75
    }.get(hazard, 1.00)


def _coital_frequency_multiplier(pattern):
    return {
        "Optimal": 1.00, "Good": 0.85, "Moderate": 0.65,
        "Suboptimal": 0.40, "Random": 0.25, "Infrequent": 0.10, "None": 0.00
    }.get(pattern, 0.85)


def _tracking_multiplier(method):
    return {
        "LH_Strips": 1.00, "BBT": 0.95, "Cervical_Mucus": 0.92,
        "Calendar": 0.85, "App": 0.90, "None": 0.75
    }.get(method, 0.90)


def _cumulative_prob(mfr_pct, months):
    if mfr_pct <= 0:
        return 0.0
    r = mfr_pct / 100
    return round((1 - (1 - r) ** months) * 100, 1)


def _mfr_category(mfr):
    if mfr >= 20: return "Excellent (≥20%)"
    if mfr >= 15: return "Good (15-19%)"
    if mfr >= 10: return "Fair (10-14%)"
    if mfr >= 5:  return "Low (5-9%)"
    if mfr >= 2:  return "Very Low (2-4%)"
    return "Critical (<2%) — IVF pathway recommended"


def _generate_recommendation(category, mfr, f, m):
    if mfr <= 0:
        return "🚨 Absolute barrier detected. Immediate referral to Reproductive Endocrinologist for IVF/ICSI evaluation."
    if "Excellent" in category:
        return "✅ Excellent fertility potential. Continue natural conception attempts. Maintain healthy lifestyle. Reassess after 12 months if not pregnant."
    if "Good" in category:
        return "✅ Good fertility potential. Natural conception very likely within 6-12 months. Optimize ovulation tracking and coital timing."
    if "Fair" in category:
        return "⚠️ Fair fertility potential. Recommend fertility specialist consultation. Address correctable factors. IUI may be considered after 6 months."
    if "Low" in category:
        return "⚠️ Low fertility potential. Prompt fertility specialist referral. Comprehensive workup needed. Consider IUI/IVF based on factor severity."
    if "Very Low" in category:
        return "🔴 Very low fertility potential. Urgent specialist referral. IVF likely required. Address all modifiable factors simultaneously."
    return "🚨 Critical fertility potential. Immediate IVF referral. Do not delay treatment. Address all barriers urgently."
