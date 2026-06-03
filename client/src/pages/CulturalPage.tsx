import React, { useState } from 'react';
import { Globe, Users, BookOpen } from 'lucide-react';
import { communityRisks } from '@/data/communityRisks';
import { ExpandableAccordion } from '@/components/ExpandableAccordion';
import { LanguageSelector } from '@/components/LanguageSelector';

const CulturalPage = () => {
    const [selectedCommunity, setSelectedCommunity] = useState<string>("Gujarati");

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <section className="bg-white pt-20 pb-16 border-b border-slate-200">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex justify-center mb-6">
                        <LanguageSelector />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                        Built for India's Diversity
                    </h1>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                        Every community has unique genetic traits. We understand yours.
                    </p>
                </div>
            </section>

            <section className="py-20 container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Select Your Community</h2>

                        <div className="flex flex-wrap gap-3 mb-8">
                            {Object.keys(communityRisks).map((comm) => (
                                <button
                                    key={comm}
                                    onClick={() => setSelectedCommunity(comm)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCommunity === comm
                                        ? "bg-primary text-white"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                        }`}
                                >
                                    {comm}
                                </button>
                            ))}
                        </div>

                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                            <h3 className="text-xl font-bold text-slate-900 mb-4">
                                Health Considerations for {selectedCommunity} Community
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="font-bold text-red-600 text-sm mb-2 flex items-center gap-2">
                                        <Users className="w-4 h-4" /> HIGHER PREVALENCE RISKS
                                    </h4>
                                    <ul className="list-disc list-inside text-slate-700 space-y-1">
                                        {communityRisks[selectedCommunity as keyof typeof communityRisks].risks.map((risk, i) => (
                                            <li key={i}>{risk}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="font-bold text-blue-600 text-sm mb-2 flex items-center gap-2">
                                        <BookOpen className="w-4 h-4" /> WHY IT MATTERS
                                    </h4>
                                    <p className="text-slate-700 text-sm">
                                        {communityRisks[selectedCommunity as keyof typeof communityRisks].why}
                                    </p>
                                </div>

                                <div className="bg-white p-4 rounded-lg border border-slate-200">
                                    <p className="text-sm text-slate-600 italic">
                                        "{communityRisks[selectedCommunity as keyof typeof communityRisks].note}"
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CulturalPage;
