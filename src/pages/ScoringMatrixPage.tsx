import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ScoringMatrixPage = () => {
    const navigate = useNavigate();

    return (
        <div className="py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-slate-200/50 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6 text-slate-700" />
                    </button>
                    <div>
                        <h1 className="text-4xl md:text-5xl font-script text-slate-900">Comprehensive 360° Health Scoring Matrix</h1>
                        <p className="text-slate-600">Structured Format for Implementation | Total Score: 0-1100 Points</p>
                    </div>
                </div>

                <Tabs defaultValue="demographics" className="w-full space-y-6">
                    <TabsList className="w-full justify-start h-auto flex-wrap gap-2 bg-transparent p-0">
                        <TabsTrigger value="demographics" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white bg-white border border-slate-200 px-4 py-2 h-auto">Demographics (100)</TabsTrigger>
                        <TabsTrigger value="lifestyle" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white bg-white border border-slate-200 px-4 py-2 h-auto">Lifestyle (200)</TabsTrigger>
                        <TabsTrigger value="genetic" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white bg-white border border-slate-200 px-4 py-2 h-auto">Genetic (100)</TabsTrigger>
                        <TabsTrigger value="cancer" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white bg-white border border-slate-200 px-4 py-2 h-auto">Cancer Biomarkers (100)</TabsTrigger>
                        <TabsTrigger value="organ" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white bg-white border border-slate-200 px-4 py-2 h-auto">Organ Systems (250)</TabsTrigger>
                        <TabsTrigger value="fertility" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white bg-white border border-slate-200 px-4 py-2 h-auto">Fertility & Repro (100)</TabsTrigger>
                        <TabsTrigger value="chronic" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white bg-white border border-slate-200 px-4 py-2 h-auto">Chronic Disease (150)</TabsTrigger>
                        <TabsTrigger value="quality" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white bg-white border border-slate-200 px-4 py-2 h-auto">Quality Care (100)</TabsTrigger>
                    </TabsList>

                    {/* Domain 1: Demographics */}
                    <TabsContent value="demographics" className="space-y-6">
                        <Card>
                            <CardHeader className="bg-purple-50 border-b border-purple-100">
                                <CardTitle className="text-purple-900">Domain 1: Demographic Foundation</CardTitle>
                                <CardDescription className="text-purple-700 font-semibold">Maximum Score: 100 points</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 space-y-8">
                                <section>
                                    <h3 className="text-lg font-bold text-slate-900 border-l-4 border-purple-600 pl-3 mb-4">Age Score (Max: 50 points)</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-purple-600 text-white">
                                                <tr>
                                                    <th className="p-3 rounded-tl-lg">Age Range</th>
                                                    <th className="p-3">Score Range</th>
                                                    <th className="p-3">Parameters</th>
                                                    <th className="p-3 rounded-tr-lg">Calculation Formula</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                <tr className="bg-white">
                                                    <td className="p-3 font-medium">20-30 years</td>
                                                    <td className="p-3 text-purple-600 font-bold">48-50</td>
                                                    <td className="p-3">Peak health, minimal age-related decline</td>
                                                    <td className="p-3 font-mono text-xs">50 × (1 - [(Age - 20)/65]^1.3)</td>
                                                </tr>
                                                <tr className="bg-slate-50">
                                                    <td className="p-3 font-medium">31-45 years</td>
                                                    <td className="p-3 text-purple-600 font-bold">42-47</td>
                                                    <td className="p-3">Early middle age, maintenance phase</td>
                                                    <td className="p-3 font-mono text-xs">50 × (1 - [(Age - 20)/65]^1.3)</td>
                                                </tr>
                                                <tr className="bg-white">
                                                    <td className="p-3 font-medium">46-60 years</td>
                                                    <td className="p-3 text-purple-600 font-bold">32-41</td>
                                                    <td className="p-3">Accelerated aging begins</td>
                                                    <td className="p-3 font-mono text-xs">50 × (1 - [(Age - 20)/65]^1.3)</td>
                                                </tr>
                                                <tr className="bg-slate-50">
                                                    <td className="p-3 font-medium">61-75 years</td>
                                                    <td className="p-3 text-purple-600 font-bold">18-31</td>
                                                    <td className="p-3">Significant age-related changes</td>
                                                    <td className="p-3 font-mono text-xs">50 × (1 - [(Age - 20)/65]^1.3)</td>
                                                </tr>
                                                <tr className="bg-white">
                                                    <td className="p-3 font-medium">76+ years</td>
                                                    <td className="p-3 text-purple-600 font-bold">0-17</td>
                                                    <td className="p-3">Advanced age considerations</td>
                                                    <td className="p-3 font-mono text-xs">50 × (1 - [(Age - 20)/65]^1.3)</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-lg font-bold text-slate-900 border-l-4 border-purple-600 pl-3 mb-4">Gender Score (Max: 25 points)</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-purple-600 text-white">
                                                <tr>
                                                    <th className="p-3 rounded-tl-lg">Gender</th>
                                                    <th className="p-3">Base Score</th>
                                                    <th className="p-3">Age Modifier</th>
                                                    <th className="p-3 rounded-tr-lg">Final Score Range</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                <tr className="bg-white">
                                                    <td className="p-3 font-medium">Female (18-45)</td>
                                                    <td className="p-3 text-purple-600 font-bold">25</td>
                                                    <td className="p-3">-3 (maternal health considerations)</td>
                                                    <td className="p-3 font-bold">22</td>
                                                </tr>
                                                <tr className="bg-slate-50">
                                                    <td className="p-3 font-medium">Female (45-55)</td>
                                                    <td className="p-3 text-purple-600 font-bold">25</td>
                                                    <td className="p-3">-5 (perimenopausal transition)</td>
                                                    <td className="p-3 font-bold">20</td>
                                                </tr>
                                                <tr className="bg-white">
                                                    <td className="p-3 font-medium">Female (55+)</td>
                                                    <td className="p-3 text-purple-600 font-bold">25</td>
                                                    <td className="p-3">No modifier</td>
                                                    <td className="p-3 font-bold">25</td>
                                                </tr>
                                                <tr className="bg-slate-50">
                                                    <td className="p-3 font-medium">Male (All Ages)</td>
                                                    <td className="p-3 text-purple-600 font-bold">25</td>
                                                    <td className="p-3">No modifier</td>
                                                    <td className="p-3 font-bold">25</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-lg font-bold text-slate-900 border-l-4 border-purple-600 pl-3 mb-4">Family History (Max: 25 points)</h3>
                                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                        <ul className="space-y-2 text-sm text-slate-700">
                                            <li className="flex justify-between items-center bg-white p-3 rounded border border-slate-100">
                                                <span>No significant family history</span>
                                                <span className="font-bold text-green-600">25 pts</span>
                                            </li>
                                            <li className="flex justify-between items-center bg-white p-3 rounded border border-slate-100">
                                                <span>1 immediate relative with chronic disease (onset &gt;60)</span>
                                                <span className="font-bold text-yellow-600">20 pts</span>
                                            </li>
                                            <li className="flex justify-between items-center bg-white p-3 rounded border border-slate-100">
                                                <span>1 immediate relative with chronic disease (onset &lt;60)</span>
                                                <span className="font-bold text-orange-600">15 pts</span>
                                            </li>
                                            <li className="flex justify-between items-center bg-white p-3 rounded border border-slate-100">
                                                <span>2+ relatives with same chronic disease</span>
                                                <span className="font-bold text-red-600">5-10 pts</span>
                                            </li>
                                        </ul>
                                    </div>
                                </section>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Domain 2: Lifestyle */}
                    <TabsContent value="lifestyle" className="space-y-6">
                        <Card>
                            <CardHeader className="bg-purple-50 border-b border-purple-100">
                                <CardTitle className="text-purple-900">Domain 2: Lifestyle & Environmental</CardTitle>
                                <CardDescription className="text-purple-700 font-semibold">Maximum Score: 200 points</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 space-y-8">
                                <section>
                                    <h3 className="text-lg font-bold text-slate-900 border-l-4 border-purple-600 pl-3 mb-4">BMI & Body Composition (Max: 50 points)</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-purple-600 text-white">
                                                <tr>
                                                    <th className="p-3 rounded-tl-lg">Metric</th>
                                                    <th className="p-3">Optimal Range (Max Score)</th>
                                                    <th className="p-3">Moderate Risk</th>
                                                    <th className="p-3 rounded-tr-lg">High Risk (Min Score)</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                <tr className="bg-white">
                                                    <td className="p-3 font-medium">BMI</td>
                                                    <td className="p-3">18.5 - 22.9 (25 pts)</td>
                                                    <td className="p-3">23-24.9 or &lt;18.5 (15 pts)</td>
                                                    <td className="p-3">&ge;25 (0-10 pts)</td>
                                                </tr>
                                                <tr className="bg-slate-50">
                                                    <td className="p-3 font-medium">Waist Circumference</td>
                                                    <td className="p-3">M &lt;90cm, F &lt;80cm (15 pts)</td>
                                                    <td className="p-3">M 90-100, F 80-90 (10 pts)</td>
                                                    <td className="p-3">M &gt;100, F &gt;90 (0 pts)</td>
                                                </tr>
                                                <tr className="bg-white">
                                                    <td className="p-3 font-medium">WHR</td>
                                                    <td className="p-3">M &lt;0.9, F &lt;0.85 (10 pts)</td>
                                                    <td className="p-3">Borderline (5 pts)</td>
                                                    <td className="p-3">High (0 pts)</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-lg font-bold text-slate-900 border-l-4 border-purple-600 pl-3 mb-4">Physical Activity (Max: 40 points)</h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                                            <h4 className="font-bold text-green-800 mb-2">Aerobic (20 pts)</h4>
                                            <p className="text-sm text-green-700">150+ min/week moderate or 75+ min vigorous</p>
                                        </div>
                                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                            <h4 className="font-bold text-blue-800 mb-2">Strength (20 pts)</h4>
                                            <p className="text-sm text-blue-700">2+ days/week involving major muscle groups</p>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-lg font-bold text-slate-900 border-l-4 border-purple-600 pl-3 mb-4">Diet & Nutrition (Max: 40 points)</h3>
                                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                            <div className="flex justify-between p-2 bg-white rounded shadow-sm">
                                                <span>Fruits/Veg (5 servings/day)</span>
                                                <span className="font-bold text-purple-600">10 pts</span>
                                            </div>
                                            <div className="flex justify-between p-2 bg-white rounded shadow-sm">
                                                <span>Whole Grains (3 servings/day)</span>
                                                <span className="font-bold text-purple-600">10 pts</span>
                                            </div>
                                            <div className="flex justify-between p-2 bg-white rounded shadow-sm">
                                                <span>Protein Adequacy</span>
                                                <span className="font-bold text-purple-600">10 pts</span>
                                            </div>
                                            <div className="flex justify-between p-2 bg-white rounded shadow-sm">
                                                <span>Low Sugar/Processed</span>
                                                <span className="font-bold text-purple-600">10 pts</span>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-lg font-bold text-slate-900 border-l-4 border-purple-600 pl-3 mb-4">Substance Use (Max: 35 points)</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-purple-600 text-white">
                                                <tr>
                                                    <th className="p-3 rounded-tl-lg">Substance</th>
                                                    <th className="p-3">Usage Level</th>
                                                    <th className="p-3">Score</th>
                                                    <th className="p-3 rounded-tr-lg">Notes</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                <tr className="bg-white">
                                                    <td className="p-3 font-medium">Tobacco - Never</td>
                                                    <td className="p-3">Never used</td>
                                                    <td className="p-3 font-bold text-green-600">20</td>
                                                    <td className="p-3">Baseline excellent</td>
                                                </tr>
                                                <tr className="bg-slate-50">
                                                    <td className="p-3 font-medium">Tobacco - Current</td>
                                                    <td className="p-3">Any usage</td>
                                                    <td className="p-3 font-bold text-red-600">0-5</td>
                                                    <td className="p-3">Significant risk</td>
                                                </tr>
                                                <tr className="bg-white">
                                                    <td className="p-3 font-medium">Alcohol - Mod/None</td>
                                                    <td className="p-3">Within limits</td>
                                                    <td className="p-3 font-bold text-green-600">15</td>
                                                    <td className="p-3">Safe limits</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </section>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Domain 3: Genetic */}
                    <TabsContent value="genetic" className="space-y-6">
                        <Card>
                            <CardHeader className="bg-purple-50 border-b border-purple-100">
                                <CardTitle className="text-purple-900">Domain 3: Genetic Risk Assessment</CardTitle>
                                <CardDescription className="text-purple-700 font-semibold">Maximum Score: 100 points</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 space-y-8">
                                <section>
                                    <h3 className="text-lg font-bold text-slate-900 border-l-4 border-purple-600 pl-3 mb-4">Genomic Risk Distribution</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-purple-600 text-white">
                                                <tr>
                                                    <th className="p-3 rounded-tl-lg">Risk Category</th>
                                                    <th className="p-3">Cardio (25)</th>
                                                    <th className="p-3">Metabolic (20)</th>
                                                    <th className="p-3">Cancer (25)</th>
                                                    <th className="p-3">Neuro (15)</th>
                                                    <th className="p-3 rounded-tr-lg">Autoimmune (15)</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                <tr className="bg-white">
                                                    <td className="p-3 font-medium">Very Low Risk (Top 10%)</td>
                                                    <td className="p-3">25</td>
                                                    <td className="p-3">20</td>
                                                    <td className="p-3">25</td>
                                                    <td className="p-3">15</td>
                                                    <td className="p-3">15</td>
                                                </tr>
                                                <tr className="bg-slate-50">
                                                    <td className="p-3 font-medium">Low Risk (10-30%)</td>
                                                    <td className="p-3">22</td>
                                                    <td className="p-3">17</td>
                                                    <td className="p-3">22</td>
                                                    <td className="p-3">13</td>
                                                    <td className="p-3">13</td>
                                                </tr>
                                                <tr className="bg-white">
                                                    <td className="p-3 font-medium">Average Risk (30-70%)</td>
                                                    <td className="p-3">18</td>
                                                    <td className="p-3">14</td>
                                                    <td className="p-3">18</td>
                                                    <td className="p-3">10</td>
                                                    <td className="p-3">10</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </section>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Domain 4: Cancer Biomarkers */}
                    <TabsContent value="cancer" className="space-y-6">
                        <Card>
                            <CardHeader className="bg-purple-50 border-b border-purple-100">
                                <CardTitle className="text-purple-900">Domain 4: Cancer Biomarkers & Screening</CardTitle>
                                <CardDescription className="text-purple-700 font-semibold">Maximum Score: 100 points</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 space-y-8">
                                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <Info className="h-5 w-5 text-yellow-400" />
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-yellow-700">
                                                This section evaluates risk based on standard tumor markers and screening adherence.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <section>
                                    <h3 className="text-lg font-bold text-slate-900 border-l-4 border-purple-600 pl-3 mb-4">Tumor Markers (Max: 50 points)</h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="p-4 border border-slate-200 rounded-lg">
                                            <h4 className="font-bold mb-2">PSA (Prostate) - Men</h4>
                                            <p className="text-sm text-slate-600">&lt; 4.0 ng/mL: 10 pts</p>
                                        </div>
                                        <div className="p-4 border border-slate-200 rounded-lg">
                                            <h4 className="font-bold mb-2">CA-125 (Ovarian) - Women</h4>
                                            <p className="text-sm text-slate-600">&lt; 35 U/mL: 10 pts</p>
                                        </div>
                                        <div className="p-4 border border-slate-200 rounded-lg">
                                            <h4 className="font-bold mb-2">CEA (General)</h4>
                                            <p className="text-sm text-slate-600">&lt; 2.5 ng/mL: 10 pts</p>
                                        </div>
                                        <div className="p-4 border border-slate-200 rounded-lg">
                                            <h4 className="font-bold mb-2">AFP (Liver)</h4>
                                            <p className="text-sm text-slate-600">&lt; 10 ng/mL: 10 pts</p>
                                        </div>
                                    </div>
                                </section>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Domain 5: Organ Systems */}
                    <TabsContent value="organ" className="space-y-6">
                        <Card>
                            <CardHeader className="bg-purple-50 border-b border-purple-100">
                                <CardTitle className="text-purple-900">Domain 5: Organ Systems Health</CardTitle>
                                <CardDescription className="text-purple-700 font-semibold">Maximum Score: 250 points</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 space-y-8">
                                <section>
                                    <h3 className="text-lg font-bold text-slate-900 border-l-4 border-purple-600 pl-3 mb-4">Cardiovascular System (Max: 60 points)</h3>
                                    <ul className="space-y-2 text-sm text-slate-700">
                                        <li className="flex justify-between p-2 bg-slate-50 rounded"><span>Blood Pressure &lt; 120/80</span> <span className="font-bold">20 pts</span></li>
                                        <li className="flex justify-between p-2 bg-slate-50 rounded"><span>Resting Heart Rate 60-75</span> <span className="font-bold">20 pts</span></li>
                                        <li className="flex justify-between p-2 bg-slate-50 rounded"><span>ECG Normal Sinus Rhythm</span> <span className="font-bold">20 pts</span></li>
                                    </ul>
                                </section>
                                <section>
                                    <h3 className="text-lg font-bold text-slate-900 border-l-4 border-purple-600 pl-3 mb-4">Metabolic Health (Max: 60 points)</h3>
                                    <ul className="space-y-2 text-sm text-slate-700">
                                        <li className="flex justify-between p-2 bg-slate-50 rounded"><span>HbA1c &lt; 5.7%</span> <span className="font-bold">20 pts</span></li>
                                        <li className="flex justify-between p-2 bg-slate-50 rounded"><span>Fasting Glucose &lt; 100 mg/dL</span> <span className="font-bold">20 pts</span></li>
                                        <li className="flex justify-between p-2 bg-slate-50 rounded"><span>Lipid Profile Optimal</span> <span className="font-bold">20 pts</span></li>
                                    </ul>
                                </section>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Domain 6: Fertility */}
                    <TabsContent value="fertility" className="space-y-6">
                        <Card>
                            <CardHeader className="bg-purple-50 border-b border-purple-100">
                                <CardTitle className="text-purple-900">Domain 6: Fertility & Reproductive Health</CardTitle>
                                <CardDescription className="text-purple-700 font-semibold">Maximum Score: 100 points</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 space-y-8">
                                <section>
                                    <h3 className="text-lg font-bold text-slate-900 border-l-4 border-purple-600 pl-3 mb-4">Hormonal Profile (Max: 50 points)</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-purple-600 text-white">
                                                <tr>
                                                    <th className="p-3 rounded-tl-lg">Marker</th>
                                                    <th className="p-3">Optimal Range</th>
                                                    <th className="p-3 rounded-tr-lg">Score</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                <tr className="bg-white">
                                                    <td className="p-3 font-medium">AMH (Anti-Mullerian Hormone)</td>
                                                    <td className="p-3">2.0 - 4.0 ng/mL</td>
                                                    <td className="p-3 font-bold">20</td>
                                                </tr>
                                                <tr className="bg-slate-50">
                                                    <td className="p-3 font-medium">Testosterone (Total)</td>
                                                    <td className="p-3">Normal Range for Age</td>
                                                    <td className="p-3 font-bold">15</td>
                                                </tr>
                                                <tr className="bg-white">
                                                    <td className="p-3 font-medium">TSH (Thyroid)</td>
                                                    <td className="p-3">0.4 - 4.0 mIU/L</td>
                                                    <td className="p-3 font-bold">15</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </section>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Domain 7: Chronic Disease */}
                    <TabsContent value="chronic" className="space-y-6">
                        <Card>
                            <CardHeader className="bg-purple-50 border-b border-purple-100">
                                <CardTitle className="text-purple-900">Domain 7: Chronic Disease Management</CardTitle>
                                <CardDescription className="text-purple-700 font-semibold">Maximum Score: 150 points</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 space-y-8">
                                <p className="text-slate-600">Evaluation of existing chronic conditions and their management status.</p>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="p-4 bg-green-50 border border-green-100 rounded-lg text-center">
                                        <h4 className="font-bold text-green-800 text-lg">No Chronic Disease</h4>
                                        <p className="text-2xl font-bold text-green-600 mt-2">150 pts</p>
                                    </div>
                                    <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-lg text-center">
                                        <h4 className="font-bold text-yellow-800 text-lg">Well Controlled</h4>
                                        <p className="text-2xl font-bold text-yellow-600 mt-2">100 pts</p>
                                    </div>
                                    <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-center">
                                        <h4 className="font-bold text-red-800 text-lg">Uncontrolled</h4>
                                        <p className="text-2xl font-bold text-red-600 mt-2">0-50 pts</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Domain 8: Quality Care */}
                    <TabsContent value="quality" className="space-y-6">
                        <Card>
                            <CardHeader className="bg-purple-50 border-b border-purple-100">
                                <CardTitle className="text-purple-900">Domain 8: Quality of Care & Prevention</CardTitle>
                                <CardDescription className="text-purple-700 font-semibold">Maximum Score: 100 points</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 space-y-8">
                                <section>
                                    <h3 className="text-lg font-bold text-slate-900 border-l-4 border-purple-600 pl-3 mb-4">Preventive Care Adherence (Max: 50 points)</h3>
                                    <ul className="space-y-2 text-sm text-slate-700">
                                        <li className="flex justify-between p-2 bg-slate-50 rounded"><span>Annual Health Checkup</span> <span className="font-bold">20 pts</span></li>
                                        <li className="flex justify-between p-2 bg-slate-50 rounded"><span>Dental Checkup (Annual)</span> <span className="font-bold">15 pts</span></li>
                                        <li className="flex justify-between p-2 bg-slate-50 rounded"><span>Eye Exam (Annual)</span> <span className="font-bold">15 pts</span></li>
                                    </ul>
                                </section>
                                <section>
                                    <h3 className="text-lg font-bold text-slate-900 border-l-4 border-purple-600 pl-3 mb-4">Vaccination Status (Max: 50 points)</h3>
                                    <ul className="space-y-2 text-sm text-slate-700">
                                        <li className="flex justify-between p-2 bg-slate-50 rounded"><span>Up to date with adult vaccines</span> <span className="font-bold">50 pts</span></li>
                                        <li className="flex justify-between p-2 bg-slate-50 rounded"><span>Partially vaccinated</span> <span className="font-bold">25 pts</span></li>
                                    </ul>
                                </section>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default ScoringMatrixPage;
