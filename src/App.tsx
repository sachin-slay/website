import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import HowItWorksPage from "./pages/HowItWorksPage";
import ClinicalSafetyPage from "./pages/ClinicalSafetyPage";
import GrowthPage from "./pages/GrowthPage";
import CulturalPage from "./pages/CulturalPage";
import WhyItMattersPage from "./pages/WhyItMattersPage";
import SampleReportPage from "./pages/SampleReportPage";
import TrustPrivacyPage from "./pages/TrustPrivacyPage";
import LoginPage from "./pages/LoginPage";
import ContactPage from "./pages/ContactPage";
import QuestionnairePage from "./pages/QuestionnairePage";
import DashboardPage from "./pages/DashboardPage";
import AddProspectPage from "./pages/AddProspectPage";
import ReportsPage from "./pages/ReportsPage";
import ScoringMatrixPage from "./pages/ScoringMatrixPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <TooltipProvider>
            <Toaster />
            <AppProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Layout />}>
                            <Route index element={<HomePage />} />
                            <Route path="how-it-works" element={<HowItWorksPage />} />
                            <Route path="safety" element={<ClinicalSafetyPage />} />
                            <Route path="growth" element={<GrowthPage />} />
                            <Route path="cultural" element={<CulturalPage />} />
                            <Route path="why-it-matters" element={<WhyItMattersPage />} />
                            <Route path="sample-report" element={<SampleReportPage />} />
                            <Route path="trust" element={<TrustPrivacyPage />} />
                            <Route path="contact" element={<ContactPage />} />
                            <Route path="login" element={<LoginPage />} />
                            <Route path="questionnaire" element={<QuestionnairePage />} />
                            <Route path="dashboard" element={<DashboardPage />} />
                            <Route path="add-prospect" element={<AddProspectPage />} />
                            <Route path="reports" element={<ReportsPage />} />
                            <Route path="scoring-matrix" element={<ScoringMatrixPage />} />
                            <Route path="*" element={<NotFound />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </AppProvider>
        </TooltipProvider>
    </QueryClientProvider>
);

export default App;
