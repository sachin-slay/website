import React from 'react';
import { Shield, AlertTriangle, CheckCircle, Phone, FileText, UserCheck, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const ClinicalSafetyPage = () => {
    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* HERO */}
            <section className="bg-white pt-20 pb-16 border-b border-slate-200">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold mb-6">
                        <Shield className="w-4 h-4" /> Clinical Governance
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                        When AI Needs a Doctor<br />(And When You Do)
                    </h1>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                        How we handle uncertainty, high-risk findings, and medical complexity responsibly.
                    </p>
                </div>
            </section>

            {/* TRIAGE SYSTEM */}
            <section className="py-20 container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">
                        Not Everything Is Automatic. Here's When Humans Take Over.
                    </h2>
                </div>

                <div className="max-w-5xl mx-auto">
                    {/* Flowchart Visualization */}
                    <div className="flex flex-col items-center relative">
                        {/* Top Node */}
                        <div className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold shadow-lg z-10">
                            REPORT UPLOADED
                        </div>
                        <div className="h-12 w-0.5 bg-slate-300"></div>

                        {/* AI Node */}
                        <div className="bg-white border-2 border-primary text-primary px-8 py-4 rounded-xl font-bold shadow-md z-10 flex items-center gap-2">
                            <Activity className="w-5 h-5" /> AI ANALYSIS
                        </div>
                        <div className="h-12 w-0.5 bg-slate-300"></div>

                        {/* Decision Split */}
                        <div className="relative w-full max-w-2xl h-12">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-full bg-slate-300"></div>
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-300"></div>
                            <div className="absolute bottom-0 left-0 w-0.5 h-8 bg-slate-300 translate-y-full"></div>
                            <div className="absolute bottom-0 right-0 w-0.5 h-8 bg-slate-300 translate-y-full"></div>
                        </div>

                        {/* Outcomes */}
                        <div className="flex justify-between w-full max-w-3xl mt-8">
                            {/* Left: Auto */}
                            <div className="flex flex-col items-center w-1/2 px-4">
                                <div className="bg-green-50 border border-green-200 p-6 rounded-xl w-full text-center hover:shadow-lg transition-shadow">
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                                        <CheckCircle className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-bold text-green-800 mb-2">AUTO-APPROVED</h3>
                                    <p className="text-sm text-green-700 mb-4">95% of cases</p>
                                    <ul className="text-left text-xs text-slate-600 space-y-2">
                                        <li>✓ All values within normal ranges</li>
                                        <li>✓ No critical abnormalities</li>
                                        <li>✓ Standard compatibility</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Right: Doctor */}
                            <div className="flex flex-col items-center w-1/2 px-4">
                                <div className="bg-red-50 border border-red-200 p-6 rounded-xl w-full text-center hover:shadow-lg transition-shadow">
                                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                                        <UserCheck className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-bold text-red-800 mb-2">DOCTOR REVIEW</h3>
                                    <p className="text-sm text-red-700 mb-4">5% of cases</p>
                                    <ul className="text-left text-xs text-slate-600 space-y-2">
                                        <li>⚠️ Any critical value</li>
                                        <li>⚠️ STD positive result</li>
                                        <li>⚠️ Severe anemia / HbA1c</li>
                                        <li>⚠️ Conflicting data</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CRITICAL PROTOCOL */}
            <section className="py-20 bg-white border-t border-slate-200">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
                        <div>
                            <div className="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-bold mb-4">
                                SAFETY PROTOCOL
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-6">
                                Critical Finding Protocol
                            </h2>
                            <p className="text-slate-600 mb-8">
                                If we find something serious (like HIV+ or severe organ dysfunction), we don't just send a PDF. We pause everything and call you.
                            </p>

                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 shrink-0">1</div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">Report Generation Paused</h4>
                                        <p className="text-sm text-slate-500">System holds delivery to prevent panic.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 shrink-0">2</div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">Doctor Review (30 mins)</h4>
                                        <p className="text-sm text-slate-500">Specialist verifies the finding manually.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 shrink-0">3</div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">Phone Call (Not Notification)</h4>
                                        <p className="text-sm text-slate-500">Our doctor calls you directly to explain with empathy.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Phone size={120} />
                            </div>
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <Phone className="w-5 h-5 text-green-400" /> Example Script
                            </h3>
                            <div className="space-y-4 text-slate-300 italic text-sm leading-relaxed">
                                <p>"Hello [Name], this is Dr. Meera from PremaritalHealth. I'm calling because we found something in your reports that needs immediate attention. Do you have privacy to talk?"</p>
                                <p>"Your Hepatitis B test came back positive. I want you to know: 1) This is manageable, 2) Many live normal lives with this, and 3) We need to get you to a hepatologist quickly."</p>
                                <p>"I'm here to answer all your questions and help you decide how to tell your partner."</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* DISCLAIMERS */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="bg-yellow-50 border border-yellow-200 p-8 rounded-xl">
                        <div className="flex items-start gap-4">
                            <AlertTriangle className="w-8 h-8 text-yellow-600 shrink-0" />
                            <div>
                                <h3 className="text-xl font-bold text-yellow-900 mb-2">What We Are Not</h3>
                                <div className="grid md:grid-cols-2 gap-4 mt-4">
                                    <ul className="space-y-2 text-sm text-yellow-800">
                                        <li className="flex items-center gap-2"><span className="text-red-500">✗</span> Not a diagnostic service</li>
                                        <li className="flex items-center gap-2"><span className="text-red-500">✗</span> Not a treatment provider</li>
                                        <li className="flex items-center gap-2"><span className="text-red-500">✗</span> Not a replacement for doctors</li>
                                    </ul>
                                    <ul className="space-y-2 text-sm text-yellow-800">
                                        <li className="flex items-center gap-2"><span className="text-green-600">✓</span> Screening & risk assessment</li>
                                        <li className="flex items-center gap-2"><span className="text-green-600">✓</span> Early detection system</li>
                                        <li className="flex items-center gap-2"><span className="text-green-600">✓</span> Action guide generator</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ClinicalSafetyPage;
