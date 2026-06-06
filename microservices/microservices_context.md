# Microservices Context: Slay Health (website/microservices)

This document provides a detailed reference to the backend FastAPI Microservice architecture, which acts as the Clinical Scoring Engine and the Interpretability core.

---

## 🏗️ Architecture

The scoring microservice is an independent, stateless FastAPI application running on Python 3 (typically on port 8000). It exposes endpoints that receive diagnostic reports (PDF format) alongside clinical parameter overrides, processes the documents using OCR, extracts entities using LLMs, applies rule-based logic to compute biological scores, and returns interpreted analysis back to the caller.

### 1. File Upload and Extraction
- Exposes `POST /analyze` and `POST /analyze_and_interpret` (and streaming variants).
- Receives multi-part form data containing PDF reports (female and male) alongside many manual text-field parameters.
- Uses memory-based storage for processing.
- Leverages OCR and LLM-based structured extraction via Groq.

### 2. Rule Engine and Scoring
- The clinical scoring engine evaluates parameters like hormonal balance, semen quality, biological age constraints, and structural anomalies (e.g. Endometriosis, PCOS, Varicocele).
- **Female Score**: Derived from metrics like AMH, FSH, AFC, cycle length, and structural components.
- **Male Score**: Derived from concentration, motility, morphology, and DNA Fragmentation Index (DFI).
- **Absolute Barriers**: Checks for factors like bilateral tubal blocks or azoospermia which set the Monthly Fecundability Rate (MFR) to 0.
- Calculates an overall MFR percentage and a 12-month probability metric based on these biological limits.

### 3. LLM Interpretation (Stage 2)
- Uses advanced LLM inference (e.g. via OpenRouter / LLaMA 3) to generate human-readable medical summaries, warnings, actionable insights, and missing tests.
- Results are parsed into structured JSON and returned to the frontend orchestration layer.

---

## 🔗 Integration with Main Application

1. **Express Server Proxy**: The Node.js Express server acts as a middleware gateway for the React frontend, handling session-based authentication (Supabase JWT). 
2. **Form Data Passthrough**: The Express server intercepts `POST /api/matches/:id/analyze`, injects the files and configuration parameters into a `FormData` object, and issues a request to the FastAPI instance (`http://localhost:8000/analyze_and_interpret`).
3. **Database Sink**: Once FastAPI responds with the scoring JSON, the Express server parses the combined score, updates the `Match` record in PostgreSQL via Prisma, and saves the full raw payload into the `AnalysisResult` table for audit histories.

---

## 📁 Key Components

* `app.py`: Streamlit demonstration UI, useful for testing the logic in an interactive dashboard locally.
* `scoring_engine.py`: Defines the class schema for inputs, penalties, barrier logic, and the score evaluation criteria.
* `llm_extraction.py`: Handles the interface with external APIs like Groq to extract structured health data from messy lab reports.
* FastAPI Endpoints: Found in the entry `main` server router, receiving requests from port 8000.
