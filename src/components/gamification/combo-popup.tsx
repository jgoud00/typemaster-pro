'use client';

interface ComboPopupProps {
    combo: number;
    show: boolean;
    level: number;
}

export function ComboPopup({ combo, show, level }: ComboPopupProps) {
    // Visual effects disabled
    return null;
}

interface StreakBreakPopupProps {
    show: boolean;
    lastCombo: number;
}

export function StreakBreakPopup({ show, lastCombo }: StreakBreakPopupProps) {
    // Visual effects disabled
    return null;
}
