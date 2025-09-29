'use client';

import { useEffect } from "react";

const primaryColors: { [key: string]: string } = {
    '220 20% 96%': '215 33% 50%',
    '25 5% 95%': '25 50% 50%',
    '0 80% 96%': '0 72% 51%',
    '25 95% 95%': '25 95% 53%',
    '142 60% 96%': '142 71% 41%',
    '215 90% 96%': '215 91% 55%',
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {

    useEffect(() => {
        const savedBg = localStorage.getItem('remi-theme-background');
        const savedFontSize = localStorage.getItem('remi-theme-fontsize');
        
        if (savedBg) {
             const root = document.documentElement;
             root.style.setProperty('--background', savedBg);
             root.style.setProperty('--primary', primaryColors[savedBg] || '215 33% 50%');
        }
        if (savedFontSize) {
            const root = document.documentElement;
            root.style.setProperty('font-size', `${savedFontSize}px`);
        }
    }, []);

    return <>{children}</>;
}
