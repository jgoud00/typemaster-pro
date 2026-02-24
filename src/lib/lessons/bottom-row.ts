import { Lesson } from '@/types';

// ============================================================================
// BOTTOM ROW MODULE - 12 Lessons
// Focus: ZXCVBNM keys with real words combining all three rows
// ============================================================================

const bottomRowLessons: Lesson[] = [
    // Lesson 36: Z and M (Pinky and Index)
    {
        id: 'bottom-1-zm',
        title: 'Corners: Z and M',
        description: 'Z uses left pinky reaching down-left. M uses right index reaching down-right.',
        category: 'bottom-row-basics',
        keys: ['z', 'm', 'a', 's', 'd', 'f', 'j', 'k', 'l'],
        targetWpm: 28,
        targetAccuracy: 88,
        exercises: [
            { id: 'b1-1', text: 'zz mm zz mm zz mm zz mm zz mm', difficulty: 'beginner' },
            { id: 'b1-2', text: 'zm mz zm mz zm mz zm mz zm mz', difficulty: 'beginner' },
            { id: 'b1-3', text: 'maze maze maze maze maze maze', difficulty: 'beginner' },
            { id: 'b1-4', text: 'zoom zoom zoom zoom zoom zoom', difficulty: 'intermediate' },
            { id: 'b1-5', text: 'amaze amaze amazing amazing amazing', difficulty: 'intermediate' },
            { id: 'b1-6', text: 'The maze is amazing. Zoom ahead. Make haste.', difficulty: 'intermediate' },
            { id: 'b1-7', text: 'Amazing mazes zoom. Make more time. Zero mistakes.', difficulty: 'advanced' },
            { id: 'b1-8', text: 'Zoom through the amazing maze. Make time. Zero in on more goals.', difficulty: 'advanced' },
        ],
    },

    // Lesson 37: X and N
    {
        id: 'bottom-2-xn',
        title: 'X Marks the Spot, N for Names',
        description: 'X is rare but important. N is very common. Master both with ring and index fingers.',
        category: 'bottom-row-basics',
        keys: ['x', 'n', 'z', 'm', 'a', 's', 'd', 'f', 'j', 'k', 'l'],
        targetWpm: 30,
        targetAccuracy: 89,
        exercises: [
            { id: 'b2-1', text: 'xx nn xx nn xx nn xx nn xx nn', difficulty: 'beginner' },
            { id: 'b2-2', text: 'xn nx xn nx xn nx xn nx xn nx', difficulty: 'beginner' },
            { id: 'b2-3', text: 'an in on no an in on no an in', difficulty: 'beginner' },
            { id: 'b2-4', text: 'next next next next next next', difficulty: 'intermediate' },
            { id: 'b2-5', text: 'exam exam example example explain', difficulty: 'intermediate' },
            { id: 'b2-6', text: 'The next example is not an exam. Explain now.', difficulty: 'intermediate' },
            { id: 'b2-7', text: 'An example explains. Next, examine the text. No extra time.', difficulty: 'advanced' },
            { id: 'b2-8', text: 'Explain next. The exam example is an extra one. No anxious moments.', difficulty: 'advanced' },
        ],
    },

    // Lesson 38: C (Common Letter)
    {
        id: 'bottom-3-c',
        title: 'Common C',
        description: 'C is used in many common words. Left middle finger reaches down.',
        category: 'bottom-row-basics',
        keys: ['c', 'x', 'n', 'z', 'm', 'a', 's', 'd', 'f', 'e', 'i', 'o', 'r', 't'],
        targetWpm: 32,
        targetAccuracy: 90,
        exercises: [
            { id: 'b3-1', text: 'cc cc cc cc cc cc cc cc cc cc', difficulty: 'beginner' },
            { id: 'b3-2', text: 'can come call can come call can', difficulty: 'beginner' },
            { id: 'b3-3', text: 'car care nice car care nice car', difficulty: 'beginner' },
            { id: 'b3-4', text: 'center create consider center create', difficulty: 'intermediate' },
            { id: 'b3-5', text: 'code connect console code connect', difficulty: 'intermediate' },
            { id: 'b3-6', text: 'Can you come? Call me. Create nice code.', difficulty: 'intermediate' },
            { id: 'b3-7', text: 'Consider connecting. Create content. Can we come center?', difficulty: 'advanced' },
            { id: 'b3-8', text: 'Nice code connects nicely. Consider creating content. Can you call?', difficulty: 'advanced' },
        ],
    },

    // Lesson 39: V
    {
        id: 'bottom-4-v',
        title: 'Valuable V',
        description: 'V sits below F. Left index finger reaches down while maintaining control.',
        category: 'bottom-row-basics',
        keys: ['v', 'c', 'x', 'n', 'z', 'm', 'a', 's', 'd', 'f', 'e', 'i', 'o', 'r', 't'],
        targetWpm: 32,
        targetAccuracy: 89,
        exercises: [
            { id: 'b4-1', text: 'vv vv vv vv vv vv vv vv vv vv', difficulty: 'beginner' },
            { id: 'b4-2', text: 'very have over very have over very', difficulty: 'beginner' },
            { id: 'b4-3', text: 'ever ever ever never never never', difficulty: 'beginner' },
            { id: 'b4-4', text: 'value video visual value video visual', difficulty: 'intermediate' },
            { id: 'b4-5', text: 'I have very good values. Over seven videos.', difficulty: 'intermediate' },
            { id: 'b4-6', text: 'Have you ever visited? Very visual views are valuable.', difficulty: 'intermediate' },
            { id: 'b4-7', text: 'Seven videos have very valuable visual content. Never give over.', difficulty: 'advanced' },
            { id: 'b4-8', text: 'Every value is visible. Have ever visited lovely vistas? Very clever.', difficulty: 'advanced' },
        ],
    },

    // Lesson 40: B
    {
        id: 'bottom-5-b',
        title: 'Bold B',
        description: 'B requires a stretch from F or J. Practice this center reach carefully.',
        category: 'bottom-row-intermediate',
        keys: ['b', 'v', 'c', 'x', 'n', 'm', 'a', 's', 'd', 'f', 'e', 'i', 'o', 'r', 't', 'u'],
        targetWpm: 33,
        targetAccuracy: 89,
        exercises: [
            { id: 'b5-1', text: 'bb bb bb bb bb bb bb bb bb bb', difficulty: 'beginner' },
            { id: 'b5-2', text: 'be big but be big but be big', difficulty: 'beginner' },
            { id: 'b5-3', text: 'best book both best book both best', difficulty: 'beginner' },
            { id: 'b5-4', text: 'before begin better before begin better', difficulty: 'intermediate' },
            { id: 'b5-5', text: 'beautiful number table beautiful number', difficulty: 'intermediate' },
            { id: 'b5-6', text: 'Be big. Begin better. Both books are best.', difficulty: 'intermediate' },
            { id: 'b5-7', text: 'A beautiful table. The best number. Begin before it rains.', difficulty: 'advanced' },
            { id: 'b5-8', text: 'Both beautiful books begin better stories. Be bold. Build tables.', difficulty: 'advanced' },
        ],
    },

    // Lesson 41: Bottom Row Review
    {
        id: 'bottom-6-review',
        title: 'Bottom Row Review',
        description: 'Practice all bottom row keys together. Build confidence with the full row.',
        category: 'bottom-row-intermediate',
        keys: ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
        targetWpm: 34,
        targetAccuracy: 88,
        exercises: [
            { id: 'b6-1', text: 'zxcvbnm zxcvbnm zxcvbnm zxcvbnm', difficulty: 'beginner' },
            { id: 'b6-2', text: 'mnbvcxz mnbvcxz mnbvcxz mnbvcxz', difficulty: 'beginner' },
            { id: 'b6-3', text: 'can move back next can move back next', difficulty: 'intermediate' },
            { id: 'b6-4', text: 'zero extra combine zone extra combine', difficulty: 'intermediate' },
            { id: 'b6-5', text: 'Combine zero x values. Move back next zone.', difficulty: 'intermediate' },
            { id: 'b6-6', text: 'Amazing boxes combine. Next move zero. Examine visible marks.', difficulty: 'advanced' },
            { id: 'b6-7', text: 'Move next zone. Combine amazing numbers. Back to zero extra values.', difficulty: 'advanced' },
            { id: 'b6-8', text: 'Examine the amazing combinations. Next, move visible boxes. Zero extra marks.', difficulty: 'advanced' },
        ],
    },

    // Lesson 42: Common Words - Three Rows
    {
        id: 'bottom-7-common',
        title: 'Full Keyboard Words',
        description: 'Common words using all three rows. This is real typing!',
        category: 'bottom-row-intermediate',
        keys: ['z', 'x', 'c', 'v', 'b', 'n', 'm', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        targetWpm: 38,
        targetAccuracy: 89,
        exercises: [
            { id: 'b7-1', text: 'can have been more some come make', difficulty: 'beginner' },
            { id: 'b7-2', text: 'which become number such between', difficulty: 'beginner' },
            { id: 'b7-3', text: 'because even many during another', difficulty: 'intermediate' },
            { id: 'b7-4', text: 'We can have been here. Some come back. Make more.', difficulty: 'intermediate' },
            { id: 'b7-5', text: 'Which number is between? Such become even more.', difficulty: 'intermediate' },
            { id: 'b7-6', text: 'Because many come, another becomes available. Make some during.', difficulty: 'advanced' },
            { id: 'b7-7', text: 'Even more have been made. Because of many, some become number one.', difficulty: 'advanced' },
            { id: 'b7-8', text: 'Many have become experts. Another can make such contributions. Between numbers.', difficulty: 'advanced' },
        ],
    },

    // Lesson 43: Sentence Fluency
    {
        id: 'bottom-8-sentences',
        title: 'Flowing Sentences',
        description: 'Type complete sentences smoothly. Focus on natural reading rhythm.',
        category: 'bottom-row-intermediate',
        keys: ['z', 'x', 'c', 'v', 'b', 'n', 'm', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        targetWpm: 40,
        targetAccuracy: 90,
        exercises: [
            { id: 'b8-1', text: 'Come back to the beginning. Move forward.', difficulty: 'beginner' },
            { id: 'b8-2', text: 'Make some time. Become even better. Have fun.', difficulty: 'beginner' },
            { id: 'b8-3', text: 'Between you and me, this is amazing. We can do more.', difficulty: 'intermediate' },
            { id: 'b8-4', text: 'Many things become clear. Make no mistake about it.', difficulty: 'intermediate' },
            { id: 'b8-5', text: 'Because we care, we make an extra effort. Come join us.', difficulty: 'intermediate' },
            { id: 'b8-6', text: 'They have become great at this. We make progress every day. Zoom ahead.', difficulty: 'advanced' },
            { id: 'b8-7', text: 'Make your move. Between all options, choose the best. Become excellent.', difficulty: 'advanced' },
            { id: 'b8-8', text: 'Amazing things happen when you practice. Make time. Become better. Move forward.', difficulty: 'advanced' },
        ],
    },

    // Lesson 44: Speed Building
    {
        id: 'bottom-9-speed',
        title: 'Speed Surge',
        description: 'Push your speed with familiar words. Maintain rhythm and flow.',
        category: 'bottom-row-advanced',
        keys: ['z', 'x', 'c', 'v', 'b', 'n', 'm', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        targetWpm: 45,
        targetAccuracy: 88,
        exercises: [
            { id: 'b9-1', text: 'can can can make make make have have have', difficulty: 'beginner' },
            { id: 'b9-2', text: 'come come move move been been more more', difficulty: 'beginner' },
            { id: 'b9-3', text: 'number number become become between between', difficulty: 'intermediate' },
            { id: 'b9-4', text: 'We can make it. Come have some. Been here before.', difficulty: 'intermediate' },
            { id: 'b9-5', text: 'Make more. Have been. Come back. Move on. Can do.', difficulty: 'intermediate' },
            { id: 'b9-6', text: 'We have been making more. Become better. Move between numbers.', difficulty: 'advanced' },
            { id: 'b9-7', text: 'Can you make it? Come have been moved. Between becoming more amazing.', difficulty: 'advanced' },
            { id: 'b9-8', text: 'Make some time. We have been becoming more. Move between amazing numbers. Can do.', difficulty: 'advanced' },
        ],
    },

    // Lesson 45: Comma and Period
    {
        id: 'bottom-10-punctuation',
        title: 'Commas and Periods',
        description: 'Master comma and period placement. Essential for proper sentences.',
        category: 'bottom-row-advanced',
        keys: [',', '.', 'z', 'x', 'c', 'v', 'b', 'n', 'm'],
        targetWpm: 38,
        targetAccuracy: 90,
        exercises: [
            { id: 'b10-1', text: 'one, two, three. one, two, three.', difficulty: 'beginner' },
            { id: 'b10-2', text: 'Come here. Stay there. Move, now.', difficulty: 'beginner' },
            { id: 'b10-3', text: 'Yes, we can. No, we cannot. Maybe, we might.', difficulty: 'intermediate' },
            { id: 'b10-4', text: 'First, second, third. Make one, take two.', difficulty: 'intermediate' },
            { id: 'b10-5', text: 'Move forward, not back. Come, go, stay.', difficulty: 'intermediate' },
            { id: 'b10-6', text: 'We make things, big and small. Come one, come all. Stay, please.', difficulty: 'advanced' },
            { id: 'b10-7', text: 'Between you and me, this is great. Make it count, every time.', difficulty: 'advanced' },
            { id: 'b10-8', text: 'First, begin. Second, continue. Third, complete. Now, move on.', difficulty: 'advanced' },
        ],
    },

    // Lesson 46: Passage Practice
    {
        id: 'bottom-11-passages',
        title: 'Real Passages',
        description: 'Type longer, meaningful text. This simulates real typing situations.',
        category: 'bottom-row-advanced',
        keys: ['z', 'x', 'c', 'v', 'b', 'n', 'm', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        targetWpm: 42,
        targetAccuracy: 90,
        exercises: [
            { id: 'b11-1', text: 'Practice makes progress. We become better every day. Make time for growth.', difficulty: 'beginner' },
            { id: 'b11-2', text: 'Between all the choices, pick the best one. Move forward with confidence.', difficulty: 'beginner' },
            { id: 'b11-3', text: 'Amazing things happen to those who practice. Make your fingers move with purpose.', difficulty: 'intermediate' },
            { id: 'b11-4', text: 'We have come a long way. Many lessons have been completed. More await your effort.', difficulty: 'intermediate' },
            { id: 'b11-5', text: 'Become excellent at typing. Make no excuses. Move between keys with ease and grace.', difficulty: 'intermediate' },
            { id: 'b11-6', text: 'Every number matters. Between zero and nine, combinations become infinite. Make them count.', difficulty: 'advanced' },
            { id: 'b11-7', text: 'We can make amazing progress when we focus. Become better. Move confidently. Come back often.', difficulty: 'advanced' },
            { id: 'b11-8', text: 'Practice builds competence. Competence builds confidence. Confidence makes you an excellent typist.', difficulty: 'advanced' },
        ],
    },

    // Lesson 47: Bottom Row Graduation
    {
        id: 'bottom-12-graduation',
        title: 'Bottom Row Graduation',
        description: 'Final test for bottom row mastery! Complete all three rows.',
        category: 'bottom-row-advanced',
        keys: ['z', 'x', 'c', 'v', 'b', 'n', 'm', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        targetWpm: 44,
        targetAccuracy: 91,
        exercises: [
            { id: 'b12-1', text: 'You have come far. Make every keystroke count. Become excellent.', difficulty: 'beginner' },
            { id: 'b12-2', text: 'Between practice and progress, choose both. Move forward always.', difficulty: 'beginner' },
            { id: 'b12-3', text: 'Amazing typists make consistent progress. We have been building skills every day.', difficulty: 'intermediate' },
            { id: 'b12-4', text: 'Can you make it through? Come back stronger. Because practice matters.', difficulty: 'intermediate' },
            { id: 'b12-5', text: 'Numbers and letters combine beautifully. Make every combination count. Move with purpose.', difficulty: 'intermediate' },
            { id: 'b12-6', text: 'We have become excellent at combining all three rows. Amazing progress has been made.', difficulty: 'advanced' },
            { id: 'b12-7', text: 'Between all the lessons, this one matters most. Make it count. You can become amazing.', difficulty: 'advanced' },
            { id: 'b12-8', text: 'Excellent typing comes from excellent practice. Make time every day. Become the best version of you.', difficulty: 'advanced' },
        ],
    },
];

export { bottomRowLessons };
