import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Heart, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ExitIntentModal } from '@/components/ExitIntentModal';

const Layout = () => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [isScrolled, setIsScrolled] = React.useState(false);
    const [isPastHero, setIsPastHero] = React.useState(false);
    const location = useLocation();

    const navItems = [
        { name: 'How It Works', path: '/how-it-works' },
        { name: 'Clinical Safety', path: '/safety' },
        { name: 'Growth & Partners', path: '/growth' },
        { name: 'Cultural & Access', path: '/cultural' },
    ];

    React.useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const heroHeight = window.innerHeight - 80; // viewport height minus nav height

            setIsScrolled(scrollPosition > 10);
            setIsPastHero(scrollPosition > heroHeight);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-brand-pink-light font-sans text-foreground flex flex-col">
            {/* Skip to main content link for accessibility */}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-6 focus:py-3 focus:bg-primary focus:text-white focus:rounded-lg focus:shadow-lg focus:font-semibold"
            >
                Skip to main content
            </a>

            {/* Navigation */}
            <header
                className={cn(
                    "sticky top-0 z-50 w-full transition-all duration-300",
                    isScrolled
                        ? "border-b bg-brand-pink-light/90 backdrop-blur-md shadow-sm"
                        : "bg-brand-pink-light"
                )}
            >
                <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                    <Link to="/" className="flex items-center space-x-2">
                        <img src="/images/logo.png" alt="Slay Health" className="h-16 lg:h-20 w-auto" />
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {!isPastHero && navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    "text-base font-medium transition-all duration-300 hover:text-primary",
                                    location.pathname === item.path ? "text-primary" : "text-slate-600",
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
                        <Link to="/login" className="bg-[#D4544C] text-white px-6 py-2.5 rounded-full text-base font-medium hover:bg-[#c24941] transition-colors">
                            Get Started
                        </Link>
                    </nav>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {/* Mobile Nav */}
                {isMenuOpen && (
                    <div className="md:hidden border-b bg-background p-4 space-y-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    "block text-sm font-medium transition-colors hover:text-primary",
                                    location.pathname === item.path ? "text-primary" : "text-slate-600"
                                )}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                        <Link to="/login" className="w-full block text-center bg-[#D4544C] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-[#c24941] transition-colors">
                            Get Started
                        </Link>
                    </div>
                )}
            </header>

            {/* Exit Intent Modal */}
            <ExitIntentModal />

            {/* Main Content */}
            <main id="main-content" className="flex-1">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="border-t bg-muted/30">
                <div className="container mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <img src="/images/logo.png" alt="Slay Health" className="h-16 lg:h-20 w-auto" />
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Know what marriage hides before you commit. Scientific health compatibility screening for every couple.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-4">Platform</h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><Link to="/how-it-works" className="hover:text-primary">How It Works</Link></li>
                                <li><Link to="/safety" className="hover:text-primary">Clinical Safety</Link></li>
                                <li><Link to="/growth" className="hover:text-primary">Partners</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-4">Resources</h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><Link to="/cultural" className="hover:text-primary">Cultural Context</Link></li>
                                <li><Link to="/sample-report" className="hover:text-primary">Sample Report</Link></li>
                                <li><Link to="/contact" className="hover:text-primary">Contact Us</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-4">Legal</h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><Link to="/trust" className="hover:text-primary">Privacy & Trust</Link></li>
                                <li><Link to="/safety" className="hover:text-primary">Medical Safety</Link></li>
                                <li><Link to="/why-it-matters" className="hover:text-primary">Why It Matters</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
                        © {new Date().getFullYear()} Slay Health. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
