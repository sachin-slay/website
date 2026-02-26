import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Story {
  id: number;
  emoji: string;
  category: string;
  categoryColor: string;
  tabDescription: string;
  quote: string;
  attribution: string;
  stat: string;
  statDescription: string;
  visual?: React.ReactNode;
  boxes: React.ReactNode;
  costComparison: React.ReactNode;
  insight: string;
  source: string;
}

interface StoryTabsProps {
  stories: Story[];
}

type SubTab = 'overview' | 'reality' | 'prevention';

const subTabs: { key: SubTab; label: string; shortLabel: string }[] = [
  { key: 'overview', label: 'Overview', shortLabel: 'Overview' },
  { key: 'reality', label: 'The Reality', shortLabel: 'Reality' },
  { key: 'prevention', label: 'Prevention', shortLabel: 'Prevention' },
];

export const StoryTabs = ({ stories }: StoryTabsProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('overview');
  const active = stories[activeIndex];

  const handleStoryChange = (index: number) => {
    setActiveIndex(index);
    setActiveSubTab('overview');
  };

  return (
    <div className="grid lg:grid-cols-[380px_1fr] gap-8 lg:gap-10 max-w-7xl mx-auto">
      {/* LEFT - Story Tabs */}
      <div className="flex lg:flex-col gap-3 lg:gap-4 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-hide order-1">
        {stories.map((story, index) => (
          <button
            key={story.id}
            onClick={() => handleStoryChange(index)}
            className={`flex-shrink-0 lg:flex-shrink text-left rounded-xl p-4 lg:p-5 transition-all duration-200 border ${
              index === activeIndex
                ? 'bg-white border-primary shadow-md ring-1 ring-primary/20'
                : 'bg-white/60 border-slate-200 hover:bg-white hover:border-slate-300 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl lg:text-3xl flex-shrink-0">{story.emoji}</span>
              <div className="min-w-0 flex-1">
                <p className={`text-sm lg:text-base font-bold ${
                  index === activeIndex ? 'text-slate-900' : 'text-slate-600'
                }`}>
                  {story.category}
                </p>
                <p className="text-xs lg:text-sm text-slate-500 mt-1 line-clamp-2">
                  {story.tabDescription}
                </p>
              </div>
              {index === activeIndex && (
                <ArrowRight className="w-5 h-5 text-primary flex-shrink-0" />
              )}
            </div>
          </button>
        ))}
      </div>

      {/* RIGHT - Featured Story Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm order-2 lg:h-[500px] lg:flex lg:flex-col lg:overflow-hidden"
        >
          {/* Fixed header: badge + sub-tabs */}
          <div className="px-6 lg:px-8 pt-5 lg:pt-6 pb-3 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 flex-shrink-0">
            <span
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider flex-shrink-0 ${active.categoryColor}`}
            >
              <span className="text-xl">{active.emoji}</span>
              {active.category}
            </span>
            <div className="flex gap-1 bg-slate-100 rounded-lg p-1 flex-1">
              {subTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveSubTab(tab.key)}
                  className={`flex-1 px-3 py-1.5 rounded-md text-xs lg:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    activeSubTab === tab.key
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <span className="lg:hidden">{tab.shortLabel}</span>
                  <span className="hidden lg:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable content area */}
          <div className="px-6 lg:px-8 pb-5 lg:pb-6 lg:flex-1 lg:overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSubTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-4 lg:space-y-5"
              >
                {activeSubTab === 'overview' && (
                  <>
                    {/* Quote */}
                    <div>
                      <blockquote className="text-xl lg:text-2xl font-script text-slate-800 leading-relaxed border-l-4 border-primary/30 pl-5">
                        {active.quote}
                      </blockquote>
                      <p className="text-sm text-slate-500 mt-2 pl-6">
                        {active.attribution}
                      </p>
                    </div>
                    {/* Stat + Visual side by side */}
                    <div className="grid lg:grid-cols-2 gap-5 lg:gap-6">
                      <div className="flex flex-col justify-center">
                        <span className="text-5xl lg:text-6xl font-bold text-[#17CB96] mb-3">
                          {active.stat}
                        </span>
                        <p className="text-slate-600 text-base lg:text-lg leading-snug">
                          {active.statDescription}
                        </p>
                      </div>
                      {active.visual && (
                        <div>
                          {active.visual}
                        </div>
                      )}
                    </div>
                  </>
                )}

                {activeSubTab === 'reality' && (
                  <>
                    {active.boxes}
                  </>
                )}

                {activeSubTab === 'prevention' && (
                  <>
                    {/* Cost comparison + Insight side by side */}
                    <div className="grid lg:grid-cols-2 gap-5">
                      {active.costComparison}
                      <div className="bg-slate-50 rounded-xl p-5 flex flex-col justify-center">
                        <span className="text-2xl mb-2">💡</span>
                        <p className="text-slate-700 text-base leading-relaxed">
                          {active.insight}
                        </p>
                      </div>
                    </div>
                    {/* Source */}
                    <p className="text-xs text-slate-400 text-right">
                      Source: {active.source}
                    </p>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
