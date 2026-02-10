import { Lesson } from '@/types';

// ============================================================================
// ADVANCED MODULE - 10 Lessons
// Focus: Real-world typing: code, emails, literature, technical docs
// ============================================================================

const advancedLessons: Lesson[] = [
    // Lesson 64: JavaScript Basics
    {
        id: 'adv-1-js',
        title: 'Code: JavaScript Basics',
        description: 'Type real JavaScript code. Variables, functions, and common patterns.',
        category: 'advanced',
        keys: [],
        targetWpm: 35,
        targetAccuracy: 88,
        exercises: [
            { id: 'a1-1', text: 'const name = "John";', difficulty: 'beginner' },
            { id: 'a1-2', text: 'let count = 0; count++;', difficulty: 'beginner' },
            { id: 'a1-3', text: 'function add(a, b) { return a + b; }', difficulty: 'beginner' },
            { id: 'a1-4', text: 'const items = [1, 2, 3, 4, 5];', difficulty: 'intermediate' },
            { id: 'a1-5', text: 'if (user.isActive) { console.log("Hello!"); }', difficulty: 'intermediate' },
            { id: 'a1-6', text: 'const result = items.map(x => x * 2);', difficulty: 'intermediate' },
            { id: 'a1-7', text: 'async function fetchData(url) { const res = await fetch(url); return res.json(); }', difficulty: 'advanced' },
            { id: 'a1-8', text: 'const { name, age } = user; console.log(`${name} is ${age} years old.`);', difficulty: 'advanced' },
        ],
    },

    // Lesson 65: Python Basics
    {
        id: 'adv-2-python',
        title: 'Code: Python Basics',
        description: 'Type real Python code. Clean, readable, and easy to follow.',
        category: 'advanced',
        keys: [],
        targetWpm: 35,
        targetAccuracy: 88,
        exercises: [
            { id: 'a2-1', text: 'name = "Alice"', difficulty: 'beginner' },
            { id: 'a2-2', text: 'numbers = [1, 2, 3, 4, 5]', difficulty: 'beginner' },
            { id: 'a2-3', text: 'def greet(name): return f"Hello, {name}!"', difficulty: 'beginner' },
            { id: 'a2-4', text: 'for item in items: print(item)', difficulty: 'intermediate' },
            { id: 'a2-5', text: 'if x > 0: result = "positive" else: result = "negative"', difficulty: 'intermediate' },
            { id: 'a2-6', text: 'data = {"name": "Bob", "age": 25, "active": True}', difficulty: 'intermediate' },
            { id: 'a2-7', text: 'class User: def __init__(self, name): self.name = name', difficulty: 'advanced' },
            { id: 'a2-8', text: 'result = [x * 2 for x in numbers if x > 0]', difficulty: 'advanced' },
        ],
    },

    // Lesson 66: HTML and CSS
    {
        id: 'adv-3-html',
        title: 'Code: HTML and CSS',
        description: 'Type web markup and styles. Essential for web development.',
        category: 'advanced',
        keys: [],
        targetWpm: 33,
        targetAccuracy: 87,
        exercises: [
            { id: 'a3-1', text: '<div class="container">Hello World</div>', difficulty: 'beginner' },
            { id: 'a3-2', text: '<button id="submit">Click Me</button>', difficulty: 'beginner' },
            { id: 'a3-3', text: '.container { display: flex; }', difficulty: 'beginner' },
            { id: 'a3-4', text: '<input type="text" placeholder="Enter name" />', difficulty: 'intermediate' },
            { id: 'a3-5', text: '#header { background: #333; color: white; }', difficulty: 'intermediate' },
            { id: 'a3-6', text: '<a href="https://example.com" target="_blank">Visit</a>', difficulty: 'intermediate' },
            { id: 'a3-7', text: '@media (max-width: 768px) { .nav { display: none; } }', difficulty: 'advanced' },
            { id: 'a3-8', text: '<form action="/submit" method="POST"><input name="email" required /></form>', difficulty: 'advanced' },
        ],
    },

    // Lesson 67: Professional Email
    {
        id: 'adv-4-email',
        title: 'Professional Email Writing',
        description: 'Type professional emails with proper formatting and tone.',
        category: 'advanced',
        keys: [],
        targetWpm: 40,
        targetAccuracy: 92,
        exercises: [
            { id: 'a4-1', text: 'Dear Mr. Smith,', difficulty: 'beginner' },
            { id: 'a4-2', text: 'Thank you for your email.', difficulty: 'beginner' },
            { id: 'a4-3', text: 'Best regards, John Doe', difficulty: 'beginner' },
            { id: 'a4-4', text: 'I am writing to follow up on our previous discussion.', difficulty: 'intermediate' },
            { id: 'a4-5', text: 'Please find attached the requested documents.', difficulty: 'intermediate' },
            { id: 'a4-6', text: 'I would appreciate your feedback at your earliest convenience.', difficulty: 'intermediate' },
            { id: 'a4-7', text: 'Dear Hiring Manager, I am excited to apply for the Software Developer position at your company.', difficulty: 'advanced' },
            { id: 'a4-8', text: 'Thank you for considering my application. I look forward to the opportunity to discuss how I can contribute to your team.', difficulty: 'advanced' },
        ],
    },

    // Lesson 68: Business Writing
    {
        id: 'adv-5-business',
        title: 'Business Communication',
        description: 'Type business reports, memos, and formal communication.',
        category: 'advanced',
        keys: [],
        targetWpm: 42,
        targetAccuracy: 91,
        exercises: [
            { id: 'a5-1', text: 'Meeting scheduled for Monday at 10:00 AM.', difficulty: 'beginner' },
            { id: 'a5-2', text: 'Action Items: Review report, send feedback.', difficulty: 'beginner' },
            { id: 'a5-3', text: 'Q4 revenue increased by 15% year over year.', difficulty: 'beginner' },
            { id: 'a5-4', text: 'The project is on track to meet the December deadline.', difficulty: 'intermediate' },
            { id: 'a5-5', text: 'Budget allocation requires approval from senior management.', difficulty: 'intermediate' },
            { id: 'a5-6', text: 'Key stakeholders have been notified of the timeline changes.', difficulty: 'intermediate' },
            { id: 'a5-7', text: 'The quarterly review indicates strong performance across all departments, with sales exceeding targets by 12%.', difficulty: 'advanced' },
            { id: 'a5-8', text: 'We recommend implementing the proposed strategy to optimize operational efficiency and reduce costs by approximately 20%.', difficulty: 'advanced' },
        ],
    },

    // Lesson 69: Literature Excerpts
    {
        id: 'adv-6-literature',
        title: 'Classic Literature',
        description: 'Type beautiful prose from classic literature. Develop rhythm and flow.',
        category: 'advanced',
        keys: [],
        targetWpm: 40,
        targetAccuracy: 92,
        exercises: [
            { id: 'a6-1', text: 'It was the best of times, it was the worst of times.', difficulty: 'beginner' },
            { id: 'a6-2', text: 'To be, or not to be, that is the question.', difficulty: 'beginner' },
            { id: 'a6-3', text: 'All happy families are alike.', difficulty: 'beginner' },
            { id: 'a6-4', text: 'Call me Ishmael. Some years ago, never mind how long precisely.', difficulty: 'intermediate' },
            { id: 'a6-5', text: 'It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.', difficulty: 'intermediate' },
            { id: 'a6-6', text: 'In my younger and more vulnerable years my father gave me some advice.', difficulty: 'intermediate' },
            { id: 'a6-7', text: 'The only way to do great work is to love what you do. If you have not found it yet, keep looking.', difficulty: 'advanced' },
            { id: 'a6-8', text: 'Two roads diverged in a wood, and I took the one less traveled by, and that has made all the difference.', difficulty: 'advanced' },
        ],
    },

    // Lesson 70: Technical Documentation
    {
        id: 'adv-7-docs',
        title: 'Technical Documentation',
        description: 'Type technical docs, README files, and API documentation.',
        category: 'advanced',
        keys: [],
        targetWpm: 38,
        targetAccuracy: 90,
        exercises: [
            { id: 'a7-1', text: '## Installation\n\nnpm install package-name', difficulty: 'beginner' },
            { id: 'a7-2', text: 'Run `npm start` to launch the development server.', difficulty: 'beginner' },
            { id: 'a7-3', text: '### Usage\n\nImport the component and use it in your app.', difficulty: 'beginner' },
            { id: 'a7-4', text: 'API Endpoint: GET /api/users\nReturns a list of all users.', difficulty: 'intermediate' },
            { id: 'a7-5', text: 'Configuration: Set the environment variable `API_KEY` in your `.env` file.', difficulty: 'intermediate' },
            { id: 'a7-6', text: 'Error Handling: The function throws an error if the input is invalid.', difficulty: 'intermediate' },
            { id: 'a7-7', text: 'Parameters: `userId` (required) - The unique identifier of the user. `options` (optional) - Additional query parameters.', difficulty: 'advanced' },
            { id: 'a7-8', text: 'Returns: A Promise that resolves to the user object if found, or null if the user does not exist in the database.', difficulty: 'advanced' },
        ],
    },

    // Lesson 71: Speed Challenge - Mixed Content
    {
        id: 'adv-8-speed',
        title: 'Speed Challenge',
        description: 'Push your limits with varied content at maximum speed.',
        category: 'advanced',
        keys: [],
        targetWpm: 50,
        targetAccuracy: 88,
        exercises: [
            { id: 'a8-1', text: 'The quick brown fox jumps over the lazy dog.', difficulty: 'beginner' },
            { id: 'a8-2', text: 'Pack my box with five dozen liquor jugs.', difficulty: 'beginner' },
            { id: 'a8-3', text: 'How vexingly quick daft zebras jump!', difficulty: 'beginner' },
            { id: 'a8-4', text: 'Jackdaws love my big sphinx of quartz. Five quacking zephyrs jolt my wax bed.', difficulty: 'intermediate' },
            { id: 'a8-5', text: 'The five boxing wizards jump quickly. Crazy Frederick bought many very exquisite opal jewels.', difficulty: 'intermediate' },
            { id: 'a8-6', text: 'We promptly judged antique ivory buckles for the next prize. How razorback-jumping frogs can level six piqued gymnasts!', difficulty: 'intermediate' },
            { id: 'a8-7', text: 'Sphinx of black quartz, judge my vow. The jay, pig, fox, zebra, and my wolves quack! Blowzy red vixens fight for a quick jump.', difficulty: 'advanced' },
            { id: 'a8-8', text: 'A quick movement of the enemy will jeopardize six gunboats. All questions asked by five watched experts amaze the judge.', difficulty: 'advanced' },
        ],
    },

    // Lesson 72: Accuracy Challenge
    {
        id: 'adv-9-accuracy',
        title: 'Accuracy Challenge',
        description: 'Perfect typing with zero errors. Focus on precision over speed.',
        category: 'advanced',
        keys: [],
        targetWpm: 35,
        targetAccuracy: 99,
        exercises: [
            { id: 'a9-1', text: 'Accuracy is more important than speed.', difficulty: 'beginner' },
            { id: 'a9-2', text: 'Perfect practice makes permanent progress.', difficulty: 'beginner' },
            { id: 'a9-3', text: 'Type each character with deliberate intention.', difficulty: 'beginner' },
            { id: 'a9-4', text: 'Focus on your breathing. Stay calm. Type with precision.', difficulty: 'intermediate' },
            { id: 'a9-5', text: 'Every keystroke matters. Make each one count. Build good habits.', difficulty: 'intermediate' },
            { id: 'a9-6', text: 'The difference between good and great is attention to detail. Type perfectly.', difficulty: 'intermediate' },
            { id: 'a9-7', text: 'Excellence is not an act, but a habit. Type with consistent accuracy. Make zero mistakes.', difficulty: 'advanced' },
            { id: 'a9-8', text: 'When you type with perfect accuracy, speed naturally follows. Trust the process. Focus on precision.', difficulty: 'advanced' },
        ],
    },

    // Lesson 73: Final Graduation
    {
        id: 'adv-10-graduation',
        title: 'TypeMaster Graduation',
        description: 'The ultimate typing challenge! Complete this to become a TypeMaster.',
        category: 'advanced',
        keys: [],
        targetWpm: 45,
        targetAccuracy: 93,
        exercises: [
            { id: 'a10-1', text: 'Congratulations on reaching the final lesson! You have shown dedication.', difficulty: 'beginner' },
            { id: 'a10-2', text: 'Your fingers have learned the keyboard. Your brain has formed new pathways.', difficulty: 'beginner' },
            { id: 'a10-3', text: 'From single letters to complex code, you have mastered it all. Well done!', difficulty: 'intermediate' },
            { id: 'a10-4', text: 'def celebrate(user): print(f"Congratulations, {user}! You are a TypeMaster!")', difficulty: 'intermediate' },
            { id: 'a10-5', text: 'Remember: typing is a skill that improves with practice. Keep typing every day to maintain and improve your speed.', difficulty: 'intermediate' },
            { id: 'a10-6', text: 'const skills = ["speed", "accuracy", "endurance"]; skills.forEach(skill => console.log(`You have mastered: ${skill}`));', difficulty: 'advanced' },
            { id: 'a10-7', text: '"The expert in anything was once a beginner." You started with single keys and now you can type anything. That is true progress.', difficulty: 'advanced' },
            { id: 'a10-8', text: 'You have completed Aloo Type! Your journey from beginner to expert typist is complete. Now go forth and type with confidence, speed, and accuracy!', difficulty: 'advanced' },
        ],
    },
];

export { advancedLessons };
