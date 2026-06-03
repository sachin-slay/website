import React from 'react';
import { Shield, Lock, Eye, FileKey, Server, UserCheck } from 'lucide-react';

const TrustPrivacyPage = () => {
    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <section className="bg-white pt-20 pb-16 border-b border-slate-200">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                        Your Secrets Are Safe With Us
                    </h1>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                        We built this platform because we know how sensitive health data is. Here is our promise to you.
                    </p>
                </div>
            </section>

            <section className="py-20 container mx-auto px-4">
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
                        <Lock className="w-10 h-10 text-primary mb-6" />
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Military-Grade Encryption</h3>
                        <p className="text-slate-600">
                            Your data is encrypted at rest and in transit using AES-256. Even our engineers cannot see your raw reports without your explicit temporary permission.
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
                        <Eye className="w-10 h-10 text-primary mb-6" />
                        <h3 className="text-xl font-bold text-slate-900 mb-3">You Control Sharing</h3>
                        <p className="text-slate-600">
                            Your partner sees NOTHING until you click "Share". You can choose to share only specific sections (e.g., Genetic Compatibility) while keeping others (e.g., Past Infections) private.
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
                        <UserCheck className="w-10 h-10 text-primary mb-6" />
                        <h3 className="text-xl font-bold text-slate-900 mb-3">No Family Access</h3>
                        <p className="text-slate-600">
                            We verify identity via phone OTP. Parents cannot access your report unless you physically show them. We do not have a "parent login" feature for adult reports.
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-white border-t border-slate-200">
                <div className="container mx-auto px-4 max-w-4xl">
                    <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Data Flow Transparency</h2>
                    <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-slate-200 font-bold text-slate-400">1</div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-slate-900">Upload</h4>
                                    <p className="text-sm text-slate-600">Files are uploaded to secure, ephemeral storage.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-slate-200 font-bold text-slate-400">2</div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-slate-900">Processing</h4>
                                    <p className="text-sm text-slate-600">AI extracts data points in a sandboxed environment.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-slate-200 font-bold text-slate-400">3</div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-slate-900">Storage</h4>
                                    <p className="text-sm text-slate-600">Only extracted data points are stored permanently. Original files are deleted after 30 days.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default TrustPrivacyPage;
