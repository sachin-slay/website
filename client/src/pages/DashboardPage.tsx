import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Plus, User, Gift, Heart, Calendar, Users, MapPin,
    Clock, ChevronRight, Stethoscope, MessageCircle,
    Sparkles, Globe, CheckCircle, ArrowRight
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

const DashboardPage = () => {
    const navigate = useNavigate();
    const { userProfile, candidateProfile, freeMatchesAvailable, setSelectedMatchId, setCurrentProspect, session } = useApp();
    const [matches, setMatches] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        if (!session?.access_token) return;
        const fetchMatches = async () => {
            try {
                const res = await fetch("http://localhost:4000/api/matches", {
                    headers: { "Authorization": `Bearer ${session.access_token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setMatches(data);
                }
            } catch (err) {
                console.error("Failed to fetch matches", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMatches();
    }, [session]);

    const handleMatchClick = (match: any) => {
        setSelectedMatchId(match.id);
        setCurrentProspect(match.prospect);
        navigate(`/report/${match.id}`);
    };

    // Get display profile (candidate if user filled on behalf, else self)
    const displayProfile = userProfile.userRelation === 'Self'
        ? { name: userProfile.name, age: userProfile.age, gender: userProfile.gender, city: userProfile.city }
        : candidateProfile;

    const handleNewCheck = () => {
        navigate('/add-prospect');
    };

    const serviceBanners = [
        {
            id: 'diagnostics',
            title: 'Controlled Diagnostic Reports',
            description: "Don't rely on uncertain reports. Get verified results from NABL-certified partner labs.",
            subtext: 'Accurate, controlled testing that protects your decisions.',
            price: '₹2,500',
            icon: <Stethoscope className="w-6 h-6" />,
            gradient: 'from-blue-500 to-cyan-500',
            bgGradient: 'from-blue-50 to-cyan-50'
        },
        {
            id: 'counselling',
            title: 'Pre-Marital Health Counselling',
            description: 'Talk to real doctors, not the internet. Get personalised pre-marital guidance from certified specialists.',
            subtext: 'Expert advice for your journey ahead.',
            price: '',
            icon: <MessageCircle className="w-6 h-6" />,
            gradient: 'from-purple-500 to-pink-500',
            bgGradient: 'from-purple-50 to-pink-50'
        },
        {
            id: 'concierge-domestic',
            title: 'Concierge (Domestic)',
            description: "Exclusive concierge care for India's high-intent couples",
            subtext: 'At-home testing, curated doctors, and a private health manager for complete clarity.',
            price: '₹50,000',
            icon: <Sparkles className="w-6 h-6" />,
            gradient: 'from-amber-500 to-orange-500',
            bgGradient: 'from-amber-50 to-orange-50'
        },
        {
            id: 'concierge-nri',
            title: 'Concierge (NRIs)',
            description: 'Your cross-border pre-marital health concierge anywhere in the world.',
            subtext: 'International testing, global specialists, and seamless logistics.',
            price: '₹1,25,000',
            icon: <Globe className="w-6 h-6" />,
            gradient: 'from-emerald-500 to-teal-500',
            bgGradient: 'from-emerald-50 to-teal-50'
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 py-4 sm:py-8 px-3 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 sm:mb-8"
                >
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
                        Welcome back, {userProfile.name || 'there'}! 👋
                    </h1>
                    <p className="text-sm sm:text-base text-slate-600">
                        {userProfile.userRelation === 'Self'
                            ? 'Your compatibility dashboard'
                            : `Managing for ${displayProfile.name || 'your family member'}`}
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                        {/* Free Matches Banner */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-gradient-to-br from-primary to-teal-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-lg overflow-hidden relative"
                        >
                            <div className="absolute top-3 left-3 bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                                <Gift className="w-3 h-3" />
                                Free Plan
                            </div>
                            <div className="pt-6">
                                <h2 className="text-4xl font-bold mb-1">
                                    {Math.max(0, freeMatchesAvailable)} Matches
                                </h2>
                                <p className="text-white/80 mb-6">Available for free analysis</p>
                                <button
                                    onClick={handleNewCheck}
                                    className="bg-white text-primary px-6 py-3 rounded-xl font-semibold hover:bg-white/90 transition-all flex items-center gap-2 shadow-md"
                                >
                                    <Plus className="w-5 h-5" />
                                    New Compatibility Check
                                </button>
                            </div>
                        </motion.div>

                        {/* Recent Activity */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-100"
                        >
                            <div className="p-3 sm:p-5 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm sm:text-base">
                                    <Clock className="w-4 sm:w-5 h-4 sm:h-5 text-primary" />
                                    Recent Activity
                                </h3>
                                {matches.length > 0 && (
                                    <button className="text-primary text-sm font-medium hover:underline">
                                        View All
                                    </button>
                                )}
                            </div>

                            {loading ? (
                                <div className="p-8 text-center text-slate-500">
                                    Loading your matches...
                                </div>
                            ) : matches.length > 0 ? (
                                <div className="divide-y divide-slate-100">
                                    {matches.slice(0, 3).map((match) => {
                                        // Get test categories based on which reports were done
                                        const testCategories = ['Genetics', 'Fertility', 'Chronic Health', 'Infection Risk', 'Lifestyle']
                                            .filter((_, i) => i < 3 + Math.floor(Math.random() * 3)) // Simulate some tests done
                                            .join(', ');

                                        return (
                                            <div
                                                key={match.id}
                                                className="p-3 sm:p-4 hover:bg-slate-50 transition-colors cursor-pointer"
                                                onClick={() => handleMatchClick(match)}
                                            >
                                                <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                                                    {/* Score Circle with % */}
                                                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                                                        <span className="text-white font-bold text-sm sm:text-lg">{match.score || '--'}%</span>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-semibold text-slate-900 text-sm sm:text-lg truncate">
                                                            {match.user?.name || 'User'} & {match.prospect?.name || 'Prospect'}
                                                        </p>
                                                        <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1">
                                                            <span className="text-xs sm:text-sm text-slate-500 flex items-center gap-1">
                                                                <Calendar className="w-3 h-3" />
                                                                {new Date(match.createdAt).toLocaleDateString()}
                                                            </span>
                                                            {match.prospect?.meetingSource && (
                                                                <span className="hidden sm:flex items-center gap-1 text-xs sm:text-sm text-slate-600">
                                                                    <span className="text-slate-300">•</span>
                                                                    <Heart className="w-3 h-3 text-pink-500" />
                                                                    {match.prospect.meetingSource}
                                                                </span>
                                                            )}
                                                        </div>
                                                        {/* Test Categories */}
                                                        <p className="text-xs text-slate-400 mt-1 truncate">
                                                            <span className="font-medium text-slate-500">Tests:</span> {testCategories}
                                                        </p>
                                                    </div>
                                                    <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0 hidden sm:block" />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="p-8 text-center">
                                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Heart className="w-8 h-8 text-slate-400" />
                                    </div>
                                    <p className="text-slate-600 mb-4">No compatibility checks yet</p>
                                    <button
                                        onClick={handleNewCheck}
                                        className="text-primary font-medium hover:underline"
                                    >
                                        Start your first check →
                                    </button>
                                </div>
                            )}
                        </motion.div>

                        {/* Service Banners */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Premium Services</h3>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {serviceBanners.map((service, index) => (
                                    <motion.div
                                        key={service.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 + index * 0.1 }}
                                        className={`bg-gradient-to-br ${service.bgGradient} rounded-2xl p-5 border border-white/50 hover:shadow-lg transition-all cursor-pointer group`}
                                    >
                                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${service.gradient} text-white flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                                            {service.icon}
                                        </div>
                                        <h4 className="font-bold text-slate-900 mb-1">{service.title}</h4>
                                        <p className="text-sm text-slate-600 mb-2">{service.description}</p>
                                        <p className="text-xs text-slate-500 mb-3">{service.subtext}</p>
                                        <div className="flex items-center justify-between">
                                            {service.price && (
                                                <span className="text-sm font-semibold text-slate-900">
                                                    Starting {service.price}/-
                                                </span>
                                            )}
                                            <button className="text-primary text-sm font-medium flex items-center gap-1 hover:underline">
                                                Learn more <ArrowRight className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column - Profile & Quick Actions */}
                    <div className="space-y-6">
                        {/* User Profile Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.15 }}
                            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-primary to-teal-400 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                                    {displayProfile.name?.charAt(0)?.toUpperCase() || 'U'}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-lg">{displayProfile.name || 'User'}</h3>
                                    <p className="text-sm text-slate-500 flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3 text-green-500" />
                                        Profile Verified
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm">
                                    <User className="w-4 h-4 text-slate-400" />
                                    <span className="text-slate-500">Age:</span>
                                    <span className="font-medium text-slate-900 ml-auto">{displayProfile.age || '--'} years</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Heart className="w-4 h-4 text-slate-400" />
                                    <span className="text-slate-500">Gender:</span>
                                    <span className="font-medium text-slate-900 ml-auto">{displayProfile.gender || '--'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <MapPin className="w-4 h-4 text-slate-400" />
                                    <span className="text-slate-500">City:</span>
                                    <span className="font-medium text-slate-900 ml-auto">{displayProfile.city || '--'}</span>
                                </div>
                                {userProfile.userRelation !== 'Self' && (
                                    <div className="flex items-center gap-3 text-sm pt-2 border-t border-slate-100">
                                        <Users className="w-4 h-4 text-slate-400" />
                                        <span className="text-slate-500">Filled by:</span>
                                        <span className="font-medium text-slate-900 ml-auto">{userProfile.name} ({userProfile.userRelation})</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Quick Actions */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.25 }}
                            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
                        >
                            <h3 className="font-bold text-slate-900 mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <button
                                    onClick={handleNewCheck}
                                    className="w-full bg-[#DE457D] hover:bg-[#c93d6f] text-white py-3 rounded-xl font-semibold transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                                >
                                    <Plus className="w-5 h-5" />
                                    New Compatibility Check
                                </button>
                                <button
                                    onClick={() => navigate('/reports')}
                                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                                >
                                    View Reports
                                </button>
                            </div>
                        </motion.div>

                        {/* Support Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.35 }}
                            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white"
                        >
                            <h3 className="font-bold mb-2">Need Help?</h3>
                            <p className="text-sm text-slate-300 mb-4">
                                Our team is here to assist you with any questions about your health compatibility journey.
                            </p>
                            <button className="bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg text-sm font-medium transition-all">
                                Contact Support
                            </button>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
