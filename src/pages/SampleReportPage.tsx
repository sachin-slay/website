import React from 'react';
import { Download, Share2, Printer } from 'lucide-react';
import { ScoreGauge } from '@/components/ScoreGauge';
import { ExpandableAccordion } from '@/components/ExpandableAccordion';
import { sampleReport } from '@/data/sampleReport';
import { cn } from '@/lib/utils';

const SampleReportPage = () => {
    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <section className="bg-white pt-20 pb-8 border-b border-slate-200">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">Sample Compatibility Report</h1>
                            <p className="text-slate-600">This is exactly what you'll receive after screening.</p>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-sm font-medium">
                                <Share2 className="w-4 h-4" /> Share
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm font-medium shadow-sm">
                                <Download className="w-4 h-4" /> Download PDF
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    {/* Header */}
                    <div className="bg-slate-900 text-white p-8">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-bold mb-1">Couple Compatibility Analysis</h2>
                                <p className="text-slate-400 text-sm">Report ID: #SMPL-8829 • Date: Nov 24, 2025</p>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-slate-400">Overall Score</div>
                                <div className="text-4xl font-bold text-green-400">{sampleReport.overallScore}/100</div>
                            </div>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="p-8 border-b border-slate-100">
                        <div className="flex flex-col md:flex-row gap-8 items-center">
                            <div className="shrink-0">
                                <ScoreGauge score={sampleReport.overallScore} size={160} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">Executive Summary</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    Your overall compatibility is strong. Genetic risks are minimal, but attention is needed for Vitamin D levels and Thyroid function (Her). These are manageable with lifestyle changes and medication.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="p-8 bg-slate-50/50">
                        <div className="grid gap-6">
                            {sampleReport.categories.map((cat) => (
                                <div key={cat.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                                    <div className="p-4 flex items-center justify-between border-b border-slate-50">
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm",
                                                cat.color === 'green' ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                                            )}>
                                                {cat.score}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900">{cat.title}</h4>
                                                <p className="text-xs text-slate-500">Max Score: {cat.maxScore}</p>
                                            </div>
                                        </div>
                                        <div className={cn(
                                            "px-3 py-1 rounded-full text-xs font-bold",
                                            cat.status === 'Good' || cat.status === 'Excellent' ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                                        )}>
                                            {cat.status}
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                                            {cat.details.map((detail, i) => (
                                                <div key={i} className="flex justify-between text-sm border-b border-slate-50 pb-2 last:border-0">
                                                    <span className="text-slate-600">{detail.label}</span>
                                                    <span className={cn(
                                                        "font-medium",
                                                        detail.status === 'good' ? "text-green-600" : "text-yellow-600"
                                                    )}>{detail.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-600 italic">
                                            "{cat.summary}"
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SampleReportPage;
