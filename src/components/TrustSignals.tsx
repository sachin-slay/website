import React from 'react';
import { Shield, Lock, Users, Award, Check, Star } from 'lucide-react';

interface TrustSignalsProps {
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
}

export const TrustSignals = ({ variant = 'default', className = '' }: TrustSignalsProps) => {
  const signals = [
    {
      icon: Lock,
      text: '100% Private & Encrypted',
      detail: 'Your health data is secure',
      color: 'text-green-600'
    },
    {
      icon: Shield,
      text: 'HIPAA Compliant',
      detail: 'Medical-grade privacy',
      color: 'text-blue-600'
    },
    {
      icon: Users,
      text: '450+ Verified Reviews',
      detail: '4.8/5 rating from couples',
      color: 'text-purple-600'
    },
    {
      icon: Award,
      text: 'Doctor Verified',
      detail: 'All reports reviewed by MDs',
      color: 'text-orange-600'
    },
  ];

  // Compact variant - for below CTAs (horizontal badges)
  if (variant === 'compact') {
    return (
      <div className={`flex flex-wrap justify-center gap-4 text-xs text-slate-500 ${className}`}>
        {signals.map((signal, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <signal.icon className="w-3.5 h-3.5" />
            {signal.text}
          </span>
        ))}
      </div>
    );
  }

  // Detailed variant - for dedicated trust sections
  if (variant === 'detailed') {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 ${className}`}>
        {signals.map((signal, i) => (
          <div key={i} className="text-center">
            <div className={`w-16 h-16 mx-auto mb-3 rounded-full bg-slate-50 flex items-center justify-center ${signal.color}`}>
              <signal.icon className="w-8 h-8" />
            </div>
            <h4 className="font-semibold text-sm mb-1">{signal.text}</h4>
            <p className="text-xs text-slate-500">{signal.detail}</p>
          </div>
        ))}
      </div>
    );
  }

  // Default variant - horizontal cards with icons
  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}>
      {signals.map((signal, i) => (
        <div key={i} className="flex items-center gap-3 bg-white p-4 rounded-lg border border-slate-200 hover:border-primary/30 transition-colors">
          <div className={`w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center ${signal.color}`}>
            <signal.icon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">{signal.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

// Additional pre-built trust signal components for specific use cases

export const QuickTrustBadges = () => (
  <div className="flex flex-wrap justify-start gap-3 text-base lg:text-lg">
    <span className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full font-medium">
      <Check className="w-5 h-5" />
      100% Private
    </span>
    <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-medium">
      <Shield className="w-5 h-5" />
      HIPAA Compliant
    </span>
    <span className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-full font-medium">
      <Award className="w-5 h-5" />
      Genetic Counselor Reviewed
    </span>
  </div>
);

export const InlineTrustText = () => (
  <p className="text-sm text-slate-500 text-center">
    ✓ 100% Private & Encrypted &nbsp;•&nbsp; ✓ HIPAA Compliant &nbsp;•&nbsp; ✓ 450+ Verified Reviews
  </p>
);
