import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, User, Users, Heart, ChevronDown, Check, Lock, AlertCircle } from 'lucide-react';
import { useApp, LifestyleProfile } from '@/context/AppContext';
import { DatePicker } from '@/components/ui/date-picker';
import LifestyleForm from '@/components/LifestyleForm';
import CitySearch from '@/components/CitySearch';
import { cn } from '@/lib/utils';

const MATRIMONIAL_PLATFORMS = [
    "Shaadi.com",
    "BharatMatrimony",
    "Jeevansathi",
    "Tamil Matrimony",
    "Telugu Matrimony",
    "Kannada Matrimony",
    "Marathi Matrimony",
    "Bengali Matrimony",
    "Punjabi Matrimony",
    "Elite Matrimony",
    "CommunityMatrimony",
    "Anuroop",
    "Vivah",
    "Other"
];

const AddProspectPage = () => {
    const navigate = useNavigate();
    const { userProfile, candidateProfile, currentProspect, setCurrentProspect, addMatch, session } = useApp();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Determine the person getting married (candidate or self)
    const displayProfile = userProfile.userRelation === 'Self' ? {
        name: userProfile.name,
        dob: userProfile.dob,
        age: userProfile.age,
        gender: userProfile.gender,
        city: userProfile.city
    } : candidateProfile;

    const [prospectData, setProspectData] = useState({
        name: currentProspect.name || '',
        dob: currentProspect.dob,
        age: currentProspect.age || '',
        gender: currentProspect.gender || '',
        city: currentProspect.city || '',
        meetingSource: currentProspect.meetingSource || '',
        platformName: currentProspect.platformName || '',
        meetingStory: '',
        lifestyle: {
            activityLevel: '',
            dailySteps: '',
            occupation: '',
            workStyle: '',
            drinkingHabit: '',
            smokingHabit: '',
            tobaccoHabit: '',
            sleepPattern: '',
            height: { value: '', unit: 'cm' },
            weight: { value: '', unit: 'kg' },
            waistCircumference: { value: '', unit: 'in' },
            menstrualCycle: ''
        } as LifestyleProfile
    });

    const [isGenderDropdownOpen, setIsGenderDropdownOpen] = useState(false);
    const [isMeetingDropdownOpen, setIsMeetingDropdownOpen] = useState(false);
    const [isPlatformDropdownOpen, setIsPlatformDropdownOpen] = useState(false);
    const genderDropdownRef = React.useRef<HTMLDivElement>(null);
    const meetingDropdownRef = React.useRef<HTMLDivElement>(null);
    const platformDropdownRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (genderDropdownRef.current && !genderDropdownRef.current.contains(event.target as Node)) {
                setIsGenderDropdownOpen(false);
            }
            if (meetingDropdownRef.current && !meetingDropdownRef.current.contains(event.target as Node)) {
                setIsMeetingDropdownOpen(false);
            }
            if (platformDropdownRef.current && !platformDropdownRef.current.contains(event.target as Node)) {
                setIsPlatformDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const calculateAge = (dob: Date | undefined) => {
        if (!dob) return '';
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
            age--;
        }
        return age.toString();
    };

    useEffect(() => {
        if (prospectData.dob) {
            setProspectData(prev => ({ ...prev, age: calculateAge(prev.dob) }));
        }
    }, [prospectData.dob]);

    const isFormValid = () => {
        return prospectData.name && prospectData.dob && prospectData.gender && prospectData.city && prospectData.meetingSource &&
            (prospectData.meetingSource !== 'Matrimonial Platform' || prospectData.platformName);
    };

    const handleSubmit = async () => {
        if (!session?.access_token) {
            setError("You must be logged in to create a match.");
            return;
        }

        setLoading(true);
        setError(null);

        const payload = {
            name: prospectData.name,
            dob: prospectData.dob,
            age: prospectData.age,
            gender: prospectData.gender,
            city: prospectData.city,
            meetingSource: prospectData.meetingSource,
            platformName: prospectData.platformName,
            lifestyle: prospectData.lifestyle
        };

        try {
            const response = await fetch("http://localhost:4000/api/matches", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session.access_token}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || "Failed to create match.");
            }

            const data = await response.json();

            // Store in local context if still needed, though Dashboard fetches from backend
            setCurrentProspect(payload as any);
            addMatch(displayProfile, payload as any);

            // Navigate to the newly created match report
            navigate(`/report/${data.id}`);
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">
                        New Compatibility Check
                    </h1>
                    <p className="text-slate-600">
                        Add your prospect's details to begin
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Your Information (Locked) */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
                    >
                        <div className="flex items-center gap-2 mb-6">
                            <User className="w-5 h-5 text-primary" />
                            <h2 className="text-lg font-bold text-slate-900">Your Information</h2>
                            <Lock className="w-4 h-4 text-slate-400 ml-auto" />
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-500 mb-1">Name</label>
                                <div className="p-3 bg-slate-50 rounded-lg text-slate-700 border border-slate-200">
                                    {userProfile.name || 'Not provided'}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-500 mb-1">Date of Birth</label>
                                <div className="p-3 bg-slate-50 rounded-lg text-slate-700 border border-slate-200">
                                    {userProfile.dob ? userProfile.dob.toLocaleDateString('en-US', {
                                        year: 'numeric', month: 'long', day: 'numeric'
                                    }) : 'Not provided'}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-slate-500 mb-1">Age</label>
                                    <div className="p-3 bg-slate-50 rounded-lg text-slate-700 border border-slate-200">
                                        {userProfile.age ? `${userProfile.age} yrs` : '--'}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-500 mb-1">Gender</label>
                                    <div className="p-3 bg-slate-50 rounded-lg text-slate-700 border border-slate-200">
                                        {userProfile.gender || '--'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Prospect Information */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
                    >
                        <div className="flex items-center gap-2 mb-6">
                            <Users className="w-5 h-5 text-pink-500" />
                            <h2 className="text-lg font-bold text-slate-900">Prospect Information</h2>
                        </div>

                        <div className="space-y-4">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    value={prospectData.name}
                                    onChange={(e) => setProspectData({ ...prospectData, name: e.target.value })}
                                    placeholder="Enter prospect's name"
                                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                />
                            </div>

                            {/* Gender Dropdown */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                                <div className="relative" ref={genderDropdownRef}>
                                    <button
                                        type="button"
                                        className="w-full p-3 text-left border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white flex justify-between items-center"
                                        onClick={() => setIsGenderDropdownOpen(!isGenderDropdownOpen)}
                                    >
                                        <span className={cn(!prospectData.gender && "text-slate-400")}>
                                            {prospectData.gender || "Select Gender"}
                                        </span>
                                        <ChevronDown className={cn("w-5 h-5 text-slate-400 transition-transform", isGenderDropdownOpen && "rotate-180")} />
                                    </button>
                                    <AnimatePresence>
                                        {isGenderDropdownOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden"
                                            >
                                                {["Male", "Female", "Other"].map((g) => (
                                                    <button
                                                        key={g}
                                                        type="button"
                                                        className="w-full px-4 py-3 text-left hover:bg-slate-50 flex items-center justify-between"
                                                        onClick={() => {
                                                            setProspectData({ ...prospectData, gender: g });
                                                            setIsGenderDropdownOpen(false);
                                                        }}
                                                    >
                                                        <span className={cn("font-medium", prospectData.gender === g ? "text-primary" : "text-slate-700")}>{g}</span>
                                                        {prospectData.gender === g && <Check className="w-4 h-4 text-primary" />}
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Date of Birth */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth</label>
                                <DatePicker
                                    value={prospectData.dob}
                                    onChange={(date) => setProspectData({ ...prospectData, dob: date })}
                                    fromYear={1960}
                                    toYear={new Date().getFullYear() - 18}
                                    placeholder="Pick date of birth"
                                />
                                {prospectData.age && (
                                    <p className="mt-2 text-sm text-slate-600 bg-slate-50 p-2 rounded inline-block">
                                        Age: <span className="font-semibold text-slate-900">{prospectData.age} years</span>
                                    </p>
                                )}
                            </div>

                            {/* City */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                                <CitySearch
                                    value={prospectData.city}
                                    onChange={(city) => setProspectData({ ...prospectData, city })}
                                    placeholder="Search city"
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* How Did You Meet Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mt-6"
                >
                    <div className="flex items-center gap-2 mb-6">
                        <Heart className="w-5 h-5 text-red-500" />
                        <h2 className="text-lg font-bold text-slate-900">How did you meet?</h2>
                    </div>

                    <div className="relative" ref={meetingDropdownRef}>
                        <button
                            type="button"
                            className="w-full p-3 text-left border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white flex justify-between items-center"
                            onClick={() => setIsMeetingDropdownOpen(!isMeetingDropdownOpen)}
                        >
                            <span className={cn(!prospectData.meetingSource && "text-slate-400")}>
                                {prospectData.meetingSource || "Select how you met"}
                            </span>
                            <ChevronDown className={cn("w-5 h-5 text-slate-400 transition-transform", isMeetingDropdownOpen && "rotate-180")} />
                        </button>
                        <AnimatePresence>
                            {isMeetingDropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden"
                                >
                                    {["Family Introduction", "Matrimonial Platform", "Work/College", "Friends", "Other"].map((source) => (
                                        <button
                                            key={source}
                                            type="button"
                                            className="w-full px-4 py-3 text-left hover:bg-slate-50 flex items-center justify-between"
                                            onClick={() => {
                                                setProspectData({ ...prospectData, meetingSource: source, platformName: source !== 'Matrimonial Platform' ? '' : prospectData.platformName });
                                                setIsMeetingDropdownOpen(false);
                                            }}
                                        >
                                            <span className={cn("font-medium", prospectData.meetingSource === source ? "text-primary" : "text-slate-700")}>{source}</span>
                                            {prospectData.meetingSource === source && <Check className="w-4 h-4 text-primary" />}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Platform Name Dropdown (conditional) */}
                    <AnimatePresence>
                        {prospectData.meetingSource === 'Matrimonial Platform' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-4"
                            >
                                <label className="block text-sm font-medium text-slate-700 mb-1">Platform Name</label>
                                <div className="relative" ref={platformDropdownRef}>
                                    <button
                                        type="button"
                                        className="w-full p-3 text-left border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white flex justify-between items-center"
                                        onClick={() => setIsPlatformDropdownOpen(!isPlatformDropdownOpen)}
                                    >
                                        <span className={cn(!prospectData.platformName && "text-slate-400")}>
                                            {prospectData.platformName || "Select platform"}
                                        </span>
                                        <ChevronDown className={cn("w-5 h-5 text-slate-400 transition-transform", isPlatformDropdownOpen && "rotate-180")} />
                                    </button>
                                    <AnimatePresence>
                                        {isPlatformDropdownOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden max-h-60 overflow-y-auto"
                                            >
                                                {MATRIMONIAL_PLATFORMS.map((platform) => (
                                                    <button
                                                        key={platform}
                                                        type="button"
                                                        className="w-full px-4 py-3 text-left hover:bg-slate-50 flex items-center justify-between"
                                                        onClick={() => {
                                                            setProspectData({ ...prospectData, platformName: platform });
                                                            setIsPlatformDropdownOpen(false);
                                                        }}
                                                    >
                                                        <span className={cn("font-medium", prospectData.platformName === platform ? "text-primary" : "text-slate-700")}>{platform}</span>
                                                        {prospectData.platformName === platform && <Check className="w-4 h-4 text-primary" />}
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Tell us your story */}
                    <AnimatePresence>
                        {prospectData.meetingSource && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-4"
                            >
                                <label className="block text-sm font-medium text-slate-700 mb-1">Tell us your story (optional)</label>
                                <textarea
                                    value={prospectData.meetingStory}
                                    onChange={(e) => setProspectData({ ...prospectData, meetingStory: e.target.value })}
                                    placeholder="Share how you met, what drew you together, or anything special about your connection..."
                                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none h-24"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Lifestyle Information */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mt-6"
                >
                    <div className="flex items-center gap-2 mb-6">
                        <User className="w-5 h-5 text-green-500" />
                        <h2 className="text-lg font-bold text-slate-900">Lifestyle & Habits</h2>
                    </div>

                    <LifestyleForm
                        data={prospectData.lifestyle}
                        onChange={(newLifestyle) => setProspectData({ ...prospectData, lifestyle: newLifestyle })}
                    />
                </motion.div>

                {error && (
                    <div className="mt-6 p-4 bg-rose-50 text-rose-600 rounded-lg border border-rose-100 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="mt-8 flex justify-between items-center">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!isFormValid() || loading}
                        className="bg-[#DE457D] hover:bg-[#c93d6f] text-white px-8 py-3 rounded-full font-semibold shadow-lg shadow-pink-500/25 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
                    >
                        {loading ? 'Generating...' : 'Generate Insights'}
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddProspectPage;
