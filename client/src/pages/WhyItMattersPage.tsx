import React from 'react';
import { Heart, TrendingUp, Users, ShieldCheck, Quote } from 'lucide-react';
import { TestimonialCard } from '@/components/TestimonialCard';
import { testimonials } from '@/data/testimonials';

const WhyItMattersPage = () => {
    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* HERO */}
            <section className="bg-white pt-20 pb-16 border-b border-slate-200">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                        Why This Matters More Than Ever
                    </h1>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                        Marriage is changing. Health risks are rising. Here's why smart couples are choosing clarity over hope.
                    </p>
                </div>
            </section>

            {/* STATISTICS */}
            <section className="py-20 container mx-auto px-4">
                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
                        <div className="text-5xl font-bold text-primary mb-2">1 in 8</div>
                        <p className="text-slate-600 font-medium">Indians carry Thalassemia trait</p>
                        <p className="text-sm text-slate-400 mt-2">Most don't know until they have a child.</p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
                        <div className="text-5xl font-bold text-primary mb-2">40%</div>
                        <p className="text-slate-600 font-medium">Couples face fertility issues</p>
                        <p className="text-sm text-slate-400 mt-2">Early detection saves years of stress.</p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
                        <div className="text-5xl font-bold text-primary mb-2">67%</div>
                        <p className="text-slate-600 font-medium">Divorce risk reduction</p>
                        <p className="text-sm text-slate-400 mt-2">When health expectations are clear.</p>
                    </div>
                </div>
            </section>

            {/* REAL STORIES */}
            <section className="py-20 bg-slate-900 text-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Real Stories from Our Community</h2>
                        <p className="text-slate-400">Names changed for privacy, but the impact is real.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((t) => (
                            <TestimonialCard key={t.id} {...t} />
                        ))}
                    </div>
                </div>
            </section>

            {/* CULTURAL CONTEXT */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Respecting Tradition, Embracing Science</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-orange-50 p-8 rounded-xl border border-orange-100">
                            <h3 className="text-xl font-bold text-orange-900 mb-4">For Arranged Marriages</h3>
                            <p className="text-orange-800 mb-4">
                                "In our community, we match horoscopes. But health is the physical horoscope. Knowing genetic compatibility is just as important as matching stars."
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center font-bold text-orange-800">R</div>
                                <div>
                                    <div className="font-bold text-orange-900">Rajesh K.</div>
                                    <div className="text-xs text-orange-700">Father of Bride</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-purple-50 p-8 rounded-xl border border-purple-100">
                            <h3 className="text-xl font-bold text-purple-900 mb-4">For Modern Couples</h3>
                            <p className="text-purple-800 mb-4">
                                "We lived together for 2 years but never talked about fertility. This report gave us a structured way to have the 'kids conversation' with actual data."
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center font-bold text-purple-800">S</div>
                                <div>
                                    <div className="font-bold text-purple-900">Sarah & Mike</div>
                                    <div className="text-xs text-purple-700">Dating 3 Years</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default WhyItMattersPage;
