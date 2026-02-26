import React from 'react';
import { Share2, Gift, Users, Award } from 'lucide-react';

const GrowthPage = () => {
    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <section className="bg-white pt-20 pb-16 border-b border-slate-200">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                        Help Others Find Clarity
                    </h1>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                        Every couple deserves to know. Share this with people you care about—privately and meaningfully.
                    </p>
                </div>
            </section>

            <section className="py-20 container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    {/* Referral Card */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-primary/20">
                        <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold mb-4">
                            GIVE ₹200, GET ₹300
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Refer a Couple</h2>
                        <p className="text-slate-600 mb-6">
                            Know someone getting married? Send them a discount. When they complete screening, you earn credits.
                        </p>

                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6">
                            <p className="text-sm font-medium text-slate-500 mb-2">Your Personal Code</p>
                            <div className="flex justify-between items-center">
                                <span className="text-2xl font-mono font-bold text-slate-900">HEALTH2025</span>
                                <button className="text-primary font-bold text-sm hover:underline">Copy</button>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button className="flex-1 bg-green-500 text-white py-3 rounded-lg font-bold hover:bg-green-600 transition-colors flex items-center justify-center gap-2">
                                <Share2 className="w-4 h-4" /> WhatsApp
                            </button>
                            <button className="flex-1 bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors">
                                Copy Link
                            </button>
                        </div>
                    </div>

                    {/* Partner Program */}
                    <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-lg">
                        <div className="inline-block bg-white/10 text-white px-3 py-1 rounded-full text-xs font-bold mb-4">
                            FOR PROFESSIONALS
                        </div>
                        <h2 className="text-2xl font-bold mb-4">Counselor Partner Program</h2>
                        <p className="text-slate-300 mb-6">
                            Are you a marriage counselor, therapist, or matchmaker? Equip your clients with data.
                        </p>
                        <ul className="space-y-3 mb-8">
                            <li className="flex items-center gap-2 text-sm text-slate-300">
                                <Award className="w-4 h-4 text-yellow-400" /> Dedicated dashboard
                            </li>
                            <li className="flex items-center gap-2 text-sm text-slate-300">
                                <Users className="w-4 h-4 text-blue-400" /> Bulk screening packages
                            </li>
                            <li className="flex items-center gap-2 text-sm text-slate-300">
                                <Gift className="w-4 h-4 text-green-400" /> 20% commission
                            </li>
                        </ul>
                        <button className="w-full bg-white text-slate-900 py-3 rounded-lg font-bold hover:bg-slate-100 transition-colors">
                            Apply as Partner
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default GrowthPage;
