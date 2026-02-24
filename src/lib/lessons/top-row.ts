import { Lesson } from '@/types';

// ============================================================================
// TOP ROW MODULE - 15 Lessons
// Focus: QWERTYUIOP keys with real words combining home row + top row
// ============================================================================

const topRowLessons: Lesson[] = [
    // Lesson 21: Q and P (Pinky Reach)
    {
        id: 'top-1-qp',
        title: 'Pinky Reach: Q and P',
        description: 'Extend your pinkies to Q (left) and P (right). Keep other fingers on home row.',
        category: 'top-row-basics',
        keys: ['q', 'p', 'a', 's', 'd', 'f', 'j', 'k', 'l'],
        targetWpm: 28,
        targetAccuracy: 90,
        exercises: [
            { id: 't1-1', text: 'qq pp qq pp qq pp qq pp qq pp', difficulty: 'beginner' },
            { id: 't1-2', text: 'qp pq qp pq qp pq qp pq qp pq', difficulty: 'beginner' },
            { id: 't1-3', text: 'pap pap pap pap pap pap pap pap', difficulty: 'beginner' },
            { id: 't1-4', text: 'slap slap slap slap slap slap', difficulty: 'intermediate' },
            { id: 't1-5', text: 'sap gap lap sap gap lap sap gap', difficulty: 'intermediate' },
            { id: 't1-6', text: 'A glad papa slaps. All pals clap.', difficulty: 'intermediate' },
            { id: 't1-7', text: 'Papa has a glass. Pals clap. A gap falls. Slap a pad.', difficulty: 'advanced' },
            { id: 't1-8', text: 'All glad pals shall clap as papa slaps. A gap. A sap. A lap.', difficulty: 'advanced' },
        ],
    },

    // Lesson 22: W and O (Ring Finger Reach)
    {
        id: 'top-2-wo',
        title: 'Ring Finger: W and O',
        description: 'Reach up with ring fingers to W (left) and O (right). This opens up many words!',
        category: 'top-row-basics',
        keys: ['w', 'o', 'q', 'p', 'a', 's', 'd', 'f', 'j', 'k', 'l'],
        targetWpm: 30,
        targetAccuracy: 90,
        exercises: [
            { id: 't2-1', text: 'ww oo ww oo ww oo ww oo ww oo', difficulty: 'beginner' },
            { id: 't2-2', text: 'wow wow wow wow wow wow wow', difficulty: 'beginner' },
            { id: 't2-3', text: 'low so do go low so do go low', difficulty: 'beginner' },
            { id: 't2-4', text: 'glow flow slow grow glow flow slow grow', difficulty: 'intermediate' },
            { id: 't2-5', text: 'good food wood hood good food wood hood', difficulty: 'intermediate' },
            { id: 't2-6', text: 'A good dog. Slow flow. Grow low. So go.', difficulty: 'intermediate' },
            { id: 't2-7', text: 'Do go slow. Good food flows. A wolf howls. So low.', difficulty: 'advanced' },
            { id: 't2-8', text: 'Wow! Good dogs glow. Slow wood flows. Go do walk. So food grows.', difficulty: 'advanced' },
        ],
    },

    // Lesson 23: E (Middle Finger Left) - Most Common Letter
    {
        id: 'top-3-e',
        title: 'The Essential E',
        description: 'E is the most common letter in English! Master it with your left middle finger.',
        category: 'top-row-basics',
        keys: ['e', 'w', 'o', 'a', 's', 'd', 'f', 'j', 'k', 'l'],
        targetWpm: 32,
        targetAccuracy: 91,
        exercises: [
            { id: 't3-1', text: 'ee ee ee ee ee ee ee ee ee ee', difficulty: 'beginner' },
            { id: 't3-2', text: 'the the the the the the the the', difficulty: 'beginner' },
            { id: 't3-3', text: 'he she we see he she we see he', difficulty: 'beginner' },
            { id: 't3-4', text: 'else edge here were else edge here', difficulty: 'intermediate' },
            { id: 't3-5', text: 'feed seed weed deed feed seed weed', difficulty: 'intermediate' },
            { id: 't3-6', text: 'We see the edge. She feeds seeds. He goes.', difficulty: 'intermediate' },
            { id: 't3-7', text: 'She sees a geese. We feed the deer. He goes else.', difficulty: 'advanced' },
            { id: 't3-8', text: 'The seeds feed geese. We see a deer here. She goes elsewhere.', difficulty: 'advanced' },
        ],
    },

    // Lesson 24: I (Middle Finger Right)
    {
        id: 'top-4-i',
        title: 'Index I',
        description: 'I opens up essential words like "is", "it", "if". Right middle finger reaches up.',
        category: 'top-row-basics',
        keys: ['i', 'e', 'w', 'o', 'a', 's', 'd', 'f', 'j', 'k', 'l'],
        targetWpm: 33,
        targetAccuracy: 91,
        exercises: [
            { id: 't4-1', text: 'ii ii ii ii ii ii ii ii ii ii', difficulty: 'beginner' },
            { id: 't4-2', text: 'is it if in is it if in is it', difficulty: 'beginner' },
            { id: 't4-3', text: 'I I I I I I I I I I', difficulty: 'beginner' },
            { id: 't4-4', text: 'kid did lid kid did lid kid did', difficulty: 'intermediate' },
            { id: 't4-5', text: 'side wide idea side wide idea side', difficulty: 'intermediate' },
            { id: 't4-6', text: 'It is a wide side. I like this idea.', difficulty: 'intermediate' },
            { id: 't4-7', text: 'If a kid is wise, ideas flow. I did like it.', difficulty: 'advanced' },
            { id: 't4-8', text: 'I will go if it is a good idea. Kids like wide slides.', difficulty: 'advanced' },
        ],
    },

    // Lesson 25: R (Index Finger Left Reach)
    {
        id: 'top-5-r',
        title: 'Reaching R',
        description: 'R requires a slight reach up-left from F. Essential for many common words.',
        category: 'top-row-basics',
        keys: ['r', 'i', 'e', 'w', 'o', 'a', 's', 'd', 'f', 'j', 'k', 'l'],
        targetWpm: 34,
        targetAccuracy: 90,
        exercises: [
            { id: 't5-1', text: 'rr rr rr rr rr rr rr rr rr rr', difficulty: 'beginner' },
            { id: 't5-2', text: 'are for her are for her are for', difficulty: 'beginner' },
            { id: 't5-3', text: 'red ride road red ride road red', difficulty: 'beginner' },
            { id: 't5-4', text: 'order reader rider order reader rider', difficulty: 'intermediate' },
            { id: 't5-5', text: 'we are here; for readers; ride far', difficulty: 'intermediate' },
            { id: 't5-6', text: 'Readers ride far. Red roads are wide. Her order is here.', difficulty: 'intermediate' },
            { id: 't5-7', text: 'We are riders. Roads are for readers. Order her red dress.', difficulty: 'advanced' },
            { id: 't5-8', text: 'Readers ride roads for her. We are here. Order red roses far.', difficulty: 'advanced' },
        ],
    },

    // Lesson 26: U (Index Finger Right Reach)
    {
        id: 'top-6-u',
        title: 'Useful U',
        description: 'U sits above J. Reach up with your right index finger while keeping J as anchor.',
        category: 'top-row-intermediate',
        keys: ['u', 'r', 'i', 'e', 'w', 'o', 'a', 's', 'd', 'f', 'j', 'k', 'l'],
        targetWpm: 34,
        targetAccuracy: 90,
        exercises: [
            { id: 't6-1', text: 'uu uu uu uu uu uu uu uu uu uu', difficulty: 'beginner' },
            { id: 't6-2', text: 'us use our us use our us use our', difficulty: 'beginner' },
            { id: 't6-3', text: 'up hug run up hug run up hug run', difficulty: 'beginner' },
            { id: 't6-4', text: 'fruit sugar awful fruit sugar awful', difficulty: 'intermediate' },
            { id: 't6-5', text: 'Our house is huge. Use our sugar.', difficulty: 'intermediate' },
            { id: 't6-6', text: 'Ducks run up. Our fruit is ripe. She hugs us.', difficulty: 'intermediate' },
            { id: 't6-7', text: 'Four ducks use our huge house. Sugar is useful.', difficulty: 'advanced' },
            { id: 't6-8', text: 'Our group runs up. Use fruit for sugar. Ducks hug us four.', difficulty: 'advanced' },
        ],
    },

    // Lesson 27: T (Common Letter - Left Index Reach)
    {
        id: 'top-7-t',
        title: 'Essential T',
        description: 'T is the second most common consonant. Master it with left index reaching up-right.',
        category: 'top-row-intermediate',
        keys: ['t', 'u', 'r', 'i', 'e', 'w', 'o', 'a', 's', 'd', 'f', 'j', 'k', 'l'],
        targetWpm: 35,
        targetAccuracy: 90,
        exercises: [
            { id: 't7-1', text: 'tt tt tt tt tt tt tt tt tt tt', difficulty: 'beginner' },
            { id: 't7-2', text: 'to the that to the that to the', difficulty: 'beginner' },
            { id: 't7-3', text: 'it at eat sit it at eat sit it', difficulty: 'beginner' },
            { id: 't7-4', text: 'true water little true water little', difficulty: 'intermediate' },
            { id: 't7-5', text: 'eat at the gate; sit at the wall', difficulty: 'intermediate' },
            { id: 't7-6', text: 'The little turtle eats at the water. Sit to rest.', difficulty: 'intermediate' },
            { id: 't7-7', text: 'True, it is little. Water that turtle. Sit at the gate.', difficulty: 'advanced' },
            { id: 't7-8', text: 'Wait at the gate. True turtles eat at water. Little stars sit there.', difficulty: 'advanced' },
        ],
    },

    // Lesson 28: Y (Right Index Stretch)
    {
        id: 'top-8-y',
        title: 'Stretching to Y',
        description: 'Y requires the longest stretch from J. Practice this reach carefully.',
        category: 'top-row-intermediate',
        keys: ['y', 't', 'u', 'r', 'i', 'e', 'w', 'o', 'a', 's', 'd', 'f', 'j', 'k', 'l'],
        targetWpm: 34,
        targetAccuracy: 89,
        exercises: [
            { id: 't8-1', text: 'yy yy yy yy yy yy yy yy yy yy', difficulty: 'beginner' },
            { id: 't8-2', text: 'you yes yet you yes yet you yes', difficulty: 'beginner' },
            { id: 't8-3', text: 'day way say day way say day way', difficulty: 'beginner' },
            { id: 't8-4', text: 'your they very your they very your', difficulty: 'intermediate' },
            { id: 't8-5', text: 'yesterday really yourself yesterday', difficulty: 'intermediate' },
            { id: 't8-6', text: 'They say you are very ready. Yesterday was your day.', difficulty: 'intermediate' },
            { id: 't8-7', text: 'You say yes. They stay away. Your yesterday was great.', difficulty: 'advanced' },
            { id: 't8-8', text: 'Yesterday you really tried. They say your way is easy. Very true.', difficulty: 'advanced' },
        ],
    },

    // Lesson 29: Full Top Row Review
    {
        id: 'top-9-review',
        title: 'Top Row Review',
        description: 'Practice all top row keys together. Focus on smooth transitions from home row.',
        category: 'top-row-intermediate',
        keys: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        targetWpm: 36,
        targetAccuracy: 89,
        exercises: [
            { id: 't9-1', text: 'qwerty uiop qwerty uiop qwerty', difficulty: 'beginner' },
            { id: 't9-2', text: 'poiuyt rewq poiuyt rewq poiuyt', difficulty: 'beginner' },
            { id: 't9-3', text: 'write quite poetry write quite poetry', difficulty: 'intermediate' },
            { id: 't9-4', text: 'power tower quiet power tower quiet', difficulty: 'intermediate' },
            { id: 't9-5', text: 'your quite powerful tower requires quiet', difficulty: 'intermediate' },
            { id: 't9-6', text: 'Write poetry quietly. Power your tower. Require quiet.', difficulty: 'advanced' },
            { id: 't9-7', text: 'Quite powerful poetry requires your quiet tower. Write it well.', difficulty: 'advanced' },
            { id: 't9-8', text: 'Your typewriter requires quite a powerful tower for poetry. Write quietly.', difficulty: 'advanced' },
        ],
    },

    // Lesson 30: Common Words with Top Row
    {
        id: 'top-10-words',
        title: 'Top Row Words',
        description: 'The most common English words use top row heavily. Master these essential words.',
        category: 'top-row-intermediate',
        keys: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
        targetWpm: 38,
        targetAccuracy: 90,
        exercises: [
            { id: 't10-1', text: 'the to it is you that was for are', difficulty: 'beginner' },
            { id: 't10-2', text: 'what your their people would other', difficulty: 'beginner' },
            { id: 't10-3', text: 'write quite power require type pretty', difficulty: 'intermediate' },
            { id: 't10-4', text: 'The people would write to you. It was quite good.', difficulty: 'intermediate' },
            { id: 't10-5', text: 'You require that power. They type for other people.', difficulty: 'intermediate' },
            { id: 't10-6', text: 'Your people write pretty poetry. What you require is quite real.', difficulty: 'advanced' },
            { id: 't10-7', text: 'Would you write that for their people? It quite requires your power.', difficulty: 'advanced' },
            { id: 't10-8', text: 'The other people require you to write it. Their poetry was quite pretty yesterday.', difficulty: 'advanced' },
        ],
    },

    // Lesson 31: Phrases and Sentences
    {
        id: 'top-11-phrases',
        title: 'Fluent Phrases',
        description: 'Type natural phrases combining home row and top row. Build sentence fluency.',
        category: 'top-row-advanced',
        keys: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
        targetWpm: 40,
        targetAccuracy: 90,
        exercises: [
            { id: 't11-1', text: 'to the store; over there; with you', difficulty: 'beginner' },
            { id: 't11-2', text: 'write it here; go there; quite good', difficulty: 'beginner' },
            { id: 't11-3', text: 'Your idea is quite good. They are ready.', difficulty: 'intermediate' },
            { id: 't11-4', text: 'People write poetry. We require power. You type fast.', difficulty: 'intermediate' },
            { id: 't11-5', text: 'It was a beautiful day. The tower stood tall. Write it here.', difficulty: 'intermediate' },
            { id: 't11-6', text: 'Their request requires your response. We will go to the store today.', difficulty: 'advanced' },
            { id: 't11-7', text: 'You are quite right. Please write your letter. The fruit is ready.', difficulty: 'advanced' },
            { id: 't11-8', text: 'People require power to progress. Your poetry is quite beautiful. We wrote it yesterday.', difficulty: 'advanced' },
        ],
    },

    // Lesson 32: Speed Building - Quick Words
    {
        id: 'top-12-speed',
        title: 'Speed Burst: Quick Words',
        description: 'Type short, common words rapidly. Build speed with high-frequency terms.',
        category: 'top-row-advanced',
        keys: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
        targetWpm: 45,
        targetAccuracy: 88,
        exercises: [
            { id: 't12-1', text: 'the the the to to to it it it', difficulty: 'beginner' },
            { id: 't12-2', text: 'you you are are was was for for', difficulty: 'beginner' },
            { id: 't12-3', text: 'is it to the for you are they we', difficulty: 'beginner' },
            { id: 't12-4', text: 'your your their their would would other', difficulty: 'intermediate' },
            { id: 't12-5', text: 'what where were will with would', difficulty: 'intermediate' },
            { id: 't12-6', text: 'The day is here. You are ready. We will go.', difficulty: 'intermediate' },
            { id: 't12-7', text: 'What would you do if it were true? They were here.', difficulty: 'advanced' },
            { id: 't12-8', text: 'It was quite late. You are with us. We were there yesterday. Would you go?', difficulty: 'advanced' },
        ],
    },

    // Lesson 33: Accuracy Focus - Top Row
    {
        id: 'top-13-accuracy',
        title: 'Precision Practice',
        description: 'Slow down and focus on perfect typing. No errors! Build muscle memory.',
        category: 'top-row-advanced',
        keys: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        targetWpm: 32,
        targetAccuracy: 98,
        exercises: [
            { id: 't13-1', text: 'q w e r t y u i o p q w e r t y u i o p', difficulty: 'beginner' },
            { id: 't13-2', text: 'the to it is you are for was with', difficulty: 'beginner' },
            { id: 't13-3', text: 'Write quite proper poetry. Your tower.', difficulty: 'intermediate' },
            { id: 't13-4', text: 'quit upper tower power write quite', difficulty: 'intermediate' },
            { id: 't13-5', text: 'It is quite true. You are right here.', difficulty: 'intermediate' },
            { id: 't13-6', text: 'Your quiet poetry requires proper power. We write it well.', difficulty: 'advanced' },
            { id: 't13-7', text: 'People quite properly require true quiet. Your tower is here.', difficulty: 'advanced' },
            { id: 't13-8', text: 'Write your poetry quietly. The proper tower requires quite a lot of power.', difficulty: 'advanced' },
        ],
    },

    // Lesson 34: Longer Passages
    {
        id: 'top-14-passages',
        title: 'Passage Typing',
        description: 'Type longer connected text. Practice reading ahead while typing.',
        category: 'top-row-advanced',
        keys: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
        targetWpm: 42,
        targetAccuracy: 90,
        exercises: [
            { id: 't14-1', text: 'The sun rose early today. You are up with it. We will go out.', difficulty: 'beginner' },
            { id: 't14-2', text: 'People write poetry for those they love. It is quite a skill.', difficulty: 'beginner' },
            { id: 't14-3', text: 'Your ideas require proper delivery. Type with purpose. Write it out.', difficulty: 'intermediate' },
            { id: 't14-4', text: 'The tower is quite tall. You would see it for great reality. People require quiet.', difficulty: 'intermediate' },
            { id: 't14-5', text: 'Yesterday we wrote letters. Today we will type other letters. You are ready.', difficulty: 'intermediate' },
            { id: 't14-6', text: 'Write your poetry with power. The quiet day is here for you. People require rest.', difficulty: 'advanced' },
            { id: 't14-7', text: 'Their ideas were quite popular. You would require proper thought. We wrote it yesterday.', difficulty: 'advanced' },
            { id: 't14-8', text: 'The towers stood quiet. People wrote great poetry. Your ideas require purpose. We type fast.', difficulty: 'advanced' },
        ],
    },

    // Lesson 35: Top Row Graduation
    {
        id: 'top-15-graduation',
        title: 'Top Row Graduation',
        description: 'Final test for top row mastery! Prove your skill with these challenges.',
        category: 'top-row-advanced',
        keys: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
        targetWpm: 44,
        targetAccuracy: 91,
        exercises: [
            { id: 't15-1', text: 'Type the quick power. You require it. We write poetry for you.', difficulty: 'beginner' },
            { id: 't15-2', text: 'Your poetry was quite good. They would read it. People like true art.', difficulty: 'beginner' },
            { id: 't15-3', text: 'The tower stood quietly. Your ideas require purpose. Type it out properly.', difficulty: 'intermediate' },
            { id: 't15-4', text: 'We wrote quite a lot yesterday. Your purpose is true. People require quality.', difficulty: 'intermediate' },
            { id: 't15-5', text: 'Power your typewriter with purpose. The quiet tower is your goal. Write poetry today.', difficulty: 'intermediate' },
            { id: 't15-6', text: 'It was quite a day. You are ready for the future. People wrote great works yesterday.', difficulty: 'advanced' },
            { id: 't15-7', text: 'Their typewriter required proper power. We wrote quite a lot. Your purpose is true quality.', difficulty: 'advanced' },
            { id: 't15-8', text: 'Yesterday people wrote great poetry. Today you will type with power. The quiet tower awaits your work.', difficulty: 'advanced' },
        ],
    },
];

export { topRowLessons };
