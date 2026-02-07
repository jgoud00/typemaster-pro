import { Lesson } from '@/types';

// ============================================================================
// HOME ROW BASICS MODULE - 10 Lessons
// Focus: Building muscle memory with real words using home row keys (asdfghjkl;)
// ============================================================================

const homeRowLessons: Lesson[] = [
    // Lesson 1: Introduction to F and J (Index Fingers - Home Position)
    {
        id: 'home-1-fj',
        title: 'Home Position: F and J',
        description: 'Your index fingers rest on F and J - the keys with bumps. Master these anchor keys first.',
        category: 'home-row-basics',
        keys: ['f', 'j'],
        targetWpm: 20,
        targetAccuracy: 95,
        exercises: [
            // Warm-up
            { id: 'h1-1', text: 'fj fj fj fj fj jf jf jf jf jf', difficulty: 'beginner' },
            { id: 'h1-2', text: 'ff jj ff jj ff jj ff jj ff jj', difficulty: 'beginner' },
            // Real words (limited with just f and j, but building the habit)
            { id: 'h1-3', text: 'fjord fjord fjord fjord fjord', difficulty: 'beginner' },
            // Rhythm building
            { id: 'h1-4', text: 'fj jf fj jf fj jf fj jf fj jf fj jf', difficulty: 'intermediate' },
            { id: 'h1-5', text: 'fjfj jfjf fjfj jfjf fjfj jfjf fjfj', difficulty: 'intermediate' },
            // Challenge - alternating pattern mastery
            { id: 'h1-6', text: 'fjfjfjfj jfjfjfjf fjfjfjfj jfjfjfjf fjfjfjfj', difficulty: 'intermediate' },
            { id: 'h1-7', text: 'ff jj ff jj ff jj ff jj ff jj ff jj ff jj ff jj', difficulty: 'intermediate' },
            { id: 'h1-8', text: 'fj fj fj jf jf jf fj fj fj jf jf jf fj fj fj', difficulty: 'advanced' },
        ],
    },

    // Lesson 2: Adding D and K (Middle Fingers)
    {
        id: 'home-2-dk',
        title: 'Middle Fingers: D and K',
        description: 'Extend to D (left middle) and K (right middle) while keeping index fingers on F and J.',
        category: 'home-row-basics',
        keys: ['d', 'k', 'f', 'j'],
        targetWpm: 22,
        targetAccuracy: 94,
        exercises: [
            // Warm-up with new keys
            { id: 'h2-1', text: 'dk dk dk dk dk kd kd kd kd kd', difficulty: 'beginner' },
            { id: 'h2-2', text: 'dd kk dd kk dd kk dd kk dd kk', difficulty: 'beginner' },
            // Combining with F and J
            { id: 'h2-3', text: 'fd jk fd jk dk fj dk fj fd jk', difficulty: 'beginner' },
            // Real word fragments
            { id: 'h2-4', text: 'fad dad fad dad fad dad fad dad', difficulty: 'intermediate' },
            { id: 'h2-5', text: 'kid kid kid kid kid kid kid kid', difficulty: 'intermediate' },
            // Mixed practice
            { id: 'h2-6', text: 'dad fad kid dad fad kid dad fad kid', difficulty: 'intermediate' },
            { id: 'h2-7', text: 'fjdk dkfj fjdk dkfj fjdk dkfj fjdk', difficulty: 'intermediate' },
            { id: 'h2-8', text: 'dad kid fad dad kid fad dad kid fad dad kid', difficulty: 'advanced' },
        ],
    },

    // Lesson 3: Adding S and L (Ring Fingers)
    {
        id: 'home-3-sl',
        title: 'Ring Fingers: S and L',
        description: 'Add S (left ring) and L (right ring). Now you have six home row keys!',
        category: 'home-row-basics',
        keys: ['s', 'l', 'd', 'k', 'f', 'j'],
        targetWpm: 24,
        targetAccuracy: 93,
        exercises: [
            // Warm-up
            { id: 'h3-1', text: 'sl sl sl sl sl ls ls ls ls ls', difficulty: 'beginner' },
            { id: 'h3-2', text: 'ss ll ss ll ss ll ss ll ss ll', difficulty: 'beginner' },
            // Real words
            { id: 'h3-3', text: 'sad lad sad lad sad lad sad lad', difficulty: 'beginner' },
            { id: 'h3-4', text: 'lasslass lass lass lass lass', difficulty: 'beginner' },
            { id: 'h3-5', text: 'ladslass lads lass lads lass', difficulty: 'intermediate' },
            // Word combinations
            { id: 'h3-6', text: 'sad dad lad lass fadlass sad dad', difficulty: 'intermediate' },
            { id: 'h3-7', text: 'flask flask flask flask flask flask', difficulty: 'intermediate' },
            { id: 'h3-8', text: 'salads flask falls salads flask falls', difficulty: 'advanced' },
            { id: 'h3-9', text: 'sad lads fall as dad askslass', difficulty: 'advanced' },
        ],
    },

    // Lesson 4: Adding A and Semicolon (Pinky Fingers)
    {
        id: 'home-4-a-semi',
        title: 'Pinky Power: A and ;',
        description: 'Complete the home row with A (left pinky) and ; (right pinky). The pinky needs extra practice!',
        category: 'home-row-basics',
        keys: ['a', ';', 's', 'l', 'd', 'k', 'f', 'j'],
        targetWpm: 25,
        targetAccuracy: 92,
        exercises: [
            // Warm-up - pinky focus
            { id: 'h4-1', text: 'aa aa aa aa aa aa aa aa aa aa', difficulty: 'beginner' },
            { id: 'h4-2', text: ';; ;; ;; ;; ;; ;; ;; ;; ;; ;;', difficulty: 'beginner' },
            { id: 'h4-3', text: 'a; a; a; a; a; ;a ;a ;a ;a ;a', difficulty: 'beginner' },
            // Real words with A
            { id: 'h4-4', text: 'add add add all all all ask ask ask', difficulty: 'beginner' },
            { id: 'h4-5', text: 'alas alas alas alas alas alas', difficulty: 'intermediate' },
            { id: 'h4-6', text: 'salad salad salad salad salad', difficulty: 'intermediate' },
            // Sentences with semicolons
            { id: 'h4-7', text: 'add fads; ask lads; all fall; sad lass;', difficulty: 'intermediate' },
            { id: 'h4-8', text: 'a lad asks; a lass falls; a dad adds;', difficulty: 'advanced' },
            { id: 'h4-9', text: 'alas all salads fall; dad asks a sad lass;', difficulty: 'advanced' },
        ],
    },

    // Lesson 5: Full Home Row - Left Hand Focus
    {
        id: 'home-5-left',
        title: 'Left Hand Mastery',
        description: 'Focus on ASDF with real words. Build left hand confidence before full keyboard.',
        category: 'home-row-basics',
        keys: ['a', 's', 'd', 'f'],
        targetWpm: 26,
        targetAccuracy: 93,
        exercises: [
            // Common left-hand words
            { id: 'h5-1', text: 'as as as as as as as as as as', difficulty: 'beginner' },
            { id: 'h5-2', text: 'sad sad sad sad sad sad sad sad', difficulty: 'beginner' },
            { id: 'h5-3', text: 'dad dad dad fad fad fad add add', difficulty: 'beginner' },
            { id: 'h5-4', text: 'sass sass sass sass sass sass', difficulty: 'intermediate' },
            { id: 'h5-5', text: 'dads fads adds sass dads fads', difficulty: 'intermediate' },
            { id: 'h5-6', text: 'a sad dad adds fads as a fad', difficulty: 'intermediate' },
            { id: 'h5-7', text: 'sad dads add sass as fads fade', difficulty: 'advanced' },
            { id: 'h5-8', text: 'a sass dad adds sad fads as dads sass', difficulty: 'advanced' },
        ],
    },

    // Lesson 6: Full Home Row - Right Hand Focus
    {
        id: 'home-6-right',
        title: 'Right Hand Mastery',
        description: 'Focus on JKL; with real words. Strengthen your right hand independently.',
        category: 'home-row-basics',
        keys: ['j', 'k', 'l', ';'],
        targetWpm: 26,
        targetAccuracy: 93,
        exercises: [
            // Right hand patterns
            { id: 'h6-1', text: 'jk jk jk jk jk jk jk jk jk jk', difficulty: 'beginner' },
            { id: 'h6-2', text: 'kl kl kl kl kl kl kl kl kl kl', difficulty: 'beginner' },
            { id: 'h6-3', text: 'jkl jkl jkl jkl jkl jkl jkl', difficulty: 'beginner' },
            { id: 'h6-4', text: 'lkj lkj lkj lkj lkj lkj lkj', difficulty: 'intermediate' },
            { id: 'h6-5', text: 'jkl; jkl; jkl; jkl; jkl; jkl;', difficulty: 'intermediate' },
            { id: 'h6-6', text: ';lkj ;lkj ;lkj ;lkj ;lkj ;lkj', difficulty: 'intermediate' },
            { id: 'h6-7', text: 'jkl; ;lkj jkl; ;lkj jkl; ;lkj', difficulty: 'advanced' },
            { id: 'h6-8', text: 'jk kl l; ;l lk kj jk kl l; ;l lk kj', difficulty: 'advanced' },
        ],
    },

    // Lesson 7: Combining Both Hands - Basic Words
    {
        id: 'home-7-words',
        title: 'Real Words: Home Row',
        description: 'Type complete words using all home row keys. Focus on accuracy over speed.',
        category: 'home-row-basics',
        keys: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'],
        targetWpm: 28,
        targetAccuracy: 92,
        exercises: [
            // Simple words
            { id: 'h7-1', text: 'ask ask ask ask ask ask ask ask', difficulty: 'beginner' },
            { id: 'h7-2', text: 'dad sad lad fad dad sad lad fad', difficulty: 'beginner' },
            { id: 'h7-3', text: 'fall all call fall all call fall', difficulty: 'beginner' },
            { id: 'h7-4', text: 'lasslasslasslass lass lass', difficulty: 'beginner' },
            // Medium words
            { id: 'h7-5', text: 'flask salad falls flask salad falls', difficulty: 'intermediate' },
            { id: 'h7-6', text: 'salads flasksallas salads flasks', difficulty: 'intermediate' },
            { id: 'h7-7', text: 'ask a lad; a lass falls; dad adds', difficulty: 'intermediate' },
            // Word combinations
            { id: 'h7-8', text: 'a sad dad asks all lads as a lass falls', difficulty: 'advanced' },
            { id: 'h7-9', text: 'salads and flasks; all dads ask lads;', difficulty: 'advanced' },
        ],
    },

    // Lesson 8: Adding G and H (Stretch Keys)
    {
        id: 'home-8-gh',
        title: 'Stretch Keys: G and H',
        description: 'G and H require a slight stretch from F and J. These complete your home row reach.',
        category: 'home-row-basics',
        keys: ['g', 'h', 'a', 's', 'd', 'f', 'j', 'k', 'l'],
        targetWpm: 28,
        targetAccuracy: 91,
        exercises: [
            // Warm-up with G and H
            { id: 'h8-1', text: 'gh gh gh gh gh hg hg hg hg hg', difficulty: 'beginner' },
            { id: 'h8-2', text: 'gg hh gg hh gg hh gg hh gg hh', difficulty: 'beginner' },
            // G words
            { id: 'h8-3', text: 'gag gag gag gag gag gag gag', difficulty: 'beginner' },
            { id: 'h8-4', text: 'gas glad flag glad gas flag', difficulty: 'intermediate' },
            // H words
            { id: 'h8-5', text: 'had has hall half had has hall', difficulty: 'intermediate' },
            { id: 'h8-6', text: 'hash dash gash lash hash dash', difficulty: 'intermediate' },
            // Combined
            { id: 'h8-7', text: 'half a glass; glad lads dash; gas flash', difficulty: 'advanced' },
            { id: 'h8-8', text: 'a glad lad has half a glass; hash flash;', difficulty: 'advanced' },
            { id: 'h8-9', text: 'glad dads dash; lads gasp; hash salads fall', difficulty: 'advanced' },
        ],
    },

    // Lesson 9: Full Home Row Sentences
    {
        id: 'home-9-sentences',
        title: 'Home Row Sentences',
        description: 'Put it all together with complete sentences using home row keys.',
        category: 'home-row-basics',
        keys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
        targetWpm: 30,
        targetAccuracy: 90,
        exercises: [
            // Simple sentences
            { id: 'h9-1', text: 'a lad has a flask; a lass asks dad;', difficulty: 'beginner' },
            { id: 'h9-2', text: 'sad dads add salads; glad lads dash;', difficulty: 'beginner' },
            { id: 'h9-3', text: 'all lads shall dash; a flask falls;', difficulty: 'intermediate' },
            { id: 'h9-4', text: 'a glad lass has salad; dads add hash;', difficulty: 'intermediate' },
            // Longer sentences
            { id: 'h9-5', text: 'ask a glad lad; all dads shall add salads;', difficulty: 'intermediate' },
            { id: 'h9-6', text: 'a sad lass gasps as flasks fall; lads dash;', difficulty: 'advanced' },
            { id: 'h9-7', text: 'glad dads ask lads; all shall add hash salads;', difficulty: 'advanced' },
            { id: 'h9-8', text: 'half a glass falls; a lass gasps; sad dads dash', difficulty: 'advanced' },
        ],
    },

    // Lesson 10: Home Row Mastery Challenge
    {
        id: 'home-10-mastery',
        title: 'Home Row Mastery',
        description: 'Final challenge! Type longer passages using only home row keys. Aim for both speed and accuracy.',
        category: 'home-row-basics',
        keys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
        targetWpm: 32,
        targetAccuracy: 90,
        exercises: [
            // Medium passages
            { id: 'h10-1', text: 'a glad lad asks a lass; all dads shall add salads as hash;', difficulty: 'beginner' },
            { id: 'h10-2', text: 'sad lads dash as glass flasks fall; glad dads gasp;', difficulty: 'beginner' },
            { id: 'h10-3', text: 'all shall ask dad; a lass has half a salad; lads add hash;', difficulty: 'intermediate' },
            // Longer passages
            { id: 'h10-4', text: 'a glad dad has a flask; all lads dash as a lass falls; sad dads add salads;', difficulty: 'intermediate' },
            { id: 'h10-5', text: 'ask all lads; glad dads shall add hash; a sad lass gasps as flasks fall;', difficulty: 'intermediate' },
            { id: 'h10-6', text: 'half a glass falls as glad lads dash; all shall ask dad; sad dads add salads;', difficulty: 'advanced' },
            // Full challenge
            { id: 'h10-7', text: 'a glad lad has a full flask; sad dads shall add salads; all lads dash as glass falls; ask a lass;', difficulty: 'advanced' },
            { id: 'h10-8', text: 'as flasks fall all lads gasp; glad dads add hash salads; a sad lass asks all; half shall dash;', difficulty: 'advanced' },
        ],
    },
];

export { homeRowLessons };
