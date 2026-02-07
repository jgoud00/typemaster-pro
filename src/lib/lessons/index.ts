// Lessons Index - Consolidates all 73 lessons from 6 modules
import { homeRowLessons } from './home-row-basics';
import { homeRowAdvancedLessons } from './home-row-advanced';
import { topRowLessons } from './top-row';
import { bottomRowLessons } from './bottom-row';
import { numbersLessons } from './numbers';
import { symbolsLessons } from './symbols';
import { advancedLessons } from './advanced';
import { Lesson } from '@/types';

// Combine all lessons in order
export const allLessons: Lesson[] = [
    ...homeRowLessons,        // Lessons 1-10
    ...homeRowAdvancedLessons, // Lessons 11-20
    ...topRowLessons,         // Lessons 21-35
    ...bottomRowLessons,      // Lessons 36-47
    ...numbersLessons,        // Lessons 48-55
    ...symbolsLessons,        // Lessons 56-63
    ...advancedLessons,       // Lessons 64-73
];

// Lesson categories for UI grouping
export const lessonCategories = [
    {
        id: 'home-row',
        name: 'Home Row',
        description: 'Master the foundation - 20 lessons',
        icon: '🏠',
        color: 'blue',
        subcategories: ['home-row-basics', 'home-row-intermediate', 'home-row-advanced'],
    },
    {
        id: 'top-row',
        name: 'Top Row',
        description: 'Extend your reach - 15 lessons',
        icon: '⬆️',
        color: 'green',
        subcategories: ['top-row-basics', 'top-row-intermediate', 'top-row-advanced'],
    },
    {
        id: 'bottom-row',
        name: 'Bottom Row',
        description: 'Complete the alphabet - 12 lessons',
        icon: '⬇️',
        color: 'orange',
        subcategories: ['bottom-row-basics', 'bottom-row-intermediate', 'bottom-row-advanced'],
    },
    {
        id: 'numbers',
        name: 'Numbers',
        description: 'Master the number row - 8 lessons',
        icon: '🔢',
        color: 'purple',
        subcategories: ['numbers'],
    },
    {
        id: 'symbols',
        name: 'Symbols',
        description: 'Special characters & punctuation - 8 lessons',
        icon: '💎',
        color: 'pink',
        subcategories: ['symbols'],
    },
    {
        id: 'advanced',
        name: 'Advanced',
        description: 'Real-world typing challenges - 10 lessons',
        icon: '🚀',
        color: 'red',
        subcategories: ['advanced'],
    },
];

// Helper function to get lessons by category
export function getLessonsByCategory(categoryId: string): Lesson[] {
    const category = lessonCategories.find(c => c.id === categoryId);
    if (!category) return [];

    return allLessons.filter(lesson =>
        category.subcategories.some(sub => lesson.category.startsWith(sub) || lesson.category === sub)
    );
}

// Helper function to get category for a lesson
export function getCategoryForLesson(lessonId: string): typeof lessonCategories[0] | undefined {
    const lesson = allLessons.find(l => l.id === lessonId);
    if (!lesson) return undefined;

    return lessonCategories.find(cat =>
        cat.subcategories.some(sub => lesson.category.startsWith(sub) || lesson.category === sub)
    );
}

// Re-export individual module lessons for direct access
export { homeRowLessons, homeRowAdvancedLessons, topRowLessons, bottomRowLessons, numbersLessons, symbolsLessons, advancedLessons };
