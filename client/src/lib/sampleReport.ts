export const sampleReport = {
    overallScore: 87,
    categories: [
        {
            id: "genetic",
            title: "Genetic Compatibility",
            score: 23,
            maxScore: 25,
            status: "Good",
            color: "green",
            details: [
                { label: "Blood Group", value: "Compatible (A+ & O+)", status: "good" },
                { label: "Rh Factor", value: "Both Positive", status: "good" },
                { label: "Thalassemia", value: "Incomplete Screening", status: "warning" },
                { label: "G6PD", value: "Both Negative", status: "good" }
            ],
            summary: "Low risk of genetic disorders. Thalassemia screening recommended."
        },
        {
            id: "fertility",
            title: "Fertility Alignment",
            score: 19,
            maxScore: 25,
            status: "Moderate",
            color: "yellow",
            details: [
                { label: "AMH (Her)", value: "3.2 ng/mL (Good)", status: "good" },
                { label: "Sperm Count (Him)", value: "45M/mL (Normal)", status: "good" },
                { label: "Vitamin D", value: "Both Deficient", status: "warning" },
                { label: "TSH (Her)", value: "4.2 mIU/mL (Borderline)", status: "warning" }
            ],
            summary: "Good potential, but Vitamin D and Thyroid need attention."
        },
        {
            id: "chronic",
            title: "Chronic Health",
            score: 21,
            maxScore: 25,
            status: "Good",
            color: "green",
            details: [
                { label: "HbA1c", value: "Normal", status: "good" },
                { label: "Blood Pressure", value: "Normal", status: "good" }
            ],
            summary: "No major chronic conditions detected."
        },
        {
            id: "infection",
            title: "Infection Status",
            score: 10,
            maxScore: 10,
            status: "Excellent",
            color: "green",
            details: [
                { label: "HIV", value: "Negative", status: "good" },
                { label: "Hepatitis B/C", value: "Negative", status: "good" }
            ],
            summary: "All infection screens are clear."
        },
        {
            id: "mental",
            title: "Mental & Metabolic",
            score: 8,
            maxScore: 10,
            status: "Good",
            color: "green",
            details: [
                { label: "B12", value: "Normal", status: "good" },
                { label: "Stress Markers", value: "Low", status: "good" }
            ],
            summary: "Metabolic health is stable."
        },
        {
            id: "lifestyle",
            title: "Lifestyle",
            score: 6,
            maxScore: 5,
            status: "Excellent",
            color: "green",
            details: [
                { label: "Smoking", value: "Both Non-smokers", status: "good" },
                { label: "Activity", value: "Active", status: "good" }
            ],
            summary: "Compatible healthy lifestyles."
        }
    ]
};
