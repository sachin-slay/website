import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, FileText, Upload, CheckCircle, Clock, AlertTriangle,
    ChevronDown, ChevronUp, Heart, Stethoscope, MessageCircle,
    Dna, Activity, Brain, Users, Calendar, Sparkles, X, Plus, Eye,
    TrendingUp, Shield, Zap, Award, Info, Download, Share2, Check
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';

interface UploadedReport {
    id: string;
    fileName: string;
    uploadedAt: Date;
    type: 'user' | 'prospect';
}

// Sample insights data
const SAMPLE_INSIGHTS = {
    compatibilityScore: 85,
    matrix: {
        genetics: {
            icon: <Dna className="w-5 h-5" />,
            color: 'emerald',
            params: [
                { name: 'Thalassemia Beta', user: 'Healthy', prospect: 'Healthy', match: 100 },
                { name: 'Sickle Cell', user: 'Carrier', prospect: 'Healthy', match: 85 },
                { name: 'Cystic Fibrosis', user: 'Healthy', prospect: 'Healthy', match: 100 }
            ]
        },
        fertility: {
            icon: <Heart className="w-5 h-5" />,
            color: 'rose',
            params: [
                { name: 'AMH Levels', user: 'Normal', prospect: 'Normal', match: 90 },
                { name: 'FSH/LH Ratio', user: 'Normal', prospect: 'Normal', match: 95 },
                { name: 'Thyroid Function', user: 'Normal', prospect: 'Normal', match: 100 }
            ]
        },
        chronicHealth: {
            icon: <Activity className="w-5 h-5" />,
            color: 'blue',
            params: [
                { name: 'HbA1c', user: 'Normal', prospect: 'Normal', match: 100 },
                { name: 'Lipid Profile', user: 'Normal', prospect: 'Borderline', match: 85 },
                { name: 'Blood Pressure', user: 'Normal', prospect: 'Normal', match: 100 }
            ]
        },
        infectionRisk: {
            icon: <Shield className="w-5 h-5" />,
            color: 'violet',
            params: [
                { name: 'HIV', user: 'Negative', prospect: 'Negative', match: 100 },
                { name: 'Hepatitis B', user: 'Negative', prospect: 'Negative', match: 100 },
                { name: 'Hepatitis C', user: 'Negative', prospect: 'Negative', match: 100 }
            ]
        },
        lifestyle: {
            icon: <Zap className="w-5 h-5" />,
            color: 'amber',
            params: [
                { name: 'BMI', user: 'Normal', prospect: 'Normal', match: 95 },
                { name: 'Vitamin D', user: 'Low', prospect: 'Normal', match: 70 },
                { name: 'Iron Levels', user: 'Normal', prospect: 'Normal', match: 100 }
            ]
        }
    },
    healthDomains: [
        {
            name: 'Genetics',
            score: 92,
            icon: <Dna className="w-5 h-5" />,
            color: 'emerald',
            whatItMeans: 'Your genes show very low chances of passing on any major inherited health conditions.',
            whyItMatters: 'This reduces the risk of future children having genetic disorders.'
        },
        {
            name: 'Fertility',
            score: 78,
            icon: <Heart className="w-5 h-5" />,
            color: 'orange',
            whatItMeans: 'Most fertility hormones look fine, but one marker (AMH) is a bit lower than expected for your age.',
            whyItMatters: 'This does not mean infertility. It simply suggests you may want long-term family-planning advice from a specialist.',
            warning: 'AMH levels suggest consulting a specialist for long-term planning.'
        },
        {
            name: 'Chronic Health',
            score: 88,
            icon: <Activity className="w-5 h-5" />,
            color: 'emerald',
            whatItMeans: 'Your blood sugar, cholesterol, and other long-term health markers look healthy.',
            whyItMatters: 'A strong start for long-term wellness — fewer risks affecting future lifestyle or pregnancy.'
        },
        {
            name: 'Infection Risk',
            score: 100,
            icon: <Shield className="w-5 h-5" />,
            color: 'emerald',
            whatItMeans: 'Your screening for common infections and STIs looks completely clear.',
            whyItMatters: 'This supports a safe and healthy relationship, with no hidden medical risks for you or your future partner.'
        },
        {
            name: 'Lifestyle',
            score: 65,
            icon: <Zap className="w-5 h-5" />,
            color: 'orange',
            whatItMeans: "Your habits are generally okay, but there's room to improve — possibly in areas like sleep, nutrition, or activity levels.",
            whyItMatters: 'Better habits today → higher energy, better fertility, and healthier long-term compatibility with your partner.',
            warning: 'Consider improving sleep, nutrition, or activity levels for better overall health.'
        }
    ]
};


const ReportsPage = () => {
    const navigate = useNavigate();
    const { candidateProfile, currentProspect, userProfile, selectedMatchId, getMatchById } = useApp();

    // Get selected match data if available
    const selectedMatch = selectedMatchId ? getMatchById(selectedMatchId) : null;
    const matchScore = selectedMatch?.score || SAMPLE_INSIGHTS.compatibilityScore;

    const displayName = userProfile.userRelation === 'Self' ? userProfile.name : candidateProfile.name;

    const [userReports, setUserReports] = useState<UploadedReport[]>([]);
    const [prospectReports, setProspectReports] = useState<UploadedReport[]>([]);
    // Auto-show insights if match has a score
    const [showInsights, setShowInsights] = useState(!!selectedMatch?.score);
    const [expandedSection, setExpandedSection] = useState<string | null>('genetics');

    const handleFileUpload = (type: 'user' | 'prospect') => {
        const newReport: UploadedReport = {
            id: `report - ${Date.now()} `,
            fileName: `Pathology_Report_${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`,
            uploadedAt: new Date(),
            type
        };

        if (type === 'user') {
            setUserReports(prev => [...prev, newReport]);
        } else {
            setProspectReports(prev => [...prev, newReport]);
        }

        if ((type === 'user' && prospectReports.length > 0) || (type === 'prospect' && userReports.length > 0)) {
            setTimeout(() => setShowInsights(true), 500);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 90) return 'text-emerald-600';
        if (score >= 70) return 'text-orange-500';
        return 'text-red-500';
    };

    const getScoreBg = (score: number) => {
        if (score >= 90) return 'from-emerald-500 to-teal-500';
        if (score >= 70) return 'from-orange-500 to-amber-500';
        return 'from-red-500 to-rose-500';
    };

    const getStatusBadge = (value: string) => {
        const colors: Record<string, string> = {
            'Healthy': 'bg-emerald-100 text-emerald-700 border-emerald-200',
            'Normal': 'bg-emerald-100 text-emerald-700 border-emerald-200',
            'Negative': 'bg-emerald-100 text-emerald-700 border-emerald-200',
            'Carrier': 'bg-amber-100 text-amber-700 border-amber-200',
            'Borderline': 'bg-amber-100 text-amber-700 border-amber-200',
            'Low': 'bg-amber-100 text-amber-700 border-amber-200'
        };
        return colors[value] || 'bg-slate-100 text-slate-700 border-slate-200';
    };

    const getSectionColor = (color: string) => {
        const colors: Record<string, { bg: string; text: string; border: string; light: string }> = {
            emerald: { bg: 'bg-emerald-500', text: 'text-emerald-600', border: 'border-emerald-200', light: 'bg-emerald-50' },
            rose: { bg: 'bg-rose-500', text: 'text-rose-600', border: 'border-rose-200', light: 'bg-rose-50' },
            blue: { bg: 'bg-blue-500', text: 'text-blue-600', border: 'border-blue-200', light: 'bg-blue-50' },
            violet: { bg: 'bg-violet-500', text: 'text-violet-600', border: 'border-violet-200', light: 'bg-violet-50' },
            amber: { bg: 'bg-amber-500', text: 'text-amber-600', border: 'border-amber-200', light: 'bg-amber-50' },
            orange: { bg: 'bg-orange-500', text: 'text-orange-600', border: 'border-orange-200', light: 'bg-orange-50' }
        };
        return colors[color] || colors.emerald;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-4 sm:py-8 px-3 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 sm:mb-8">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium transition-colors group text-sm sm:text-base"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Dashboard
                    </button>
                    <div className="bg-white px-3 sm:px-5 py-2 sm:py-3 rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm">
                        <p className="text-xs text-slate-500">Compatibility Check</p>
                        <div className="flex items-center gap-2 mt-0.5 sm:mt-1">
                            <span className="font-bold text-slate-900 text-sm sm:text-base truncate max-w-[80px] sm:max-w-none">{displayName || 'You'}</span>
                            <Heart className="w-3 sm:w-4 h-3 sm:h-4 text-pink-500 flex-shrink-0" />
                            <span className="font-bold text-slate-900 text-sm sm:text-base truncate max-w-[80px] sm:max-w-none">{currentProspect.name || 'Prospect'}</span>
                        </div>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 sm:mb-8"
                >
                    <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 mb-1 sm:mb-2">Health Compatibility</h1>
                    <p className="text-slate-600 text-sm sm:text-lg">
                        Comprehensive health analysis and compatibility insights
                    </p>
                </motion.div>

                {/* Upload Section - Only show when insights are NOT visible */}
                {!showInsights && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-xl sm:rounded-3xl p-4 sm:p-8 shadow-sm border border-slate-100 mb-6 sm:mb-8"
                    >
                        <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                            <div className="w-10 sm:w-14 h-10 sm:h-14 bg-gradient-to-br from-primary to-teal-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-primary/25">
                                <FileText className="w-5 sm:w-7 h-5 sm:h-7 text-white" />
                            </div>
                            <div>
                                <h2 className="text-lg sm:text-xl font-bold text-slate-900">Pathology Reports</h2>
                                <p className="text-slate-500 text-xs sm:text-base">Upload blood tests, urine analysis, and other lab reports</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                            {/* User Reports */}
                            <div className="bg-gradient-to-br from-primary/5 to-teal-50 border-2 border-primary/20 rounded-xl sm:rounded-2xl p-3 sm:p-5 hover:border-primary/40 transition-colors">
                                <div className="flex items-center justify-between mb-3 sm:mb-5">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <div className="w-8 sm:w-10 h-8 sm:h-10 bg-primary rounded-lg sm:rounded-xl flex items-center justify-center">
                                            <Users className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
                                        </div>
                                        <span className="font-bold text-slate-900 text-sm sm:text-base">{displayName || 'Your'} Reports</span>
                                    </div>
                                    {userReports.length > 0 && (
                                        <span className="text-[10px] sm:text-xs bg-primary text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full font-medium">
                                            {userReports.length} file{userReports.length > 1 ? 's' : ''}
                                        </span>
                                    )}
                                </div>

                                {userReports.length === 0 ? (
                                    <button
                                        onClick={() => handleFileUpload('user')}
                                        className="w-full border-2 border-dashed border-primary/30 hover:border-primary rounded-lg sm:rounded-xl p-4 sm:p-8 text-center transition-all hover:bg-primary/5 group"
                                    >
                                        <div className="w-10 sm:w-14 h-10 sm:h-14 bg-white rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-md group-hover:scale-110 transition-transform">
                                            <Upload className="w-4 sm:w-6 h-4 sm:h-6 text-primary" />
                                        </div>
                                        <p className="text-slate-600 mb-1 text-xs sm:text-base">Drop files here or click to upload</p>
                                        <p className="text-[10px] sm:text-xs text-slate-400">PDF, JPG, PNG (max 10MB)</p>
                                    </button>
                                ) : (
                                    <div className="space-y-2 sm:space-y-3">
                                        {userReports.map((report, index) => (
                                            <motion.div
                                                key={report.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="flex items-center justify-between bg-white rounded-lg sm:rounded-xl p-2.5 sm:p-4 shadow-sm border border-slate-100"
                                            >
                                                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                                                    <div className="w-8 sm:w-10 h-8 sm:h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <FileText className="w-4 sm:w-5 h-4 sm:h-5 text-primary" />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-xs sm:text-sm font-semibold text-slate-900 flex items-center gap-1 sm:gap-2 flex-wrap">
                                                            <span className="truncate max-w-[100px] sm:max-w-[180px]">{report.fileName}</span>
                                                            {index === userReports.length - 1 && (
                                                                <span className="text-[8px] sm:text-[10px] bg-primary text-white px-1.5 sm:px-2 py-0.5 rounded-full uppercase font-bold flex-shrink-0">Latest</span>
                                                            )}
                                                        </p>
                                                        <p className="text-[10px] sm:text-xs text-slate-400 flex items-center gap-1">
                                                            <Clock className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
                                                            <span className="truncate">{report.uploadedAt.toLocaleDateString()}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <button className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0">
                                                    <Eye className="w-3 sm:w-4 h-3 sm:h-4 text-slate-400" />
                                                </button>
                                            </motion.div>
                                        ))}
                                        <button
                                            onClick={() => handleFileUpload('user')}
                                            className="w-full flex items-center justify-center gap-1.5 sm:gap-2 text-primary font-semibold py-2 sm:py-3 text-xs sm:text-base border-2 border-dashed border-primary/30 rounded-lg sm:rounded-xl hover:bg-primary/5 transition-colors"
                                        >
                                            <Plus className="w-3 sm:w-4 h-3 sm:h-4" />
                                            Add Another Report
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Prospect Reports */}
                            <div className="bg-gradient-to-br from-pink-50 to-rose-50 border-2 border-pink-200 rounded-xl sm:rounded-2xl p-3 sm:p-5 hover:border-pink-300 transition-colors">
                                <div className="flex items-center justify-between mb-3 sm:mb-5">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <div className="w-8 sm:w-10 h-8 sm:h-10 bg-pink-500 rounded-lg sm:rounded-xl flex items-center justify-center">
                                            <Heart className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
                                        </div>
                                        <span className="font-bold text-slate-900 text-sm sm:text-base truncate max-w-[120px] sm:max-w-none">{currentProspect.name || 'Partner'}'s Reports</span>
                                    </div>
                                    {prospectReports.length > 0 && (
                                        <span className="text-[10px] sm:text-xs bg-pink-500 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full font-medium flex-shrink-0">
                                            {prospectReports.length} file{prospectReports.length > 1 ? 's' : ''}
                                        </span>
                                    )}
                                </div>

                                {prospectReports.length === 0 ? (
                                    <button
                                        onClick={() => handleFileUpload('prospect')}
                                        className="w-full border-2 border-dashed border-pink-300 hover:border-pink-400 rounded-lg sm:rounded-xl p-4 sm:p-8 text-center transition-all hover:bg-pink-50 group"
                                    >
                                        <div className="w-10 sm:w-14 h-10 sm:h-14 bg-white rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-md group-hover:scale-110 transition-transform">
                                            <Upload className="w-4 sm:w-6 h-4 sm:h-6 text-pink-500" />
                                        </div>
                                        <p className="text-slate-600 mb-1 text-xs sm:text-base">Drop files here or click to upload</p>
                                        <p className="text-[10px] sm:text-xs text-slate-400">PDF, JPG, PNG (max 10MB)</p>
                                    </button>
                                ) : (
                                    <div className="space-y-2 sm:space-y-3">
                                        {prospectReports.map((report, index) => (
                                            <motion.div
                                                key={report.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="flex items-center justify-between bg-white rounded-lg sm:rounded-xl p-2.5 sm:p-4 shadow-sm border border-slate-100"
                                            >
                                                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                                                    <div className="w-8 sm:w-10 h-8 sm:h-10 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <FileText className="w-4 sm:w-5 h-4 sm:h-5 text-pink-500" />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-xs sm:text-sm font-semibold text-slate-900 flex items-center gap-1 sm:gap-2 flex-wrap">
                                                            <span className="truncate max-w-[100px] sm:max-w-[180px]">{report.fileName}</span>
                                                            {index === prospectReports.length - 1 && (
                                                                <span className="text-[8px] sm:text-[10px] bg-pink-500 text-white px-1.5 sm:px-2 py-0.5 rounded-full uppercase font-bold flex-shrink-0">Latest</span>
                                                            )}
                                                        </p>
                                                        <p className="text-[10px] sm:text-xs text-slate-400 flex items-center gap-1">
                                                            <Clock className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
                                                            <span className="truncate">{report.uploadedAt.toLocaleDateString()}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <button className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0">
                                                    <Eye className="w-3 sm:w-4 h-3 sm:h-4 text-slate-400" />
                                                </button>
                                            </motion.div>
                                        ))}
                                        <button
                                            onClick={() => handleFileUpload('prospect')}
                                            className="w-full flex items-center justify-center gap-1.5 sm:gap-2 text-pink-500 font-semibold py-2 sm:py-3 text-xs sm:text-base border-2 border-dashed border-pink-300 rounded-lg sm:rounded-xl hover:bg-pink-50 transition-colors"
                                        >
                                            <Plus className="w-3 sm:w-4 h-3 sm:h-4" />
                                            Add Another Report
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* CTA Buttons Section - ALWAYS VISIBLE */}
                        {showInsights ? (
                            /* Re-Test with Latest Reports CTA - shown when insights already exist */
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4 sm:mt-8"
                            >
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                                        <div className="text-center sm:text-left">
                                            <h3 className="font-bold text-slate-900 text-sm sm:text-lg">Have Updated Reports?</h3>
                                            <p className="text-slate-600 text-xs sm:text-sm">Upload your latest test reports to refresh your compatibility insights</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setShowInsights(false);
                                                setUserReports([]);
                                                setProspectReports([]);
                                            }}
                                            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all hover:scale-105 whitespace-nowrap"
                                        >
                                            <Upload className="w-4 sm:w-5 h-4 sm:h-5" />
                                            Re-Test with Latest Reports
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            /* Generate Insights Button - ALWAYS visible, but styled differently based on upload status */
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4 sm:mt-8 text-center"
                            >
                                <button
                                    onClick={() => setShowInsights(true)}
                                    className="w-full sm:w-auto bg-gradient-to-r from-primary via-teal-500 to-emerald-500 text-white px-6 sm:px-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-lg shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all hover:scale-105 flex items-center gap-2 sm:gap-3 justify-center mx-auto"
                                >
                                    <Sparkles className="w-5 sm:w-6 h-5 sm:h-6" />
                                    Generate Compatibility Insights
                                    <TrendingUp className="w-5 sm:w-6 h-5 sm:h-6" />
                                </button>
                                {(userReports.length === 0 || prospectReports.length === 0) && (
                                    <p className="text-xs sm:text-sm text-slate-500 mt-2 sm:mt-3">
                                        Upload reports from both partners for personalized insights
                                    </p>
                                )}
                            </motion.div>
                        )}
                    </motion.div>
                )}

                {/* Insights Section */}
                <AnimatePresence>
                    {showInsights && (
                        <>
                            {/* Compatibility Score - Hero Section */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="relative mb-6 sm:mb-8 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-primary via-teal-500 to-emerald-500 rounded-xl sm:rounded-3xl" />
                                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />

                                <div className="relative p-6 sm:p-10 text-center text-white">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6 text-sm sm:text-base">
                                            <Award className="w-4 sm:w-5 h-4 sm:h-5" />
                                            <span className="font-medium">Overall Compatibility Score</span>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                                        className="relative inline-block"
                                    >
                                        <div className="text-6xl sm:text-9xl font-black tracking-tight">{matchScore}</div>
                                        <div className="absolute -right-4 sm:-right-8 top-2 sm:top-4 text-2xl sm:text-4xl font-bold opacity-80">%</div>
                                    </motion.div>

                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                        className="text-lg opacity-90 mt-4"
                                    >
                                        Excellent compatibility based on pathology analysis
                                    </motion.p>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6 }}
                                        className="flex justify-center gap-12 mt-8"
                                    >
                                        <div className="flex items-center gap-3 bg-white/15 backdrop-blur-sm px-5 py-3 rounded-2xl">
                                            <div className="w-4 h-4 bg-white rounded-full shadow-lg" />
                                            <span className="font-semibold">{displayName || 'User'}</span>
                                        </div>
                                        <div className="flex items-center gap-3 bg-white/15 backdrop-blur-sm px-5 py-3 rounded-2xl">
                                            <div className="w-4 h-4 bg-white/60 rounded-full" />
                                            <span className="font-semibold">{currentProspect.name || 'Partner'}</span>
                                        </div>
                                    </motion.div>

                                    {/* Action Buttons */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.7 }}
                                        className="flex flex-wrap justify-center gap-4 mt-8"
                                    >
                                        <button
                                            onClick={() => {
                                                // Simulate PDF download
                                                alert('PDF Download feature coming soon! Your compatibility report will be generated and downloaded.');
                                            }}
                                            className="flex items-center gap-2 bg-white text-slate-800 px-6 py-3 rounded-xl font-semibold hover:bg-slate-100 transition-all shadow-lg"
                                        >
                                            <Download className="w-5 h-5" />
                                            Download PDF
                                        </button>
                                        <button
                                            onClick={() => {
                                                const message = `🩺 Health Compatibility Report\n\n💑 ${displayName || 'User'} & ${currentProspect.name || 'Partner'} \n\n✅ Overall Score: ${matchScore}%\n\n📊 Domain Scores: \n• Genetics: 92 / 100\n• Fertility: 78 / 100\n• Chronic Health: 88 / 100\n• Infection Risk: 100 / 100\n• Lifestyle: 65 / 100\n\n🔗 View full report: heartful.health / reports`;
                                                const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
                                                window.open(whatsappUrl, '_blank');
                                            }}
                                            className="flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#22c55e] transition-all shadow-lg"
                                        >
                                            <Share2 className="w-5 h-5" />
                                            Share via WhatsApp
                                        </button >
                                    </motion.div >
                                </div >
                            </motion.div >

                            {/* Detailed Comparison Matrix */}
                            < motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white rounded-xl sm:rounded-3xl shadow-sm border border-slate-100 mb-6 sm:mb-8 overflow-hidden"
                            >
                                <div className="p-4 sm:p-8 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                                    <h2 className="text-lg sm:text-2xl font-bold text-slate-900 flex items-center gap-2 sm:gap-3">
                                        <div className="w-8 sm:w-10 h-8 sm:h-10 bg-slate-900 rounded-lg sm:rounded-xl flex items-center justify-center">
                                            <Activity className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
                                        </div>
                                        Detailed Comparison Matrix
                                    </h2>
                                    <div className="flex items-center gap-4 sm:gap-6 mt-3 sm:mt-4 text-xs sm:text-sm">
                                        <div className="flex items-center gap-1.5 sm:gap-2">
                                            <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 bg-primary rounded-full" />
                                            <span className="text-slate-600 font-medium truncate max-w-[80px] sm:max-w-none">{displayName || 'User'}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 sm:gap-2">
                                            <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 bg-pink-500 rounded-full" />
                                            <span className="text-slate-600 font-medium truncate max-w-[80px] sm:max-w-none">{currentProspect.name || 'Partner'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Matrix Sections */}
                                <div className="divide-y divide-slate-100">
                                    {Object.entries(SAMPLE_INSIGHTS.matrix).map(([key, section], sectionIdx) => {
                                        const colors = getSectionColor(section.color);
                                        const avgMatch = Math.round(section.params.reduce((acc, p) => acc + p.match, 0) / section.params.length);

                                        return (
                                            <div key={key}>
                                                <button
                                                    onClick={() => setExpandedSection(expandedSection === key ? null : key)}
                                                    className="w-full px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between hover:bg-slate-50 transition-colors"
                                                >
                                                    <div className="flex items-center gap-3 sm:gap-4">
                                                        <div className={cn("w-10 sm:w-12 h-10 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center", colors.bg, "text-white shadow-lg")}>
                                                            {section.icon}
                                                        </div>
                                                        <div className="text-left">
                                                            <span className="font-bold text-slate-900 text-sm sm:text-lg capitalize block">
                                                                {key === 'chronicHealth' ? 'Chronic Health' : key === 'infectionRisk' ? 'Infection Risk' : key}
                                                            </span>
                                                            <span className="text-xs sm:text-sm text-slate-500">
                                                                {section.params.length} parameters analyzed
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 sm:gap-4">
                                                        <div className={cn("text-lg sm:text-2xl font-bold", getScoreColor(avgMatch))}>
                                                            {avgMatch}%
                                                        </div>
                                                        <div className={cn("w-8 sm:w-10 h-8 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center transition-all", expandedSection === key ? "bg-slate-900 rotate-180" : "bg-slate-100")}>
                                                            <ChevronDown className={cn("w-4 sm:w-5 h-4 sm:h-5 transition-colors", expandedSection === key ? "text-white" : "text-slate-500")} />
                                                        </div>
                                                    </div>
                                                </button>

                                                <AnimatePresence>
                                                    {expandedSection === key && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.3 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className={cn("px-3 sm:px-8 pb-4 sm:pb-6", colors.light)}>
                                                                {/* Mobile Card Layout */}
                                                                <div className="space-y-3">
                                                                    {section.params.map((param, idx) => (
                                                                        <motion.div
                                                                            key={idx}
                                                                            initial={{ opacity: 0, y: 10 }}
                                                                            animate={{ opacity: 1, y: 0 }}
                                                                            transition={{ delay: idx * 0.1 }}
                                                                            className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-slate-100"
                                                                        >
                                                                            {/* Parameter Name & Match */}
                                                                            <div className="flex items-center justify-between mb-3">
                                                                                <span className="font-semibold text-slate-800 text-sm sm:text-base">{param.name}</span>
                                                                                <span className={cn("text-base sm:text-lg font-bold", getScoreColor(param.match))}>
                                                                                    {param.match}%
                                                                                </span>
                                                                            </div>
                                                                            {/* User & Partner Values */}
                                                                            <div className="flex gap-2 sm:gap-3">
                                                                                <div className="flex-1 bg-primary/5 rounded-lg p-2 sm:p-3">
                                                                                    <div className="text-[10px] sm:text-xs text-slate-500 mb-1">{displayName || 'User'}</div>
                                                                                    <span className={cn("px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold inline-block", getStatusBadge(param.user))}>
                                                                                        {param.user}
                                                                                    </span>
                                                                                </div>
                                                                                <div className="flex-1 bg-pink-50 rounded-lg p-2 sm:p-3">
                                                                                    <div className="text-[10px] sm:text-xs text-slate-500 mb-1">{currentProspect.name || 'Partner'}</div>
                                                                                    <span className={cn("px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold inline-block", getStatusBadge(param.prospect))}>
                                                                                        {param.prospect}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        </motion.div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div >

                            {/* Health Domains */}
                            < motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="mb-6 sm:mb-8"
                            >
                                <h2 className="text-lg sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                                    <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/25">
                                        <TrendingUp className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
                                    </div>
                                    Health Domain Insights
                                </h2>

                                <div className="space-y-3 sm:space-y-5">
                                    {SAMPLE_INSIGHTS.healthDomains.map((domain, idx) => {
                                        const colors = getSectionColor(domain.color);
                                        return (
                                            <motion.div
                                                key={domain.name}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.3 + idx * 0.1 }}
                                                className={cn(
                                                    "bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 shadow-sm hover:shadow-md transition-all",
                                                    domain.warning ? "border-orange-200" : "border-slate-100 hover:border-slate-200"
                                                )}
                                            >
                                                {/* Header Row - Icon, Name, Score */}
                                                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                                                    <div className={cn("w-10 sm:w-14 h-10 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-lg flex-shrink-0", colors.bg)}>
                                                        {domain.icon}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-bold text-base sm:text-xl text-slate-900">{domain.name}</h3>
                                                    </div>
                                                    <div className={cn("text-2xl sm:text-3xl font-black flex-shrink-0", getScoreColor(domain.score))}>
                                                        {domain.score}
                                                        <span className="text-xs sm:text-sm font-medium text-slate-400">/100</span>
                                                    </div>
                                                </div>

                                                {/* What this means */}
                                                <div className="mb-3">
                                                    <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">What this means</p>
                                                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{domain.whatItMeans}</p>
                                                </div>

                                                {/* Why it matters */}
                                                <div className="bg-slate-50 rounded-lg sm:rounded-xl p-2.5 sm:p-3">
                                                    <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Why it matters</p>
                                                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{domain.whyItMatters}</p>
                                                </div>

                                                {domain.warning && (
                                                    <div className="flex items-start gap-2 sm:gap-3 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 text-orange-800 p-3 sm:p-4 rounded-lg sm:rounded-xl mt-3 sm:mt-4">
                                                        <AlertTriangle className="w-4 sm:w-5 h-4 sm:h-5 mt-0.5 flex-shrink-0" />
                                                        <p className="text-xs sm:text-sm font-medium">{domain.warning}</p>
                                                    </div>
                                                )}
                                            </motion.div>
                                        );
                                    })}
                                </div>

                            </motion.div >

                            {/* Baby Planning Window Widget */}
                            < motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.35 }}
                                className="bg-white rounded-xl sm:rounded-3xl shadow-sm border border-slate-100 mb-6 sm:mb-8 overflow-hidden"
                            >
                                <div className="p-4 sm:p-6 border-b border-slate-100 bg-gradient-to-r from-pink-50 via-rose-50 to-pink-50">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/25">
                                            <Heart className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg sm:text-xl font-bold text-slate-900">Your Baby Planning Window</h2>
                                            <p className="text-xs sm:text-sm text-slate-500">Based on your compatibility analysis</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 sm:p-6">
                                    {/* Timeline Container */}
                                    <div className="relative">
                                        {/* Progress Bar Background */}
                                        <div className="h-3 sm:h-4 rounded-full bg-slate-100 overflow-hidden flex">
                                            <div className="w-1/4 bg-gradient-to-r from-emerald-400 to-emerald-500 relative">
                                                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.3)_50%,transparent_100%)] animate-pulse" />
                                            </div>
                                            <div className="w-1/4 bg-gradient-to-r from-teal-400 to-teal-500" />
                                            <div className="w-1/4 bg-gradient-to-r from-amber-400 to-orange-400" />
                                            <div className="w-1/4 bg-gradient-to-r from-red-400 to-red-500" />
                                        </div>

                                        {/* Current Position Indicator (optional - shows "You are here") */}
                                        <div className="absolute -top-1 left-[12%] transform -translate-x-1/2">
                                            <div className="w-5 sm:w-6 h-5 sm:h-6 bg-white border-3 sm:border-4 border-emerald-500 rounded-full shadow-lg" />
                                        </div>

                                        {/* Timeline Labels */}
                                        <div className="flex mt-3 sm:mt-4">
                                            <div className="w-1/4 text-center">
                                                <p className="text-[10px] sm:text-xs font-bold text-emerald-600">0–3 yrs</p>
                                                <p className="text-[10px] sm:text-xs font-semibold text-slate-700 mt-0.5">Optimal</p>
                                                <div className="mt-1.5 sm:mt-2 mx-auto w-fit">
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-[8px] sm:text-[10px] font-medium">
                                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                                        Best time
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="w-1/4 text-center">
                                                <p className="text-[10px] sm:text-xs font-bold text-teal-600">3–7 yrs</p>
                                                <p className="text-[10px] sm:text-xs font-semibold text-slate-700 mt-0.5">Good</p>
                                                <div className="mt-1.5 sm:mt-2 mx-auto w-fit">
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-teal-100 text-teal-700 rounded-full text-[8px] sm:text-[10px] font-medium">
                                                        <span className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
                                                        Favorable
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="w-1/4 text-center">
                                                <p className="text-[10px] sm:text-xs font-bold text-amber-600">7–10 yrs</p>
                                                <p className="text-[10px] sm:text-xs font-semibold text-slate-700 mt-0.5">Declining</p>
                                                <div className="mt-1.5 sm:mt-2 mx-auto w-fit">
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-[8px] sm:text-[10px] font-medium">
                                                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                                                        Consider soon
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="w-1/4 text-center">
                                                <p className="text-[10px] sm:text-xs font-bold text-red-600">&gt;10 yrs</p>
                                                <p className="text-[10px] sm:text-xs font-semibold text-slate-700 mt-0.5">High-Risk</p>
                                                <div className="mt-1.5 sm:mt-2 mx-auto w-fit">
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-[8px] sm:text-[10px] font-medium">
                                                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                                                        Consult expert
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Info Box */}
                                    <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg sm:rounded-xl border border-pink-200">
                                        <div className="flex items-start gap-2 sm:gap-3">
                                            <div className="w-8 sm:w-10 h-8 sm:h-10 bg-pink-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Sparkles className="w-4 sm:w-5 h-4 sm:h-5 text-pink-500" />
                                            </div>
                                            <div>
                                                <p className="text-xs sm:text-sm font-semibold text-slate-800 mb-0.5">Your Optimal Window: 0-3 Years</p>
                                                <p className="text-[10px] sm:text-xs text-slate-600 leading-relaxed">
                                                    Based on both of your health profiles, the optimal time for conception is within the next 3 years.
                                                    This timeline accounts for fertility markers, genetic compatibility, and overall health status.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div >

                            {/* Critical Missing Tests Section */}
                            < motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="bg-white rounded-xl sm:rounded-3xl shadow-sm border border-slate-100 mb-6 sm:mb-8 overflow-hidden"
                            >
                                {/* Header with Warning */}
                                < div className="p-4 sm:p-6 border-b border-slate-100 bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50" >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/25">
                                                <AlertTriangle className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                                            </div>
                                            <div>
                                                <h2 className="text-lg sm:text-xl font-bold text-slate-900">Critical Tests Missing</h2>
                                                <p className="text-xs sm:text-sm text-orange-600 font-medium">160+ parameters not present in uploaded reports</p>
                                            </div>
                                        </div>
                                        <button className="text-xs sm:text-sm text-primary font-semibold hover:underline whitespace-nowrap flex-shrink-0">
                                            View All →
                                        </button>
                                    </div>
                                </div >

                                {/* Test Categories Grid */}
                                < div className="p-4 sm:p-6" >
                                    <p className="text-xs sm:text-sm text-slate-600 mb-3 sm:mb-4">The following test categories have pending parameters:</p>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
                                        {[
                                            { name: 'Genetic Markers', pending: 45, icon: '🧬', color: 'emerald' },
                                            { name: 'Fertility Panel', pending: 28, icon: '🩺', color: 'pink' },
                                            { name: 'Chronic Disease', pending: 32, icon: '❤️', color: 'red' },
                                            { name: 'Infection Screen', pending: 18, icon: '🦠', color: 'purple' },
                                            { name: 'Lifestyle Markers', pending: 24, icon: '🏃', color: 'blue' },
                                            { name: 'Hormonal Panel', pending: 15, icon: '⚡', color: 'amber' },
                                        ].map((category) => (
                                            <div
                                                key={category.name}
                                                className="bg-slate-50 hover:bg-slate-100 rounded-lg sm:rounded-xl p-2.5 sm:p-3 transition-colors cursor-pointer border border-slate-100"
                                            >
                                                <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                                                    <span className="text-base sm:text-lg">{category.icon}</span>
                                                    <span className="text-[10px] sm:text-xs font-bold text-slate-800 leading-tight">{category.name}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[10px] sm:text-xs text-slate-500">{category.pending} pending</span>
                                                    <span className={`text-[8px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full font-medium bg-orange-100 text-orange-700`}>
                                                        Missing
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* NABL Certified Banner */}
                                    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white">
                                        {/* Background Pattern */}
                                        <div className="absolute top-0 right-0 w-32 sm:w-40 h-32 sm:h-40 bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                                        <div className="absolute bottom-0 left-0 w-24 sm:w-32 h-24 sm:h-32 bg-emerald-500/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />

                                        <div className="relative">
                                            {/* NABL Badge */}
                                            <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-full mb-3 sm:mb-4">
                                                <div className="w-4 sm:w-5 h-4 sm:h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                                                    <Check className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-white" />
                                                </div>
                                                <span className="text-[10px] sm:text-xs font-semibold text-emerald-400">NABL Certified</span>
                                            </div>

                                            {/* Main Content */}
                                            <h3 className="text-base sm:text-lg font-bold mb-1 sm:mb-2">
                                                Avoid misleading or incomplete reports.
                                            </h3>
                                            <p className="text-xs sm:text-sm text-white/80 mb-3 sm:mb-4">
                                                Choose verified, NABL-certified diagnostics. Get the truth you deserve before making life decisions.
                                            </p>

                                            {/* Price & CTA */}
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                                                <div>
                                                    <p className="text-[10px] sm:text-xs text-white/60 mb-0.5">Price starts at</p>
                                                    <p className="text-xl sm:text-2xl font-black text-emerald-400">₹2,500<span className="text-sm sm:text-base font-medium text-white/60">/-</span></p>
                                                </div>
                                                <button className="w-full sm:w-auto bg-gradient-to-r from-primary to-emerald-500 hover:from-primary/90 hover:to-emerald-500/90 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all hover:scale-105 flex items-center justify-center gap-2">
                                                    <Calendar className="w-4 sm:w-5 h-4 sm:h-5" />
                                                    Book Now
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div >
                            </motion.div >
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="bg-white rounded-xl sm:rounded-3xl shadow-sm border border-slate-100 mb-6 sm:mb-8 overflow-hidden"
                            >
                                {/* Header with Warning */}
                                <div className="p-4 sm:p-6 border-b border-slate-100 bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                                                <Stethoscope className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                                            </div>
                                            <div>
                                                <h2 className="text-lg sm:text-xl font-bold text-slate-900">2 Criticalities Found</h2>
                                                <p className="text-xs sm:text-sm text-emerald-600 font-bold flex items-center gap-1">
                                                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                                    No Worries
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Criticalities List */}
                                <div className="p-4 sm:p-6">
                                    <p className="text-xs sm:text-sm text-slate-600 mb-3 sm:mb-4">The following areas require expert attention:</p>

                                    <div className="grid sm:grid-cols-2 gap-3 mb-4 sm:mb-6">
                                        <div className="bg-red-50 border border-red-100 rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-start gap-3">
                                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Dna className="w-4 h-4 text-red-600" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-900">Genetic Carrier Status</h4>
                                                <p className="text-xs text-slate-600 mt-0.5">Variant detected in HBB gene. Genetic counselling recommended.</p>
                                            </div>
                                        </div>
                                        <div className="bg-amber-50 border border-amber-100 rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-start gap-3">
                                            <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Activity className="w-4 h-4 text-amber-600" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-900">Hormonal Imbalance</h4>
                                                <p className="text-xs text-slate-600 mt-0.5">Thyroid levels outside optimal range for conception planning.</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expert Counselling Banner */}
                                    <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white">
                                        {/* Background Pattern */}
                                        <div className="absolute top-0 right-0 w-32 sm:w-40 h-32 sm:h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                                        <div className="absolute bottom-0 left-0 w-24 sm:w-32 h-24 sm:h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />

                                        <div className="relative flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
                                            <div className="text-center md:text-left">
                                                <h3 className="text-base sm:text-lg font-bold mb-1 sm:mb-2">
                                                    Talk to real doctors, not the internet.
                                                </h3>
                                                <p className="text-xs sm:text-sm text-white/90 mb-1">
                                                    Get personalised pre-marital guidance from certified specialists.
                                                </p>
                                                <p className="text-[10px] sm:text-xs text-white/70">
                                                    Clarity from experts across fertility, genetics, mental health & preventive care.
                                                </p>
                                            </div>

                                            <button className="w-full md:w-auto bg-white text-purple-600 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base hover:bg-purple-50 transition-colors shadow-lg whitespace-nowrap flex-shrink-0">
                                                Schedule Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence >

                {/* Coming Soon Categories */}
                {
                    !showInsights && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-4"
                        >
                            <h3 className="text-lg font-bold text-slate-900 mb-4">More Report Categories</h3>
                            {['Radiology Reports', 'Genetic Reports', 'Mental Health', 'Lifestyle Assessment'].map((category, idx) => (
                                <div key={category} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 opacity-70">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                                                {category === 'Radiology Reports' && <Activity className="w-6 h-6 text-slate-400" />}
                                                {category === 'Genetic Reports' && <Dna className="w-6 h-6 text-slate-400" />}
                                                {category === 'Mental Health' && <Brain className="w-6 h-6 text-slate-400" />}
                                                {category === 'Lifestyle Assessment' && <Heart className="w-6 h-6 text-slate-400" />}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900">{category}</h3>
                                                <p className="text-sm text-slate-500">This feature will be available soon</p>
                                            </div>
                                        </div>
                                        <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            Coming Soon
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )
                }
            </div >
        </div >
    );
};

export default ReportsPage;
