'use client';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Lesson } from '@/types';
interface HeroBannerProps {
  completedCount: number;
  totalLessons: number;
  overallProgress: number;
  nextLesson: Lesson | undefined;
  nextLessonCategory: { icon: string; name: string } | null | undefined;
}
export function HeroBanner({ completedCount, totalLessons, nextLesson, overallProgress }: HeroBannerProps) {
  return <section className="studio-hero">
    <div className="studio-hero-copy">
      <p className="studio-eyebrow">LESS FRICTION. MORE FLOW.</p>
      <h1>Good things<br />start with<br /><span>a keystroke.</span></h1>
      <p className="studio-hero-description">Turn everyday typing into second nature. Find your rhythm with guided lessons and practice made for you.</p>
      <div className="studio-hero-actions">
        <Button asChild size="lg"><Link href={nextLesson ? `/lessons/${nextLesson.id}` : '/practice'}>{completedCount ? 'Continue learning' : 'Start learning'}<ArrowUpRight size={18} /></Link></Button>
        <Link href="/practice?mode=speed-test" className="studio-text-link">Test your speed <ArrowRight size={16} /></Link>
      </div>
      <p className="studio-hero-footnote">{totalLessons} lessons. Your pace. Your progress.</p>
    </div>
    <div className="studio-practice-art">
      <div className="studio-art-heading"><span>THE HOME ROW</span><span>01 / FOUNDATION</span></div>
      <div className="studio-key-sculpture" aria-hidden="true"><span className="sculpture-key key-f">f<span>LEFT INDEX</span></span><span className="sculpture-key key-j">j<span>RIGHT INDEX</span></span><span className="studio-orbit" /></div>
      <div className="studio-art-caption"><span>Find your starting point.</span><span className="font-mono text-primary">f + j</span></div>
      <Link href={nextLesson ? `/lessons/${nextLesson.id}` : '/lessons'} className="studio-next-lesson"><BookOpen size={19} /><div><span>{completedCount ? 'PICK UP WHERE YOU LEFT OFF' : 'YOUR FIRST STEP'}</span><strong>{nextLesson?.title || 'Explore the curriculum'}</strong></div><ArrowUpRight size={20} /></Link>
      <div className="studio-course-track"><span>{completedCount} of {totalLessons} lessons complete</span><span>{overallProgress}%</span></div>
      <div role="progressbar" aria-label="Learning progress" aria-valuenow={overallProgress} aria-valuemin={0} aria-valuemax={100} className="studio-course-bar"><span style={{width: `${overallProgress}%`}} /></div>
    </div>
  </section>;
}
