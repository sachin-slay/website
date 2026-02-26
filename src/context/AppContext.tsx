import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'hi' | 'bn' | 'te' | 'ta' | 'gu' | 'kn' | 'mr' | 'pa' | 'ur';
type ViewingMode = 'candidate' | 'parent' | 'counselor' | 'couple';
type Gender = 'Male' | 'Female' | 'Other' | '';
type MeetingSource = 'Family Introduction' | 'Matrimonial Platform' | 'Work/College' | 'Friends' | 'Other' | '';
type UserRelation = 'Self' | 'Parents' | 'Siblings' | 'Friends' | 'Relatives' | '';

export interface LifestyleProfile {
    activityLevel: 'Sedentary' | 'Moderate' | 'Active' | 'Athletic' | '';
    dailySteps: string;
    occupation: string;
    workStyle: 'Sitting 8h+' | 'Sitting 4h+' | 'Travelling' | 'Other' | '';
    drinkingHabit: 'Never' | 'Socially' | 'Regularly' | 'Heavily' | '';
    smokingHabit: 'Never' | 'Occasional' | 'Regular' | 'Chain' | '';
    tobaccoHabit: 'Never' | 'Occasional' | 'Regular' | '';
    sleepPattern: 'Early Bird' | 'Night Owl' | 'Irregular' | 'Insomniac' | '';
    height: { value: string; unit: 'cm' | 'ft' };
    weight: { value: string; unit: 'kg' | 'lbs' };
    waistCircumference: { value: string; unit: 'in' | 'cm' };
    menstrualCycle: 'Regular' | 'Irregular' | 'PCOS/PCOD' | 'Menopause' | 'Prefer not to say' | '';
}

interface UserProfile {
    name: string;
    dob: Date | undefined;
    age: string;
    gender: Gender;
    city: string;
    relationshipStatus: string;
    marriageTimeline: string;
    userRelation: UserRelation;
    lifestyle?: LifestyleProfile;
}

interface CandidateProfile {
    name: string;
    dob: Date | undefined;
    age: string;
    gender: Gender;
    city: string;
}

interface ProspectProfile {
    name: string;
    dob: Date | undefined;
    age: string;
    gender: Gender;
    city: string;
    meetingSource: MeetingSource;
    platformName: string;
    lifestyle?: LifestyleProfile;
}

interface Match {
    id: string;
    candidate: CandidateProfile;
    prospect: ProspectProfile;
    createdAt: Date;
    score?: number;
    status: 'pending' | 'ready' | 'in-progress';
    reports: {
        pathology: { user: boolean; prospect: boolean };
        radiology: { user: boolean; prospect: boolean };
        genetic: { user: boolean; prospect: boolean };
        mentalHealth: { user: boolean; prospect: boolean };
        lifestyle: { user: boolean; prospect: boolean };
    };
}

interface AppContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    viewingMode: ViewingMode;
    setViewingMode: (mode: ViewingMode) => void;
    userProfile: UserProfile;
    setUserProfile: (profile: UserProfile) => void;
    candidateProfile: CandidateProfile;
    setCandidateProfile: (profile: CandidateProfile) => void;
    currentProspect: ProspectProfile;
    setCurrentProspect: (prospect: ProspectProfile) => void;
    matches: Match[];
    addMatch: (candidate: CandidateProfile, prospect: ProspectProfile) => string;
    freeMatchesAvailable: number;
    selectedMatchId: string | null;
    setSelectedMatchId: (id: string | null) => void;
    getMatchById: (id: string) => Match | undefined;
}

const defaultUserProfile: UserProfile = {
    name: '',
    dob: undefined,
    age: '',
    gender: '',
    city: '',
    relationshipStatus: '',
    marriageTimeline: '',
    userRelation: '',
    lifestyle: undefined
};

const defaultCandidateProfile: CandidateProfile = {
    name: '',
    dob: undefined,
    age: '',
    gender: '',
    city: ''
};

const defaultProspect: ProspectProfile = {
    name: '',
    dob: undefined,
    age: '',
    gender: '',
    city: '',
    meetingSource: '',
    platformName: '',
    lifestyle: undefined
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguage] = useState<Language>('en');
    const [viewingMode, setViewingMode] = useState<ViewingMode>('candidate');
    const [userProfile, setUserProfile] = useState<UserProfile>(defaultUserProfile);
    const [candidateProfile, setCandidateProfile] = useState<CandidateProfile>(defaultCandidateProfile);
    const [currentProspect, setCurrentProspect] = useState<ProspectProfile>(defaultProspect);
    const [matches, setMatches] = useState<Match[]>([]);
    const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
    const freeMatchesAvailable = 3 - matches.length;

    const getMatchById = (id: string): Match | undefined => {
        return matches.find(m => m.id === id);
    };

    const addMatch = (candidate: CandidateProfile, prospect: ProspectProfile): string => {
        const newMatch: Match = {
            id: `match-${Date.now()}`,
            candidate,
            prospect,
            createdAt: new Date(),
            score: Math.floor(Math.random() * 30) + 70, // Random score between 70-99
            status: 'pending',
            reports: {
                pathology: { user: false, prospect: false },
                radiology: { user: false, prospect: false },
                genetic: { user: false, prospect: false },
                mentalHealth: { user: false, prospect: false },
                lifestyle: { user: false, prospect: false }
            }
        };
        setMatches(prev => [...prev, newMatch]);
        return newMatch.id;
    };

    return (
        <AppContext.Provider value={{
            language, setLanguage,
            viewingMode, setViewingMode,
            userProfile, setUserProfile,
            candidateProfile, setCandidateProfile,
            currentProspect, setCurrentProspect,
            matches, addMatch,
            freeMatchesAvailable,
            selectedMatchId, setSelectedMatchId,
            getMatchById
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};


