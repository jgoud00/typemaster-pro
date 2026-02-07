import { Lesson } from '@/types';

// ============================================================================
// SYMBOLS MODULE - 8 Lessons
// Focus: Common symbols in real contexts: email, code, punctuation, math
// ============================================================================

const symbolsLessons: Lesson[] = [
    // Lesson 56: Basic Punctuation (!?:)
    {
        id: 'sym-1-punctuation',
        title: 'Expressive Punctuation',
        description: 'Master exclamation marks, question marks, and colons for expressive writing.',
        category: 'symbols',
        keys: ['!', '?', ':'],
        targetWpm: 28,
        targetAccuracy: 88,
        exercises: [
            { id: 's1-1', text: 'Hello! How are you? Time: 10:00.', difficulty: 'beginner' },
            { id: 's1-2', text: 'Wow! Really? Yes! No? Maybe!', difficulty: 'beginner' },
            { id: 's1-3', text: 'What time is it? Meeting at 3:30!', difficulty: 'beginner' },
            { id: 's1-4', text: 'Great job! Can you help? Note: Important!', difficulty: 'intermediate' },
            { id: 's1-5', text: 'Wait! What happened? Status: Complete.', difficulty: 'intermediate' },
            { id: 's1-6', text: 'Are you ready? Go! Time: 09:15. Done!', difficulty: 'intermediate' },
            { id: 's1-7', text: 'Amazing! Did you see that? Result: Success! Try again?', difficulty: 'advanced' },
            { id: 's1-8', text: 'Deadline: Tomorrow! Can we finish? Yes! Priority: High!', difficulty: 'advanced' },
        ],
    },

    // Lesson 57: Quotes and Apostrophes
    {
        id: 'sym-2-quotes',
        title: 'Quotes and Apostrophes',
        description: 'Essential for dialogue, contractions, and possessives.',
        category: 'symbols',
        keys: ["'", '"'],
        targetWpm: 28,
        targetAccuracy: 88,
        exercises: [
            { id: 's2-1', text: "I'm you're we're they're it's", difficulty: 'beginner' },
            { id: 's2-2', text: "don't can't won't didn't shouldn't", difficulty: 'beginner' },
            { id: 's2-3', text: '"Hello" "Goodbye" "Yes" "No"', difficulty: 'beginner' },
            { id: 's2-4', text: "She said, \"Hello!\" He replied, \"Hi!\"", difficulty: 'intermediate' },
            { id: 's2-5', text: "John's book. Mary's car. The dog's toy.", difficulty: 'intermediate' },
            { id: 's2-6', text: "\"I can't believe it's true,\" she said.", difficulty: 'intermediate' },
            { id: 's2-7', text: "They're going to John's house. \"It's nice,\" he said.", difficulty: 'advanced' },
            { id: 's2-8', text: "\"Don't you think,\" she asked, \"that it's wonderful?\"", difficulty: 'advanced' },
        ],
    },

    // Lesson 58: Email Symbols (@._-)
    {
        id: 'sym-3-email',
        title: 'Email and Web Symbols',
        description: 'Type email addresses, websites, and usernames with @ . _ and -.',
        category: 'symbols',
        keys: ['@', '.', '_', '-'],
        targetWpm: 30,
        targetAccuracy: 87,
        exercises: [
            { id: 's3-1', text: 'user@email.com test@example.org', difficulty: 'beginner' },
            { id: 's3-2', text: 'first_name last_name user-name', difficulty: 'beginner' },
            { id: 's3-3', text: 'www.example.com www.test-site.org', difficulty: 'beginner' },
            { id: 's3-4', text: 'Contact: john_doe@company.com', difficulty: 'intermediate' },
            { id: 's3-5', text: 'Visit www.my-website.com for info.', difficulty: 'intermediate' },
            { id: 's3-6', text: 'Email support@help-desk.org today.', difficulty: 'intermediate' },
            { id: 's3-7', text: 'Send to: admin_user@test-server.net by 5pm.', difficulty: 'advanced' },
            { id: 's3-8', text: 'Profile: john.doe_2024@company-name.com. Website: www.my-portfolio.io', difficulty: 'advanced' },
        ],
    },

    // Lesson 59: Math Operators (+-=*/%)
    {
        id: 'sym-4-math',
        title: 'Math Operators',
        description: 'Type mathematical expressions and equations fluently.',
        category: 'symbols',
        keys: ['+', '-', '=', '*', '/', '%'],
        targetWpm: 28,
        targetAccuracy: 87,
        exercises: [
            { id: 's4-1', text: '1 + 1 = 2. 5 - 3 = 2. 4 * 2 = 8.', difficulty: 'beginner' },
            { id: 's4-2', text: '10 / 2 = 5. 50% off. 100 + 50 = 150.', difficulty: 'beginner' },
            { id: 's4-3', text: '2 + 2 = 4. 10 - 5 = 5. 3 * 3 = 9.', difficulty: 'beginner' },
            { id: 's4-4', text: 'Total = 100 + 25 - 10. Result = 115.', difficulty: 'intermediate' },
            { id: 's4-5', text: 'Price * Quantity = Total. 25 * 4 = 100.', difficulty: 'intermediate' },
            { id: 's4-6', text: 'Discount: 20%. Price = 100 - (100 * 20%)= 80.', difficulty: 'intermediate' },
            { id: 's4-7', text: 'a + b = c. x * y = z. 100 / 4 = 25. Growth: +15%.', difficulty: 'advanced' },
            { id: 's4-8', text: 'Formula: (base * height) / 2 = area. Example: (10 * 5) / 2 = 25.', difficulty: 'advanced' },
        ],
    },

    // Lesson 60: Brackets and Parentheses
    {
        id: 'sym-5-brackets',
        title: 'Brackets and Parentheses',
        description: 'Type parentheses, brackets, and braces for grouping and code.',
        category: 'symbols',
        keys: ['(', ')', '[', ']', '{', '}'],
        targetWpm: 28,
        targetAccuracy: 86,
        exercises: [
            { id: 's5-1', text: '() () () [] [] [] {} {} {}', difficulty: 'beginner' },
            { id: 's5-2', text: '(1) (2) (3) [a] [b] [c]', difficulty: 'beginner' },
            { id: 's5-3', text: '(hello) [world] {test}', difficulty: 'beginner' },
            { id: 's5-4', text: 'Call (555) 123-4567. See [Figure 1].', difficulty: 'intermediate' },
            { id: 's5-5', text: 'Note (important): Check [Appendix A].', difficulty: 'intermediate' },
            { id: 's5-6', text: 'Array: [1, 2, 3]. Object: {name: "test"}.', difficulty: 'intermediate' },
            { id: 's5-7', text: 'Function(param) { return [value]; }', difficulty: 'advanced' },
            { id: 's5-8', text: 'Data: { items: [1, 2, 3], count: (3) }. Process(data).', difficulty: 'advanced' },
        ],
    },

    // Lesson 61: Code Symbols (<>&|#)
    {
        id: 'sym-6-code',
        title: 'Programming Symbols',
        description: 'Essential symbols for coding: comparison, logic, and special chars.',
        category: 'symbols',
        keys: ['<', '>', '&', '|', '#'],
        targetWpm: 26,
        targetAccuracy: 85,
        exercises: [
            { id: 's6-1', text: '< > <= >= == != && ||', difficulty: 'beginner' },
            { id: 's6-2', text: '#1 #2 #100 #tag #code', difficulty: 'beginner' },
            { id: 's6-3', text: 'if (x > 5) if (y < 10)', difficulty: 'beginner' },
            { id: 's6-4', text: '<html> </html> <div> </div>', difficulty: 'intermediate' },
            { id: 's6-5', text: 'if (a > 0 && b < 10) { run(); }', difficulty: 'intermediate' },
            { id: 's6-6', text: '#include <stdio.h> // comment', difficulty: 'intermediate' },
            { id: 's6-7', text: 'Check if (x >= 5 && y <= 10) || z == 0.', difficulty: 'advanced' },
            { id: 's6-8', text: '<script> if (user && active) { log(#id); } </script>', difficulty: 'advanced' },
        ],
    },

    // Lesson 62: Special Characters ($^~\`)
    {
        id: 'sym-7-special',
        title: 'Special Characters',
        description: 'Less common but important: dollar, caret, tilde, backslash.',
        category: 'symbols',
        keys: ['$', '^', '~', '\\', '`'],
        targetWpm: 25,
        targetAccuracy: 85,
        exercises: [
            { id: 's7-1', text: '$100 $500 $1000 $9.99 $19.99', difficulty: 'beginner' },
            { id: 's7-2', text: 'x^2 y^3 2^10 e^x', difficulty: 'beginner' },
            { id: 's7-3', text: '~home ~user ~/documents', difficulty: 'beginner' },
            { id: 's7-4', text: 'Path: C:\\Users\\Name\\Files', difficulty: 'intermediate' },
            { id: 's7-5', text: 'Price: $99.99. Power: 2^8 = 256.', difficulty: 'intermediate' },
            { id: 's7-6', text: '`code` $variable ~/folder/file', difficulty: 'intermediate' },
            { id: 's7-7', text: 'Cost $500. Formula: x^2 + y^2. Path: ~\\config', difficulty: 'advanced' },
            { id: 's7-8', text: 'Run `npm install`. Cost: $1,299. Path: C:\\Program Files\\App', difficulty: 'advanced' },
        ],
    },

    // Lesson 63: Symbols Graduation
    {
        id: 'sym-8-graduation',
        title: 'Symbols Graduation',
        description: 'Final symbol challenge! Mix all symbol types for mastery.',
        category: 'symbols',
        keys: ['!', '?', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '=', '+', '[', ']', '{', '}', '|', '\\', ':', ';', '"', "'", '<', '>', ',', '.', '/', '`', '~'],
        targetWpm: 30,
        targetAccuracy: 86,
        exercises: [
            { id: 's8-1', text: "Email: user@test.com. Price: $99.99! Questions?", difficulty: 'beginner' },
            { id: 's8-2', text: 'Call (555) 123-4567. Visit www.site.com today!', difficulty: 'beginner' },
            { id: 's8-3', text: "She said, \"It's amazing!\" (Really?) Yes!", difficulty: 'intermediate' },
            { id: 's8-4', text: 'if (x > 0 && y < 10) { return $total; }', difficulty: 'intermediate' },
            { id: 's8-5', text: 'Data: { "name": "test", "value": 100 }. Process it!', difficulty: 'intermediate' },
            { id: 's8-6', text: "Order #12345. Total: $199.99 (20% off). Email: orders@shop.com", difficulty: 'advanced' },
            { id: 's8-7', text: 'if (user.active && cart.total >= $50) { applyDiscount(10%); }', difficulty: 'advanced' },
            { id: 's8-8', text: "Contact: john_doe@company.com. \"Ready?\" he asked. Cost: $500 + 8% tax = $540!", difficulty: 'advanced' },
        ],
    },
];

export { symbolsLessons };
