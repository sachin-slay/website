import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, ArrowRight, ShieldCheck, ArrowLeft, Heart, Sparkles, Shield, Users, Lock, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const ONBOARDING_BANNERS = [
    {
        id: 1,
        badge: "Why This Matters",
        title: "Before Marriage, Know What Truly Matters.",
        description: "Get a science-backed health compatibility score designed for modern relationships.",
        subtext: "Trusted, private, and clinically guided.",
        icon: <Heart className="w-6 h-6" />,
        gradient: "from-rose-500 to-pink-600"
    },
    {
        id: 2,
        badge: "What You'll Get",
        title: "Your Compatibility Score. Clear, Honest, Personal.",
        description: "We analyse genetics, fertility markers, chronic health & lifestyle alignment.",
        subtext: "Built for couples who want clarity before commitment.",
        icon: <Sparkles className="w-6 h-6" />,
        gradient: "from-primary to-teal-500"
    },
    {
        id: 3,
        badge: "Why You Can Trust Us",
        title: "Tests Powered by NABL-Certified Labs & Expert Doctors.",
        description: "A controlled, secure environment for accurate results you can rely on.",
        subtext: "Avoid fake or inconsistent reports — get reliable clarity.",
        icon: <Shield className="w-6 h-6" />,
        gradient: "from-blue-500 to-indigo-600"
    },
    {
        id: 4,
        badge: "Your Privacy, Your Control",
        title: "Share Results Only When You're Ready.",
        description: "Full control. Private by default. Invite your partner later — or continue solo.",
        subtext: "Your data stays yours.",
        icon: <Lock className="w-6 h-6" />,
        gradient: "from-violet-500 to-purple-600"
    },
    {
        id: 5,
        badge: "Start Today",
        title: "Clarity Today. Confidence for a Lifetime.",
        description: "Make marriage decisions with science — not assumptions.",
        subtext: "Begin your journey in minutes.",
        icon: <Users className="w-6 h-6" />,
        gradient: "from-amber-500 to-orange-600"
    }
];

const LoginPage = () => {
    const navigate = useNavigate();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [step, setStep] = useState<'phone' | 'otp'>('phone');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [currentBanner, setCurrentBanner] = useState(0);
    const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Auto-rotate banners
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBanner((prev) => (prev + 1) % ONBOARDING_BANNERS.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const handlePhoneSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (phoneNumber.length >= 10) {
            setStep('otp');
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) {
            value = value.slice(-1);
        }

        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            otpInputRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpInputRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const enteredOtp = otp.join('');
        if (enteredOtp.length >= 1) {
            navigate('/questionnaire');
        }
    };

    const handleBack = () => {
        setStep('phone');
        setOtp(['', '', '', '', '', '']);
    };

    useEffect(() => {
        if (step === 'otp') {
            otpInputRefs.current[0]?.focus();
        }
    }, [step]);

    const goToBanner = (index: number) => {
        setCurrentBanner(index);
    };

    const banner = ONBOARDING_BANNERS[currentBanner];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex">
            {/* Left Side - Onboarding Banners (Desktop) */}
            <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-12 xl:px-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00eiIvPjwvZz48L2c+PC9zdmc+')]" />
                </div>

                {/* Floating Gradient Orbs */}
                <div className="absolute top-20 left-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-10 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl" />

                <div className="relative z-10 max-w-lg">
                    {/* Banner Content */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={banner.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className="text-white"
                        >
                            {/* Badge */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 }}
                                className={cn(
                                    "inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6",
                                    "bg-gradient-to-r", banner.gradient,
                                    "shadow-lg"
                                )}
                            >
                                {banner.icon}
                                <span className="font-semibold text-sm">{banner.badge}</span>
                            </motion.div>

                            {/* Title */}
                            <motion.h2
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-4xl xl:text-5xl font-bold leading-tight mb-6"
                            >
                                {banner.title}
                            </motion.h2>

                            {/* Description */}
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-xl text-slate-300 mb-4 leading-relaxed"
                            >
                                {banner.description}
                            </motion.p>

                            {/* Subtext */}
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-slate-400 text-lg"
                            >
                                {banner.subtext}
                            </motion.p>
                        </motion.div>
                    </AnimatePresence>

                    {/* Pagination Dots */}
                    <div className="flex items-center gap-3 mt-12">
                        {ONBOARDING_BANNERS.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToBanner(index)}
                                className={cn(
                                    "h-2 rounded-full transition-all duration-300",
                                    currentBanner === index
                                        ? "w-8 bg-white"
                                        : "w-2 bg-white/30 hover:bg-white/50"
                                )}
                            />
                        ))}
                    </div>

                    {/* Navigation Arrows */}
                    <div className="flex items-center gap-3 mt-6">
                        <button
                            onClick={() => setCurrentBanner((prev) => (prev - 1 + ONBOARDING_BANNERS.length) % ONBOARDING_BANNERS.length)}
                            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5 text-white" />
                        </button>
                        <button
                            onClick={() => setCurrentBanner((prev) => (prev + 1) % ONBOARDING_BANNERS.length)}
                            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                        >
                            <ChevronRight className="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-12 xl:px-20">
                {/* Mobile Banner (Shown above form on mobile) */}
                <div className="lg:hidden mb-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={banner.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className={cn(
                                "bg-gradient-to-r p-6 rounded-2xl text-white",
                                banner.gradient
                            )}
                        >
                            <div className="flex items-center gap-2 mb-3">
                                {banner.icon}
                                <span className="font-semibold text-sm opacity-90">{banner.badge}</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2">{banner.title}</h3>
                            <p className="text-sm opacity-90">{banner.description}</p>
                        </motion.div>
                    </AnimatePresence>

                    {/* Mobile Dots */}
                    <div className="flex justify-center items-center gap-2 mt-4">
                        {ONBOARDING_BANNERS.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToBanner(index)}
                                className={cn(
                                    "h-1.5 rounded-full transition-all duration-300",
                                    currentBanner === index
                                        ? "w-6 bg-slate-800"
                                        : "w-1.5 bg-slate-300"
                                )}
                            />
                        ))}
                    </div>
                </div>

                <div className="w-full max-w-md mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-8"
                    >
                        <h2 className="text-3xl font-bold text-slate-900">
                            {step === 'phone' ? 'Start Your Journey' : 'Verify Your Number'}
                        </h2>
                        <p className="mt-2 text-slate-600">
                            {step === 'phone'
                                ? 'Secure, private, and designed for couples.'
                                : `We've sent a code to +91 ${phoneNumber}`
                            }
                        </p>
                    </motion.div>

                    <AnimatePresence mode="wait">
                        {step === 'phone' ? (
                            <motion.div
                                key="phone-step"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-slate-100"
                            >
                                <form className="space-y-6" onSubmit={handlePhoneSubmit}>
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-2">
                                            Mobile Number
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <span className="text-slate-500 font-semibold">+91</span>
                                            </div>
                                            <input
                                                type="tel"
                                                name="phone"
                                                id="phone"
                                                className="block w-full pl-14 pr-4 py-4 text-lg border-2 border-slate-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                                                placeholder="98765 43210"
                                                value={phoneNumber}
                                                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={phoneNumber.length < 10}
                                        className="w-full flex justify-center items-center gap-3 py-4 px-6 rounded-xl text-white bg-[#25D366] hover:bg-[#22c55e] font-semibold text-lg shadow-lg shadow-green-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                                    >
                                        <MessageCircle className="w-6 h-6" />
                                        Send OTP via WhatsApp
                                    </button>

                                    <p className="text-xs text-center text-slate-500">
                                        We'll send a verification code to your WhatsApp.
                                    </p>
                                </form>

                                <div className="mt-8">
                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-slate-200" />
                                        </div>
                                        <div className="relative flex justify-center text-sm">
                                            <span className="px-4 bg-white text-slate-500 font-medium">
                                                Why WhatsApp?
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-6 space-y-3">
                                        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                                            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <ShieldCheck className="w-5 h-5 text-white" />
                                            </div>
                                            <span className="text-sm text-slate-700 font-medium">
                                                End-to-end encrypted reports delivered directly to you.
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="otp-step"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-slate-100"
                            >
                                <form className="space-y-6" onSubmit={handleOtpSubmit}>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-4 text-center">
                                            Enter 6-digit OTP
                                        </label>
                                        <div className="flex justify-center gap-3">
                                            {otp.map((digit, index) => (
                                                <input
                                                    key={index}
                                                    ref={(el) => { otpInputRefs.current[index] = el; }}
                                                    type="text"
                                                    inputMode="numeric"
                                                    maxLength={1}
                                                    value={digit}
                                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                                    className="w-12 h-14 text-center text-2xl font-bold border-2 border-slate-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                                                />
                                            ))}
                                        </div>
                                        <p className="mt-3 text-xs text-center text-slate-500">
                                            Enter any OTP to continue (demo mode)
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <button
                                            type="submit"
                                            className="w-full flex justify-center items-center gap-2 py-4 px-6 rounded-xl text-white bg-[#25D366] hover:bg-[#22c55e] font-semibold text-lg shadow-lg shadow-green-500/25 transition-all"
                                        >
                                            Verify & Continue
                                            <ArrowRight className="w-5 h-5" />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleBack}
                                            className="w-full flex justify-center items-center gap-2 py-3 px-6 rounded-xl border-2 border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-all"
                                        >
                                            <ArrowLeft className="w-4 h-4" />
                                            Change Number
                                        </button>
                                    </div>
                                </form>

                                <div className="mt-6 text-center">
                                    <p className="text-sm text-slate-500">
                                        Didn't receive the code?{' '}
                                        <button className="text-primary font-semibold hover:underline">
                                            Resend OTP
                                        </button>
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Trust Badges */}
                    <div className="mt-8 flex justify-center items-center gap-6 text-xs text-slate-400">
                        <div className="flex items-center gap-1">
                            <Shield className="w-4 h-4" />
                            <span>256-bit SSL</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Lock className="w-4 h-4" />
                            <span>HIPAA Compliant</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <ShieldCheck className="w-4 h-4" />
                            <span>NABL Certified</span>
                        </div>
                    </div>

                    {/* What Happens Next */}
                    <div className="mt-10 bg-slate-50 rounded-2xl p-6 border border-slate-100">
                        <h3 className="text-sm font-bold text-slate-800 mb-4 text-center uppercase tracking-wider">What happens next?</h3>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">1</div>
                                <div>
                                    <p className="text-sm font-medium text-slate-700">Quick Health Questionnaire</p>
                                    <p className="text-xs text-slate-500">5 minutes - lifestyle, family history, basics</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">2</div>
                                <div>
                                    <p className="text-sm font-medium text-slate-700">Get Your Personalized Plan</p>
                                    <p className="text-xs text-slate-500">AI recommends tests based on your profile</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">3</div>
                                <div>
                                    <p className="text-sm font-medium text-slate-700">Book & Get Tested</p>
                                    <p className="text-xs text-slate-500">NABL-certified labs near you, results in 48hrs</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">✓</div>
                                <div>
                                    <p className="text-sm font-medium text-slate-700">Your Compatibility Report</p>
                                    <p className="text-xs text-slate-500">Doctor-reviewed insights delivered privately</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
