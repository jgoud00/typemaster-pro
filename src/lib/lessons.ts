// Main lessons module - consolidated curriculum with 73 lessons
import { Lesson } from '@/types';
import { allLessons, lessonCategories, getLessonsByCategory, getCategoryForLesson } from './lessons/index';

// Re-export the consolidated lessons array
export const lessons: Lesson[] = allLessons;

// Re-export category utilities
export { lessonCategories, getLessonsByCategory, getCategoryForLesson };

// Get lesson by ID
export function getLessonById(id: string): Lesson | undefined {
    return lessons.find(lesson => lesson.id === id);
}

// Get next lesson in sequence
export function getNextLesson(currentId: string): Lesson | undefined {
    const currentIndex = lessons.findIndex(l => l.id === currentId);
    if (currentIndex === -1 || currentIndex === lessons.length - 1) {
        return undefined;
    }
    return lessons[currentIndex + 1];
}

// Get previous lesson in sequence
export function getPreviousLesson(currentId: string): Lesson | undefined {
    const currentIndex = lessons.findIndex(l => l.id === currentId);
    if (currentIndex <= 0) {
        return undefined;
    }
    return lessons[currentIndex - 1];
}

// Get lesson number (1-indexed)
export function getLessonNumber(lessonId: string): number {
    const index = lessons.findIndex(l => l.id === lessonId);
    return index === -1 ? 0 : index + 1;
}

// Get total lessons count
export function getTotalLessons(): number {
    return lessons.length;
}

// Get lessons count by category
export function getLessonsCountByCategory(categoryId: string): number {
    return getLessonsByCategory(categoryId).length;
}
