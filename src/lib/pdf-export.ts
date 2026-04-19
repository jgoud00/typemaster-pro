import jsPDF from 'jspdf';
import { useProgressStore } from '@/stores/progress-store';
import { useAnalyticsStore } from '@/stores/analytics-store';
import { generateWeeklySummary } from './algorithms/ai-summary-generator';

export function generateProgressPDF(): void {
    const doc = new jsPDF();
    const progress = useProgressStore.getState().progress;
    const analytics = useAnalyticsStore.getState();

    // Data collection
    const bestWpm = progress.personalBests?.wpm || 0;
    const bestAccuracy = progress.personalBests?.accuracy || 0;
    const totalPracticeTime = progress.totalPracticeTime || 0;
    const totalKeystrokes = progress.totalKeystrokes || 0;
    const lessonsCompleted = progress.completedLessons?.length || 0;

    const bigrams = Object.entries(analytics.bigramStats || {}).map(([key, stat]) => ({
        key,
        accuracy: stat.totalAttempts > 0 ? ((stat.totalAttempts - stat.errors) / stat.totalAttempts) * 100 : 100,
        attempts: stat.totalAttempts
    })).filter(b => b.key.length === 2 && b.attempts > 5);

    bigrams.sort((a, b) => a.accuracy - b.accuracy);
    const top5Weakest = bigrams.slice(0, 5);
    const top5Strongest = [...bigrams].reverse().slice(0, 5);
    
    // Formatting Time
    const hours = Math.floor(totalPracticeTime / 3600);
    const minutes = Math.floor((totalPracticeTime % 3600) / 60);

    // Document styling variables
    const marginX = 20;
    let posY = 20;
    const lineHeight = 10;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Typemaster Pro: Performance Report", marginX, posY);
    posY += lineHeight * 2;

    doc.setFontSize(14);
    doc.text("Executive Summary", marginX, posY);
    posY += lineHeight;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    const summaryText = doc.splitTextToSize(generateWeeklySummary(), 170);
    doc.text(summaryText, marginX, posY);
    posY += (lineHeight * summaryText.length) + lineHeight;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("All-Time Statistics", marginX, posY);
    posY += lineHeight;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Personal Best WPM: ${bestWpm} WPM`, marginX, posY);
    posY += lineHeight;
    doc.text(`Personal Best Accuracy: ${bestAccuracy}%`, marginX, posY);
    posY += lineHeight;
    doc.text(`Total Practice Time: ${hours}h ${minutes}m`, marginX, posY);
    posY += lineHeight;
    doc.text(`Total Keystrokes: ${totalKeystrokes.toLocaleString()}`, marginX, posY);
    posY += lineHeight;
    doc.text(`Lessons Completed: ${lessonsCompleted}`, marginX, posY);
    posY += lineHeight * 2;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Top 5 Weakest Bigrams", marginX, posY);
    posY += lineHeight;
    doc.setFont("helvetica", "normal");
    top5Weakest.forEach((b, i) => {
        doc.text(`${i + 1}. '${b.key}' - ${Math.round(b.accuracy)}% accuracy`, marginX, posY);
        posY += lineHeight;
    });
    if (top5Weakest.length === 0) { doc.text("Insufficient data.", marginX, posY); posY += lineHeight; }
    posY += lineHeight;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Top 5 Strongest Bigrams", marginX, posY);
    posY += lineHeight;
    doc.setFont("helvetica", "normal");
    top5Strongest.forEach((b, i) => {
        doc.text(`${i + 1}. '${b.key}' - ${Math.round(b.accuracy)}% accuracy`, marginX, posY);
        posY += lineHeight;
    });
    if (top5Strongest.length === 0) { doc.text("Insufficient data.", marginX, posY); posY += lineHeight; }

    doc.save("typemaster-progress-report.pdf");
}
