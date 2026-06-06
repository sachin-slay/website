import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Heart, ChevronDown, Check, User, Users, Activity, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DatePicker } from "@/components/ui/date-picker";
import { useApp, LifestyleProfile } from '@/context/AppContext';
import LifestyleForm from '@/components/LifestyleForm';
import CitySearch from '@/components/CitySearch';

const USER_RELATIONS = ['Self', 'Parents', 'Siblings', 'Friends', 'Relatives'];

const QuestionnairePage = () => {
    const navigate = useNavigate();
    const { userProfile, candidateProfile, setUserProfile, setCandidateProfile, session } = useApp();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        // User info
        userName: '',
        userRelation: '',
        // Candidate info (person getting married)
        candidateName: '',
        candidateDob: undefined as Date | undefined,
        candidateAge: '',
        candidateGender: '',
        candidateCity: '',
        // Relationship details
        relationshipStatus: '',
        marriageTimeline: '',
        // Lifestyle info
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

    const [isRelationDropdownOpen, setIsRelationDropdownOpen] = useState(false);
    const [isGenderDropdownOpen, setIsGenderDropdownOpen] = useState(false);
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
    const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);

    const relationDropdownRef = React.useRef<HTMLDivElement>(null);
    const genderDropdownRef = React.useRef<HTMLDivElement>(null);
    const statusDropdownRef = React.useRef<HTMLDivElement>(null);
    const timeDropdownRef = React.useRef<HTMLDivElement>(null);

    const hasPrepopulated = React.useRef(false);

    React.useEffect(() => {
        if (session && userProfile.name && !hasPrepopulated.current) {
            // Check if onboarding is already completed
            if (userProfile.lifestyle && userProfile.lifestyle.activityLevel) {
                navigate('/dashboard');
                return;
            }

            hasPrepopulated.current = true;

            const isSelf = userProfile.userRelation === 'Self';
            setFormData({
                userName: isSelf ? userProfile.name : '', // If not self, they'll type it
                userRelation: userProfile.userRelation || '',
                candidateName: isSelf ? userProfile.name : (candidateProfile.name || ''),
                candidateDob: candidateProfile.dob,
                candidateAge: candidateProfile.age || '',
                candidateGender: candidateProfile.gender || '',
                candidateCity: candidateProfile.city || '',
                relationshipStatus: userProfile.relationshipStatus || '',
                marriageTimeline: userProfile.marriageTimeline || '',
                lifestyle: userProfile.lifestyle ? {
                    activityLevel: userProfile.lifestyle.activityLevel || '',
                    dailySteps: userProfile.lifestyle.dailySteps || '',
                    occupation: userProfile.lifestyle.occupation || '',
                    workStyle: userProfile.lifestyle.workStyle || '',
                    drinkingHabit: userProfile.lifestyle.drinkingHabit || '',
                    smokingHabit: userProfile.lifestyle.smokingHabit || '',
                    tobaccoHabit: userProfile.lifestyle.tobaccoHabit || '',
                    sleepPattern: userProfile.lifestyle.sleepPattern || '',
                    height: {
                        value: userProfile.lifestyle.height?.value || '',
                        unit: userProfile.lifestyle.height?.unit || 'cm'
                    },
                    weight: {
                        value: userProfile.lifestyle.weight?.value || '',
                        unit: userProfile.lifestyle.weight?.unit || 'kg'
                    },
                    waistCircumference: {
                        value: userProfile.lifestyle.waistCircumference?.value || '',
                        unit: userProfile.lifestyle.waistCircumference?.unit || 'in'
                    },
                    menstrualCycle: userProfile.lifestyle.menstrualCycle || ''
                } : {
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
                }
            });
        }
    }, [userProfile, candidateProfile, session, navigate]);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (relationDropdownRef.current && !relationDropdownRef.current.contains(event.target as Node)) {
                setIsRelationDropdownOpen(false);
            }
            if (genderDropdownRef.current && !genderDropdownRef.current.contains(event.target as Node)) {
                setIsGenderDropdownOpen(false);
            }
            if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
                setIsStatusDropdownOpen(false);
            }
            if (timeDropdownRef.current && !timeDropdownRef.current.contains(event.target as Node)) {
                setIsTimeDropdownOpen(false);
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

    React.useEffect(() => {
        if (formData.candidateDob) {
            setFormData(prev => ({ ...prev, candidateAge: calculateAge(prev.candidateDob) }));
        }
    }, [formData.candidateDob]);

    const handleSubmit = async () => {
        if (!session?.access_token) {
            setError("You must be logged in to save your profile.");
            return;
        }

        setLoading(true);
        setError(null);

        const payload = {
            name: formData.userRelation === 'Self' ? formData.userName : formData.candidateName,
            dob: formData.candidateDob,
            age: formData.candidateAge,
            gender: formData.candidateGender,
            city: formData.candidateCity,
            relationshipStatus: formData.relationshipStatus,
            marriageTimeline: formData.marriageTimeline,
            userRelation: formData.userRelation,
            lifestyle: formData.lifestyle
        };

        try {
            const response = await fetch("http://localhost:4000/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session.access_token}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || "Failed to save profile.");
            }

            // Save to local context for fast UI access
            setUserProfile(payload as any);
            setCandidateProfile({
                name: formData.candidateName,
                dob: formData.candidateDob,
                age: formData.candidateAge,
                gender: formData.candidateGender as any,
                city: formData.candidateCity
            });

            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const isFormValid = () => {
        const hasUserInfo = formData.userName && formData.userRelation;
        const hasCandidateInfo = formData.candidateName && formData.candidateDob && formData.candidateGender && formData.candidateCity;
        const hasRelationshipInfo = formData.relationshipStatus && formData.marriageTimeline;
        const hasLifestyleInfo = formData.lifestyle.activityLevel && formData.lifestyle.occupation;
        return hasUserInfo && hasCandidateInfo && hasRelationshipInfo && hasLifestyleInfo;
    };

    const isSelf = formData.userRelation === 'Self';

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl mx-auto">
                {/* Step 1: Your Information */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 mb-6"
                >
                    <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <User className="w-6 h-6 text-primary" />
                        Tell us about yourself
                    </h2>

                    <div className="space-y-5">
                        {/* Your Name */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Your Name</label>
                            <input
                                type="text"
                                value={formData.userName}
                                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                                placeholder="Enter your name"
                                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                            />
                        </div>

                        {/* Your Relation */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Who are you in relation to the person getting married?
                            </label>
                            <div className="relative" ref={relationDropdownRef}>
                                <button
                                    type="button"
                                    className="w-full p-3 text-left border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white flex justify-between items-center"
                                    onClick={() => setIsRelationDropdownOpen(!isRelationDropdownOpen)}
                                >
                                    <span className={cn(!formData.userRelation && "text-slate-500")}>
                                        {formData.userRelation || "Select your relation"}
                                    </span>
                                    <ChevronDown className={cn("w-5 h-5 text-slate-400 transition-transform", isRelationDropdownOpen && "rotate-180")} />
                                </button>
                                <AnimatePresence>
                                    {isRelationDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden"
                                        >
                                            {USER_RELATIONS.map((relation) => (
                                                <button
                                                    key={relation}
                                                    type="button"
                                                    className="w-full px-4 py-3 text-left hover:bg-slate-50 flex items-center justify-between"
                                                    onClick={() => {
                                                        setFormData({
                                                            ...formData,
                                                            userRelation: relation,
                                                            candidateName: relation === 'Self' ? formData.userName : formData.candidateName
                                                        });
                                                        setIsRelationDropdownOpen(false);
                                                    }}
                                                >
                                                    <span className={cn("font-medium", formData.userRelation === relation ? "text-primary" : "text-slate-700")}>
                                                        {relation}
                                                    </span>
                                                    {formData.userRelation === relation && <Check className="w-4 h-4 text-primary" />}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Step 2: Candidate Information (Person Getting Married) */}
                <AnimatePresence>
                    {formData.userRelation && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 mb-6"
                        >
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <Heart className="w-6 h-6 text-pink-500" />
                                {isSelf ? 'Your Details' : 'Details of the person getting married'}
                            </h2>

                            <div className="space-y-5">
                                {/* Candidate Name */}
                                {!isSelf && (
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                                        <input
                                            type="text"
                                            value={formData.candidateName}
                                            onChange={(e) => setFormData({ ...formData, candidateName: e.target.value })}
                                            placeholder="Enter their name"
                                            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                        />
                                    </div>
                                )}

                                {/* Gender */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Gender</label>
                                    <div className="relative" ref={genderDropdownRef}>
                                        <button
                                            type="button"
                                            className="w-full p-3 text-left border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white flex justify-between items-center"
                                            onClick={() => setIsGenderDropdownOpen(!isGenderDropdownOpen)}
                                        >
                                            <span className={cn(!formData.candidateGender && "text-slate-500")}>
                                                {formData.candidateGender || "Select Gender"}
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
                                                    {["Male", "Female", "Other"].map((gender) => (
                                                        <button
                                                            key={gender}
                                                            type="button"
                                                            className="w-full px-4 py-3 text-left hover:bg-slate-50 flex items-center justify-between"
                                                            onClick={() => {
                                                                setFormData({ ...formData, candidateGender: gender });
                                                                setIsGenderDropdownOpen(false);
                                                            }}
                                                        >
                                                            <span className={cn("font-medium", formData.candidateGender === gender ? "text-primary" : "text-slate-700")}>
                                                                {gender}
                                                            </span>
                                                            {formData.candidateGender === gender && <Check className="w-4 h-4 text-primary" />}
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                {/* Date of Birth */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Date of Birth</label>
                                    <DatePicker
                                        value={formData.candidateDob}
                                        onChange={(date) => setFormData({ ...formData, candidateDob: date })}
                                        fromYear={1960}
                                        toYear={new Date().getFullYear() - 18}
                                        placeholder="Pick date of birth"
                                    />
                                    {formData.candidateAge && (
                                        <p className="mt-2 text-sm text-slate-600 bg-slate-50 p-2 rounded inline-block">
                                            Age: <span className="font-semibold text-slate-900">{formData.candidateAge} years</span>
                                        </p>
                                    )}
                                </div>

                                {/* City */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">City</label>
                                    <CitySearch
                                        value={formData.candidateCity}
                                        onChange={(city) => setFormData({ ...formData, candidateCity: city })}
                                        placeholder="Search city"
                                    />
                                </div>

                                {/* Relationship Status */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Relationship Status</label>
                                    <div className="relative" ref={statusDropdownRef}>
                                        <button
                                            type="button"
                                            className="w-full p-3 text-left border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white flex justify-between items-center"
                                            onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                                        >
                                            <span className={cn(!formData.relationshipStatus && "text-slate-500")}>
                                                {formData.relationshipStatus || "Select Status"}
                                            </span>
                                            <ChevronDown className={cn("w-5 h-5 text-slate-400 transition-transform", isStatusDropdownOpen && "rotate-180")} />
                                        </button>
                                        <AnimatePresence>
                                            {isStatusDropdownOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden"
                                                >
                                                    {["Single", "Engaged", "In a Relationship"].map((status) => (
                                                        <button
                                                            key={status}
                                                            type="button"
                                                            className="w-full px-4 py-3 text-left hover:bg-slate-50 flex items-center justify-between"
                                                            onClick={() => {
                                                                setFormData({ ...formData, relationshipStatus: status });
                                                                setIsStatusDropdownOpen(false);
                                                            }}
                                                        >
                                                            <span className={cn("font-medium", formData.relationshipStatus === status ? "text-primary" : "text-slate-700")}>
                                                                {status}
                                                            </span>
                                                            {formData.relationshipStatus === status && <Check className="w-4 h-4 text-primary" />}
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                {/* Marriage Timeline */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">When is the marriage planned?</label>
                                    <div className="relative" ref={timeDropdownRef}>
                                        <button
                                            type="button"
                                            className="w-full p-3 text-left border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white flex justify-between items-center"
                                            onClick={() => setIsTimeDropdownOpen(!isTimeDropdownOpen)}
                                        >
                                            <span className={cn(!formData.marriageTimeline && "text-slate-500")}>
                                                {formData.marriageTimeline || "Select Timeline"}
                                            </span>
                                            <ChevronDown className={cn("w-5 h-5 text-slate-400 transition-transform", isTimeDropdownOpen && "rotate-180")} />
                                        </button>
                                        <AnimatePresence>
                                            {isTimeDropdownOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden"
                                                >
                                                    {["Within 6 months", "6 - 12 months", "1 - 2 years", "2+ years", "Not sure yet"].map((option) => (
                                                        <button
                                                            key={option}
                                                            type="button"
                                                            className="w-full px-4 py-3 text-left hover:bg-slate-50 flex items-center justify-between"
                                                            onClick={() => {
                                                                setFormData({ ...formData, marriageTimeline: option });
                                                                setIsTimeDropdownOpen(false);
                                                            }}
                                                        >
                                                            <span className={cn("font-medium", formData.marriageTimeline === option ? "text-primary" : "text-slate-700")}>
                                                                {option}
                                                            </span>
                                                            {formData.marriageTimeline === option && <Check className="w-4 h-4 text-primary" />}
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Step 3: Lifestyle & Habits */}
                <AnimatePresence>
                    {formData.relationshipStatus && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 mb-6"
                        >
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <Activity className="w-6 h-6 text-green-500" />
                                Lifestyle & Habits
                            </h2>

                            <LifestyleForm
                                data={formData.lifestyle}
                                onChange={(data) => setFormData({ ...formData, lifestyle: data })}
                                gender={formData.candidateGender}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {error && (
                    <div className="mb-6 p-4 bg-rose-50 text-rose-600 rounded-lg border border-rose-100 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}

                <div className="flex justify-end">
                    <button
                        onClick={handleSubmit}
                        disabled={!isFormValid() || loading}
                        className="bg-[#DE457D] hover:bg-[#c93d6f] text-white px-8 py-3 rounded-full font-semibold shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
                    >
                        {loading ? 'Saving...' : 'Continue'}
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuestionnairePage;
