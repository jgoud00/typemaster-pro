'use client';
import Link from 'next/link';
import { ArrowRight, Check, Lock, Play } from 'lucide-react';
import type { Lesson, LessonScore } from '@/types';
import { getPreviousLesson, lessons as curriculum } from '@/lib/lessons';
import { cn } from '@/lib/utils';
interface LessonCardProps {
  lesson: Lesson;
  score?: LessonScore;
  isLocked: boolean;
  isCompleted: boolean;
  isCurrent?: boolean;
  index: number;
}
function LessonCard({ lesson, score, isLocked, isCompleted, isCurrent, index }: LessonCardProps) {
  const content = (
    <>
      <div className="lesson-row-index mb-5 flex items-center justify-between">
        <span className="font-mono text-xs text-muted-foreground">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span
          className={cn(
            'flex items-center gap-1.5 text-[10px] font-medium',
            isCompleted ? 'text-emerald-300' : isCurrent ? 'text-primary' : 'text-muted-foreground',
          )}
        >
          {isCompleted ? (
            <>
              <Check size={13} />
              Completed
            </>
          ) : isLocked ? (
            <>
              <Lock size={12} />
              Locked
            </>
          ) : (
            <>
              <Play size={12} />
              {isCurrent ? 'Up next' : 'Available'}
            </>
          )}
        </span>
      </div>
      <h3 className="lesson-row-title mb-2 text-sm font-semibold">{lesson.title}</h3>
      <p className="lesson-row-description mb-5 flex-1 text-xs leading-6 text-muted-foreground">{lesson.description}</p>
      <div className="lesson-row-target flex items-center justify-between border-t border-border pt-4">
        <span className="text-[10px] text-muted-foreground">
          {score
            ? `${score.bestWpm} WPM · ${score.bestAccuracy}%`
            : `Goal ${lesson.targetWpm} WPM · ${lesson.targetAccuracy}%`}
        </span>
        {!isLocked && <ArrowRight size={14} className="text-primary" />}
      </div>
    </>
  );
  const classes = cn('lesson-card', isCurrent && 'is-current', isLocked && 'is-locked');
  return isLocked ? (
    <div className={classes} aria-label={`${lesson.title}, locked`}>
      {content}
    </div>
  ) : (
    <Link href={`/lessons/${lesson.id}`} className={classes}>
      {content}
    </Link>
  );
}
interface LessonPathProps {
  lessons: Lesson[];
  completedLessonIds: string[];
  lessonScores: Record<string, LessonScore>;
  categoryName?: string;
  categoryIcon?: string;
  categoryLessonCount?: number;
  globalStartIndex?: number;
  showHeader?: boolean;
}
export function LessonPath({
  lessons,
  completedLessonIds,
  lessonScores,
  categoryName,
  globalStartIndex = 0,
  showHeader = false,
}: LessonPathProps) {
  const completed = lessons.filter((l) => completedLessonIds.includes(l.id)).length;
  return (
    <section className="curriculum-chapter">
      {showHeader && (
        <div className="section-heading">
          <div>
            <h2>{categoryName}</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {lessons.length} lessons · Build your skills step by step
            </p>
          </div>
          <span className="text-xs text-muted-foreground">
            {completed} / {lessons.length} complete
          </span>
        </div>
      )}
      <div className="curriculum-lesson-list grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {lessons.map((lesson, index) => {
          const previous = getPreviousLesson(lesson.id);
          const isCompleted = completedLessonIds.includes(lesson.id);
          const isLocked = !isCompleted && !!previous && !completedLessonIds.includes(previous.id);
          return (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              score={lessonScores[lesson.id]}
              isLocked={isLocked}
              isCompleted={isCompleted}
              isCurrent={!isCompleted && !isLocked}
              index={
                curriculum.findIndex((item) => item.id === lesson.id) >= 0
                  ? curriculum.findIndex((item) => item.id === lesson.id)
                  : globalStartIndex + index
              }
            />
          );
        })}
      </div>
    </section>
  );
}
export function LessonNode(props: LessonCardProps) {
  return <LessonCard {...props} />;
}
