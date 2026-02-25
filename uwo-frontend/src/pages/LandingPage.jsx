import React, { useEffect } from 'react';
import Navbar from '../components/Landing/Navbar';
import Hero from '../components/Landing/Hero';
import Features from '../components/Landing/Features';
import TechnologySection from '../components/Landing/TechnologySection';
import Footer from '../components/Landing/Footer/Footer';
import { ThemeProvider } from '../context/ThemeContext';
import '../landing.css';

function LandingPage() {

    useEffect(() => {
        // Add landing-page class to body on mount
        document.body.classList.add('landing-page');

        // Remove landing-page class on unmount
        return () => {
            document.body.classList.remove('landing-page');
            // Also potentially reset styles if Dashboard doesn't override them immediately
            document.body.style.background = '';
        };
    }, []);

    return (
        <ThemeProvider>
            <div className="landing-wrapper">
                <Navbar />
                <Hero />
                <Features />
                <TechnologySection />
                <Footer />
            </div>
        </ThemeProvider>
    );
}

export default LandingPage;
