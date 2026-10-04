'use client';
import { useState } from 'react';
import { Search, BookOpen, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { lessons, lessonCategories, getLessonsByCategory } from '@/lib/lessons';
import { useProgressStore } from '@/stores/progress-store';
import { LessonPath } from '@/components/lessons/lesson-journey';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/ui/empty-state';
export default function LessonsPage() {
  const progress = useProgressStore((s) => s.progress);
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');
  const completed = progress.completedLessons.length;
  const next = lessons.find((l) => !progress.completedLessons.includes(l.id));
  const filtered = lessonCategories
    .filter((c) => category === 'all' || c.id === category)
    .map((c) => ({
      ...c,
      items: getLessonsByCategory(c.id).filter((l) =>
        `${l.title} ${l.description}`.toLowerCase().includes(query.toLowerCase()),
      ),
    }))
    .filter((c) => c.items.length);
  return (
    <main className="curriculum-page container mx-auto space-y-8">
      <PageHeader
        badge={
          <span className="text-[10px] tracking-[.18em] text-muted-foreground">THE CURRICULUM</span>
        }
        title="The curriculum."
        description="From your first home-row keys to confident, effortless typing. Follow the lessons at your own pace."
        actions={
          next && (
            <Button asChild>
              <Link href={`/lessons/${next.id}`}>
                Continue learning <ArrowRight />
              </Link>
            </Button>
          )
        }
      />
      <div className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <BookOpen size={21} />
          </span>
          <div>
            <p className="text-sm font-semibold">
              {completed} of {lessons.length} lessons complete
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Keep showing up. Every lesson counts.
            </p>
          </div>
        </div>
        <div className="w-full sm:w-56">
          <div className="mb-2 flex justify-between text-xs text-muted-foreground">
            <span>Course progress</span>
            <span className="font-mono text-primary">
              {Math.round((completed / lessons.length) * 100)}%
            </span>
          </div>
          <div
            className="h-1.5 overflow-hidden rounded-full bg-accent"
            role="progressbar"
            aria-label="Course progress"
            aria-valuenow={Math.round((completed / lessons.length) * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full bg-primary"
              style={{ width: `${Math.min(100, (completed / lessons.length) * 100)}%` }}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategory('all')}
            aria-pressed={category === 'all'}
            className={`rounded-lg border px-3 py-2 text-xs ${category === 'all' ? 'border-primary/30 bg-primary/10 text-primary' : 'border-border text-muted-foreground'}`}
          >
            All lessons
          </button>
          {lessonCategories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              aria-pressed={category === c.id}
              className={`rounded-lg border px-3 py-2 text-xs ${category === c.id ? 'border-primary/30 bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:text-foreground'}`}
            >
              {c.name}
            </button>
          ))}
        </div>
        <div className="relative shrink-0 sm:w-56">
          <Search size={15} className="absolute left-3 top-3.5 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search lessons"
            aria-label="Search curriculum"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="curriculum-chapters space-y-10">
        {filtered.map((c) => (
          <LessonPath
            key={c.id}
            lessons={c.items}
            completedLessonIds={progress.completedLessons}
            lessonScores={progress.lessonScores}
            categoryName={c.name}
            showHeader
            globalStartIndex={lessons.findIndex((l) => l.id === c.items[0].id)}
          />
        ))}
        {!filtered.length && (
          <EmptyState
            icon={<Search size={20} />}
            title="No lessons found"
            description="Try a different search or choose another category."
            action={
              <Button
                variant="outline"
                onClick={() => {
                  setQuery('');
                  setCategory('all');
                }}
              >
                Clear filters
              </Button>
            }
          />
        )}
      </div>
    </main>
  );
}
