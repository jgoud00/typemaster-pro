import { Lesson } from '@/types';

// ============================================================================
// HOME ROW ADVANCED MODULE - 10 Lessons
// Focus: Fluency with all home row keys including capitals and punctuation
// ============================================================================

const homeRowAdvancedLessons: Lesson[] = [
    // Lesson 11: Speed Building with Common Words
    {
        id: 'home-11-speed',
        title: 'Speed Building: Common Words',
        description: 'Build typing speed with the most common home row words. Focus on rhythm and flow.',
        category: 'home-row-advanced',
        keys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
        targetWpm: 35,
        targetAccuracy: 92,
        exercises: [
            { id: 'h11-1', text: 'all all all all all all all all all all', difficulty: 'beginner' },
            { id: 'h11-2', text: 'ask has had add ask has had add ask has', difficulty: 'beginner' },
            { id: 'h11-3', text: 'add all ask has had add all ask has had', difficulty: 'beginner' },
            { id: 'h11-4', text: 'glad flash dash shall glad flash dash shall', difficulty: 'intermediate' },
            { id: 'h11-5', text: 'fall glass flask salad fall glass flask salad', difficulty: 'intermediate' },
            { id: 'h11-6', text: 'dad has a glass; a lad shall ask; all fall', difficulty: 'intermediate' },
            { id: 'h11-7', text: 'half a salad; glad dad; all lads dash; flash glass', difficulty: 'advanced' },
            { id: 'h11-8', text: 'a glad dad has half a flask; all shall add salads; lads dash fast', difficulty: 'advanced' },
        ],
    },

    // Lesson 12: Shift Key Introduction - Capitals
    {
        id: 'home-12-shift',
        title: 'Capital Letters',
        description: 'Learn to use Shift for capital letters. Press Shift with the opposite hand of the letter.',
        category: 'home-row-advanced',
        keys: ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        targetWpm: 30,
        targetAccuracy: 90,
        exercises: [
            { id: 'h12-1', text: 'A A A A A A A A A A', difficulty: 'beginner' },
            { id: 'h12-2', text: 'Dad Dad Dad Dad Dad Dad', difficulty: 'beginner' },
            { id: 'h12-3', text: 'Al Sal Al Sal Al Sal Al Sal', difficulty: 'beginner' },
            { id: 'h12-4', text: 'Flash Dash Glass Flask Flash Dash', difficulty: 'intermediate' },
            { id: 'h12-5', text: 'Ada has a salad. Dad asks all.', difficulty: 'intermediate' },
            { id: 'h12-6', text: 'Al and Ada shall add salads. Dad asks.', difficulty: 'intermediate' },
            { id: 'h12-7', text: 'A Glad Lad. All Shall Fall. Dad Has Glass.', difficulty: 'advanced' },
            { id: 'h12-8', text: 'Sad Ada asks Dad. All lads shall dash. Flash falls.', difficulty: 'advanced' },
        ],
    },

    // Lesson 13: Common Phrases
    {
        id: 'home-13-phrases',
        title: 'Common Phrases',
        description: 'Type natural phrases to develop typing flow. Think in phrases, not individual letters.',
        category: 'home-row-advanced',
        keys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
        targetWpm: 35,
        targetAccuracy: 91,
        exercises: [
            { id: 'h13-1', text: 'ask dad; has all; add salad; glad lad', difficulty: 'beginner' },
            { id: 'h13-2', text: 'a sad lass; a glad dad; all shall fall', difficulty: 'beginner' },
            { id: 'h13-3', text: 'half a glass; flash a dash; add a salad', difficulty: 'beginner' },
            { id: 'h13-4', text: 'ask all lads; dad has a flask; salads fall', difficulty: 'intermediate' },
            { id: 'h13-5', text: 'a glad dad adds; all shall ask; lads dash', difficulty: 'intermediate' },
            { id: 'h13-6', text: 'as a flask falls; glad lads gasp; dad asks all', difficulty: 'intermediate' },
            { id: 'h13-7', text: 'A sad lass shall ask dad. All glad lads add salads. Half falls.', difficulty: 'advanced' },
            { id: 'h13-8', text: 'Dad has a glass flask. All lads shall dash. A glad lass adds salad.', difficulty: 'advanced' },
        ],
    },

    // Lesson 14: Punctuation Practice
    {
        id: 'home-14-punctuation',
        title: 'Punctuation: Period and Semicolon',
        description: 'Master the period and semicolon for proper sentence structure.',
        category: 'home-row-advanced',
        keys: ['.', ';', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
        targetWpm: 32,
        targetAccuracy: 90,
        exercises: [
            { id: 'h14-1', text: 'dad. dad. dad. dad. dad. dad.', difficulty: 'beginner' },
            { id: 'h14-2', text: 'ask; add; all; has; ask; add;', difficulty: 'beginner' },
            { id: 'h14-3', text: 'A lad falls. A lass gasps. Dad asks.', difficulty: 'beginner' },
            { id: 'h14-4', text: 'All shall fall; dad adds salad; lass asks.', difficulty: 'intermediate' },
            { id: 'h14-5', text: 'Glad lads. Sad lass. Flash falls. Glass dash.', difficulty: 'intermediate' },
            { id: 'h14-6', text: 'Ask dad; add half; all shall fall. A lass gasps.', difficulty: 'intermediate' },
            { id: 'h14-7', text: 'A glad dad has salads. All lads dash; lass falls. Add glass.', difficulty: 'advanced' },
            { id: 'h14-8', text: 'Salads fall; all gasp. Dad asks a lass. Half a flask; glad lads.', difficulty: 'advanced' },
        ],
    },

    // Lesson 15: Rhythm and Flow
    {
        id: 'home-15-rhythm',
        title: 'Rhythm and Flow',
        description: 'Develop consistent typing rhythm. Keep a steady pace without rushing.',
        category: 'home-row-advanced',
        keys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
        targetWpm: 38,
        targetAccuracy: 91,
        exercises: [
            { id: 'h15-1', text: 'as as as as; has has has has; add add add add', difficulty: 'beginner' },
            { id: 'h15-2', text: 'all all all; ask ask ask; dad dad dad; sad sad sad', difficulty: 'beginner' },
            { id: 'h15-3', text: 'glad glad glad glad; dash dash dash dash', difficulty: 'beginner' },
            { id: 'h15-4', text: 'flash flash flash; salad salad salad; glass glass glass', difficulty: 'intermediate' },
            { id: 'h15-5', text: 'Add salads. Add salads. Add salads. Add salads.', difficulty: 'intermediate' },
            { id: 'h15-6', text: 'All lads shall dash. All lads shall dash. All lads shall dash.', difficulty: 'intermediate' },
            { id: 'h15-7', text: 'A glad dad. A sad lass. A flash falls. A glass dash. All shall ask.', difficulty: 'advanced' },
            { id: 'h15-8', text: 'Dad adds salads as lads dash. A glad lass asks all. Half a flask falls.', difficulty: 'advanced' },
        ],
    },

    // Lesson 16: Word Patterns
    {
        id: 'home-16-patterns',
        title: 'Word Patterns',
        description: 'Recognize common letter patterns to type faster. Your fingers will learn the patterns.',
        category: 'home-row-advanced',
        keys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
        targetWpm: 38,
        targetAccuracy: 90,
        exercises: [
            // -all pattern
            { id: 'h16-1', text: 'all fall hall shall all fall hall shall', difficulty: 'beginner' },
            // -ass pattern  
            { id: 'h16-2', text: 'alas glass class lass alas glass class lass', difficulty: 'beginner' },
            // -ash pattern
            { id: 'h16-3', text: 'flash dash hash gash flash dash hash gash', difficulty: 'beginner' },
            // -add pattern
            { id: 'h16-4', text: 'add dad glad had sad add dad glad had sad', difficulty: 'intermediate' },
            // Mixed patterns
            { id: 'h16-5', text: 'all glass flash hall fall dash shall hash', difficulty: 'intermediate' },
            { id: 'h16-6', text: 'All shall fall. Glass flash. Dad had salads.', difficulty: 'intermediate' },
            { id: 'h16-7', text: 'A flash hall; all lass class; dad had glad hash.', difficulty: 'advanced' },
            { id: 'h16-8', text: 'Flash glass falls. All shall dash. Glad lads had salads. Hall class.', difficulty: 'advanced' },
        ],
    },

    // Lesson 17: Accuracy Focus
    {
        id: 'home-17-accuracy',
        title: 'Accuracy Challenge',
        description: 'Slow down and focus on 100% accuracy. Perfect practice makes perfect.',
        category: 'home-row-advanced',
        keys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
        targetWpm: 30,
        targetAccuracy: 98,
        exercises: [
            { id: 'h17-1', text: 'a s d f g h j k l a s d f g h j k l', difficulty: 'beginner' },
            { id: 'h17-2', text: 'dad sad glad had fad dad sad glad had fad', difficulty: 'beginner' },
            { id: 'h17-3', text: 'All lads ask. Dad adds. A lass falls.', difficulty: 'beginner' },
            { id: 'h17-4', text: 'ask dad; add salad; flash glass; hall dash', difficulty: 'intermediate' },
            { id: 'h17-5', text: 'A glad lass has a flask. All shall fall.', difficulty: 'intermediate' },
            { id: 'h17-6', text: 'Sad dad asks all lads. Flash glass falls. Add salads.', difficulty: 'intermediate' },
            { id: 'h17-7', text: 'Half a glass flask falls. A glad dad shall add salads. All lads dash.', difficulty: 'advanced' },
            { id: 'h17-8', text: 'Ask a lass. Dad has a flask. All shall add. Glad lads dash. Hall falls.', difficulty: 'advanced' },
        ],
    },

    // Lesson 18: Speed Challenge  
    {
        id: 'home-18-speed-challenge',
        title: 'Speed Challenge',
        description: 'Push your speed while maintaining good accuracy. Find your comfortable fast pace.',
        category: 'home-row-advanced',
        keys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
        targetWpm: 45,
        targetAccuracy: 88,
        exercises: [
            { id: 'h18-1', text: 'as as as has has has add add add all all all', difficulty: 'beginner' },
            { id: 'h18-2', text: 'dad dad lad lad sad sad glad glad fad fad', difficulty: 'beginner' },
            { id: 'h18-3', text: 'ask ask dash dash flash flash glass glass', difficulty: 'beginner' },
            { id: 'h18-4', text: 'all lads; glad dad; sad lass; add salad; half flask', difficulty: 'intermediate' },
            { id: 'h18-5', text: 'A lad asks. Dad adds. All fall. Lass gasps. Flash dash.', difficulty: 'intermediate' },
            { id: 'h18-6', text: 'Glad dads add salads. All lads shall dash. A flask falls. Glass flash.', difficulty: 'intermediate' },
            { id: 'h18-7', text: 'Ask all lads. Dad has half a glass flask. A glad lass adds salads. All shall fall.', difficulty: 'advanced' },
            { id: 'h18-8', text: 'A sad dad asks all. Flash glass falls. Glad lads dash. All shall add salads. Half a flask.', difficulty: 'advanced' },
        ],
    },

    // Lesson 19: Passage Typing
    {
        id: 'home-19-passages',
        title: 'Passage Practice',
        description: 'Type longer connected passages. This simulates real-world typing.',
        category: 'home-row-advanced',
        keys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
        targetWpm: 40,
        targetAccuracy: 90,
        exercises: [
            { id: 'h19-1', text: 'A glad dad has a glass flask. All lads shall ask.', difficulty: 'beginner' },
            { id: 'h19-2', text: 'Sad lass adds salads. Dad asks all. Flash falls.', difficulty: 'beginner' },
            { id: 'h19-3', text: 'All shall fall as a glad lad dashes. A lass gasps. Dad adds half.', difficulty: 'intermediate' },
            { id: 'h19-4', text: 'A flash glass falls. All glad dads shall add salads. Lads dash as a lass falls.', difficulty: 'intermediate' },
            { id: 'h19-5', text: 'Dad has a glass flask. All lads ask. A glad lass adds salads. Half shall fall.', difficulty: 'intermediate' },
            { id: 'h19-6', text: 'Ask all dads. A glad lass shall add salads. Flash glass falls as lads dash. Half a flask.', difficulty: 'advanced' },
            { id: 'h19-7', text: 'A sad dad asks all lads. Flash glass falls. All shall add salads. A glad lass gasps. Half dashes.', difficulty: 'advanced' },
            { id: 'h19-8', text: 'All glad dads shall ask lads. A lass adds salads as flash glass falls. Half a flask. Dad gasps.', difficulty: 'advanced' },
        ],
    },

    // Lesson 20: Home Row Graduation
    {
        id: 'home-20-graduation',
        title: 'Home Row Graduation',
        description: 'Final home row test! Complete these exercises to prove your mastery.',
        category: 'home-row-advanced',
        keys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
        targetWpm: 42,
        targetAccuracy: 92,
        exercises: [
            { id: 'h20-1', text: 'All dads ask lads. A glad lass adds salads. Flash falls. Half a glass.', difficulty: 'beginner' },
            { id: 'h20-2', text: 'Dad has a flask. All shall dash. A sad lass gasps. Glad lads add salads.', difficulty: 'beginner' },
            { id: 'h20-3', text: 'Ask a glad dad. All lads shall fall. A lass has half a flask. Salads add flash.', difficulty: 'intermediate' },
            { id: 'h20-4', text: 'A glad dad asks all lads. Flash glass falls as a sad lass gasps. Half shall add salads. All dash.', difficulty: 'intermediate' },
            { id: 'h20-5', text: 'All shall ask Dad. A glad lass adds salads. Flash glass falls. Lads dash. Half a flask. Sad gasps.', difficulty: 'intermediate' },
            { id: 'h20-6', text: 'Dad has a glass flask. All glad lads shall dash as a lass adds salads. Flash falls. Half ask. All shall.', difficulty: 'advanced' },
            { id: 'h20-7', text: 'A sad dad asks all glad lads. Flash glass falls as a lass gasps. All shall add half salads. Dads dash. Flask.', difficulty: 'advanced' },
            { id: 'h20-8', text: 'Ask all dads. A glad lass shall add salads as flash glass falls. Half a flask. Lads dash. All gasp. Dad has glass.', difficulty: 'advanced' },
        ],
    },
];

export { homeRowAdvancedLessons };
