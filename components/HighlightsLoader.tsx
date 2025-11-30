'use client';

import { useEffect, useState } from 'react';

export function HighlightsLoader({ onComplete }: { onComplete: () => void }) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(onComplete, 300);
                    return 100;
                }
                return prev + 20;
            });
        }, 400);

        return () => clearInterval(interval);
    }, [onComplete]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-gold/20 rounded-full"></div>
                <div
                    className="absolute top-0 left-0 w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin"
                ></div>
            </div>

            <div className="space-y-2 text-center">
                <p className="text-gold font-medium">Yapay Zeka Analiz Ediyor...</p>
                <div className="w-48 h-2 bg-charcoal/30 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-gold to-gold-light transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
                <p className="text-sm text-gray-400">{progress}% Tamamlandı</p>
            </div>
        </div>
    );
}
