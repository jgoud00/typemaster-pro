'use client';
import Link from 'next/link';
import { ArrowRight, BookOpen, ChartNoAxesCombined, Keyboard, Target } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { lessons } from '@/lib/lessons';
const features = [
  {
    icon: BookOpen,
    title: 'A foundation that grows with you',
    description:
      'A structured curriculum takes you from home-row fundamentals to more demanding passages and symbols.',
  },
  {
    icon: Target,
    title: 'Practice where it matters',
    description:
      'Keystroke feedback helps you spot hesitant keys and build a practice routine around them.',
  },
  {
    icon: ChartNoAxesCombined,
    title: 'See the progress you make',
    description:
      'Track speed, accuracy, and practice history. Reflect on your sessions and set your next goal.',
  },
];
export default function AboutPage() {
  return (
    <main className="about-page container mx-auto space-y-10">
      <PageHeader
        title="A calmer way to get better."
        description="Aloo Type is your space to build confidence, find your flow, and feel at home at the keyboard."
        badge={
          <span className="text-[10px] tracking-[.18em] text-muted-foreground">
            ABOUT ALOO TYPE
          </span>
        }
      />
      <section className="dashboard-hero">
        <Keyboard size={32} className="mb-6 text-primary" />
        <h2 className="max-w-2xl text-3xl font-semibold leading-tight tracking-tight">
          A useful skill.
          <br />A few minutes of your day.
          <br />
          <span className="text-primary">A little more confidence.</span>
        </h2>
        <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground">
          Typing is something you do every day. We believe learning it should feel focused and
          rewarding. Aloo Type brings {lessons.length} guided lessons, flexible practice modes, and
          personal insights into one thoughtful workspace.
        </p>
        <Button asChild className="mt-7">
          <Link href="/lessons">
            Explore the curriculum <ArrowRight />
          </Link>
        </Button>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        {features.map(({ icon: Icon, title, description }) => (
          <div className="rounded-2xl border border-border bg-card p-6" key={title}>
            <Icon className="mb-6 text-primary" size={22} />
            <h3 className="mb-3 text-base font-semibold">{title}</h3>
            <p className="text-sm leading-7 text-muted-foreground">{description}</p>
          </div>
        ))}
      </section>
      <section className="flex flex-col gap-4 rounded-2xl border border-border p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold">Start where you are.</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Explore as a guest. Sign in when you want to sync your progress.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/practice">
            Find your practice mode <ArrowRight />
          </Link>
        </Button>
      </section>
    </main>
  );
}
