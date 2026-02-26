import React from 'react';

const FontShowcasePage = () => {
    return (
        <div className="min-h-screen bg-slate-50 py-20">
            <div className="container mx-auto px-4 max-w-5xl">

                {/* Font Families */}
                <section className="mb-16 bg-white p-8 rounded-2xl shadow-sm">
                    <h2 className="mb-8">Font Families</h2>
                    <div className="space-y-6">
                        <div>
                            <p className="text-sm text-slate-500 mb-2">font-sans (Inter)</p>
                            <p className="font-sans text-xl">
                                The quick brown fox jumps over the lazy dog
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 mb-2">font-script (Caveat)</p>
                            <p className="font-script text-3xl">
                                The quick brown fox jumps over the lazy dog
                            </p>
                        </div>
                    </div>
                </section>

                {/* Heading Styles */}
                <section className="mb-16 bg-white p-8 rounded-2xl shadow-sm">
                    <h2 className="mb-8">Heading Styles (Auto-responsive)</h2>
                    <div className="space-y-6">
                        <div>
                            <p className="text-sm text-slate-500 mb-2">h1 - 36px → 48px → 60px</p>
                            <h1>Main Page Headline</h1>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 mb-2">h2 - 30px → 36px</p>
                            <h2>Section Headline</h2>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 mb-2">h3 - 24px → 30px</p>
                            <h3>Subsection Headline</h3>
                        </div>
                    </div>
                </section>

                {/* Font Weights - Inter */}
                <section className="mb-16 bg-white p-8 rounded-2xl shadow-sm">
                    <h2 className="mb-8">Inter Font Weights</h2>
                    <div className="space-y-3 font-sans">
                        <p className="font-light text-lg">300 - Light Weight</p>
                        <p className="font-normal text-lg">400 - Regular Weight</p>
                        <p className="font-medium text-lg">500 - Medium Weight</p>
                        <p className="font-semibold text-lg">600 - Semibold Weight</p>
                        <p className="font-bold text-lg">700 - Bold Weight</p>
                        <p className="font-extrabold text-lg">800 - Extrabold Weight</p>
                    </div>
                </section>

                {/* Font Weights - Caveat */}
                <section className="mb-16 bg-white p-8 rounded-2xl shadow-sm">
                    <h2 className="mb-8">Caveat Font Weights</h2>
                    <div className="space-y-3 font-script">
                        <p className="font-normal text-2xl">400 - Regular Weight</p>
                        <p className="font-medium text-2xl">500 - Medium Weight</p>
                        <p className="font-semibold text-2xl">600 - Semibold Weight</p>
                        <p className="font-bold text-2xl">700 - Bold Weight</p>
                    </div>
                </section>

                {/* Underline Styles */}
                <section className="mb-16 bg-white p-8 rounded-2xl shadow-sm">
                    <h2 className="mb-8">Underline Effects</h2>
                    <div className="space-y-6">
                        <div>
                            <p className="text-sm text-slate-500 mb-2">.curly-underline (Blue #0EA5E9)</p>
                            <p className="text-2xl">
                                This is a <span className="curly-underline">wavy blue underline</span> effect
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 mb-2">.curly-scribble-underline (Orange #FFA500)</p>
                            <p className="text-2xl">
                                This is a <span className="curly-scribble-underline">scribble orange underline</span> effect
                            </p>
                        </div>
                    </div>
                </section>

                {/* Background Highlights */}
                <section className="mb-16 bg-white p-8 rounded-2xl shadow-sm">
                    <h2 className="mb-8">Background Highlight Effects</h2>
                    <div className="space-y-6">
                        <div>
                            <p className="text-sm text-slate-500 mb-2">.highlight-text-bg (Orange)</p>
                            <p className="text-2xl">
                                This is an <span className="highlight-text-bg">orange highlight</span> effect
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 mb-2">.highlight-text-bg-2 (Red)</p>
                            <p className="text-2xl">
                                This is a <span className="highlight-text-bg-2">red highlight</span> effect
                            </p>
                        </div>
                    </div>
                </section>

                {/* Organic Highlights */}
                <section className="mb-16 bg-white p-8 rounded-2xl shadow-sm">
                    <h2 className="mb-8">Organic Blob Highlights</h2>
                    <div className="space-y-6">
                        <div>
                            <p className="text-sm text-slate-500 mb-2">.organic-highlight-bg (Orange)</p>
                            <p className="text-2xl">
                                This is an <span className="organic-highlight-bg">organic orange</span> highlight
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 mb-2">.organic-highlight-purple (Purple)</p>
                            <p className="text-2xl">
                                This is an <span className="organic-highlight-purple">organic purple</span> highlight
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 mb-2">.organic-highlight-pink (Pink)</p>
                            <p className="text-2xl">
                                This is an <span className="organic-highlight-pink">organic pink</span> highlight
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 mb-2">.organic-highlight-blue (Blue)</p>
                            <p className="text-2xl">
                                This is an <span className="organic-highlight-blue">organic blue</span> highlight
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 mb-2">.organic-highlight-yellow (Yellow)</p>
                            <p className="text-2xl">
                                This is an <span className="organic-highlight-yellow">organic yellow</span> highlight
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 mb-2">.organic-highlight-green (Green)</p>
                            <p className="text-2xl">
                                This is an <span className="organic-highlight-green">organic green</span> highlight
                            </p>
                        </div>
                    </div>
                </section>

                {/* Combined Example */}
                <section className="mb-16 bg-slate-900 text-white p-8 rounded-2xl">
                    <h2 className="mb-8 text-white">Combined Example</h2>
                    <div className="text-center space-y-8">
                        <h1 className="text-white">
                            Your <span className="organic-highlight-pink">Perfect Match</span> Starts Here
                        </h1>
                        <p className="text-xl leading-relaxed">
                            Discover <span className="curly-underline">compatibility</span> through science,{' '}
                            build <span className="organic-highlight-blue">trust</span> through transparency,{' '}
                            and start your <span className="organic-highlight-yellow">journey</span> with confidence.
                        </p>
                        <p className="font-script text-4xl">
                            Because love deserves clarity
                        </p>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default FontShowcasePage;
