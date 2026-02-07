import { Lesson } from '@/types';

// ============================================================================
// NUMBERS MODULE - 8 Lessons
// Focus: Number row (1-0) with real-world contexts like dates, amounts, codes
// ============================================================================

const numbersLessons: Lesson[] = [
    // Lesson 48: 1, 2, 3 (Left Hand)
    {
        id: 'num-1-123',
        title: 'Starting Numbers: 1, 2, 3',
        description: 'Master the left side of the number row. Use pinky for 1, ring for 2, middle for 3.',
        category: 'numbers',
        keys: ['1', '2', '3'],
        targetWpm: 25,
        targetAccuracy: 90,
        exercises: [
            { id: 'n1-1', text: '111 222 333 111 222 333 111 222 333', difficulty: 'beginner' },
            { id: 'n1-2', text: '123 123 123 321 321 321 123 321', difficulty: 'beginner' },
            { id: 'n1-3', text: '12 23 31 12 23 31 12 23 31', difficulty: 'beginner' },
            { id: 'n1-4', text: 'Room 123. Floor 2. Building 31.', difficulty: 'intermediate' },
            { id: 'n1-5', text: 'I have 12 apples and 23 oranges.', difficulty: 'intermediate' },
            { id: 'n1-6', text: 'Page 123. Chapter 3. Section 21.', difficulty: 'intermediate' },
            { id: 'n1-7', text: 'The code is 312. Enter 123 to begin. Try 231.', difficulty: 'advanced' },
            { id: 'n1-8', text: 'We met at 3 pm. There were 12 people. It took 21 minutes.', difficulty: 'advanced' },
        ],
    },

    // Lesson 49: 4, 5, 6 (Index Fingers)
    {
        id: 'num-2-456',
        title: 'Center Numbers: 4, 5, 6',
        description: 'Index fingers handle 4, 5, and 6. These are the easiest to reach.',
        category: 'numbers',
        keys: ['4', '5', '6'],
        targetWpm: 26,
        targetAccuracy: 90,
        exercises: [
            { id: 'n2-1', text: '444 555 666 444 555 666 444 555 666', difficulty: 'beginner' },
            { id: 'n2-2', text: '456 456 456 654 654 654 456 654', difficulty: 'beginner' },
            { id: 'n2-3', text: '45 56 64 45 56 64 45 56 64', difficulty: 'beginner' },
            { id: 'n2-4', text: 'Gate 45. Row 6. Seat 54.', difficulty: 'intermediate' },
            { id: 'n2-5', text: 'We need 45 items. Only 6 remain. Add 54 more.', difficulty: 'intermediate' },
            { id: 'n2-6', text: 'Room 456. Extension 564. Code 645.', difficulty: 'intermediate' },
            { id: 'n2-7', text: 'The score is 54 to 46. Match 5. Game 6.', difficulty: 'advanced' },
            { id: 'n2-8', text: 'Call 456 for help. Dial 654 for sales. Enter 546 to confirm.', difficulty: 'advanced' },
        ],
    },

    // Lesson 50: 7, 8, 9, 0 (Right Hand)
    {
        id: 'num-3-7890',
        title: 'Completing Numbers: 7, 8, 9, 0',
        description: 'Complete your number skills with the right side. 0 uses right pinky.',
        category: 'numbers',
        keys: ['7', '8', '9', '0'],
        targetWpm: 26,
        targetAccuracy: 89,
        exercises: [
            { id: 'n3-1', text: '777 888 999 000 777 888 999 000', difficulty: 'beginner' },
            { id: 'n3-2', text: '7890 7890 7890 0987 0987 0987', difficulty: 'beginner' },
            { id: 'n3-3', text: '78 89 90 07 78 89 90 07', difficulty: 'beginner' },
            { id: 'n3-4', text: 'Room 789. Floor 0. Unit 908.', difficulty: 'intermediate' },
            { id: 'n3-5', text: 'We have 78 days left. Only 9 weeks. About 80 hours.', difficulty: 'intermediate' },
            { id: 'n3-6', text: 'Order 7890. Track 9087. Invoice 8709.', difficulty: 'intermediate' },
            { id: 'n3-7', text: 'The year is 2078. Temperature is 80. Humidity is 79.', difficulty: 'advanced' },
            { id: 'n3-8', text: 'Enter 7890 to start. Code 0987 for admin. Try 8097 for guest.', difficulty: 'advanced' },
        ],
    },

    // Lesson 51: Full Number Row
    {
        id: 'num-4-full',
        title: 'All Numbers',
        description: 'Practice the complete number row from 1 to 0.',
        category: 'numbers',
        keys: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
        targetWpm: 28,
        targetAccuracy: 88,
        exercises: [
            { id: 'n4-1', text: '1234567890 1234567890 1234567890', difficulty: 'beginner' },
            { id: 'n4-2', text: '0987654321 0987654321 0987654321', difficulty: 'beginner' },
            { id: 'n4-3', text: '13579 24680 13579 24680 13579', difficulty: 'beginner' },
            { id: 'n4-4', text: 'Phone: 1234567890. Code: 0987654321.', difficulty: 'intermediate' },
            { id: 'n4-5', text: 'We counted from 1 to 10. Then 10 to 1.', difficulty: 'intermediate' },
            { id: 'n4-6', text: 'PIN: 1234. Account: 567890. ID: 24680.', difficulty: 'intermediate' },
            { id: 'n4-7', text: 'The sequence is 1 2 3 4 5 6 7 8 9 0. Repeat it backwards.', difficulty: 'advanced' },
            { id: 'n4-8', text: 'Enter 12345. Confirm with 67890. Your ID is 0246813579.', difficulty: 'advanced' },
        ],
    },

    // Lesson 52: Dates and Years
    {
        id: 'num-5-dates',
        title: 'Dates and Years',
        description: 'Type dates and years fluently. Essential for real-world typing.',
        category: 'numbers',
        keys: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '/', '-'],
        targetWpm: 30,
        targetAccuracy: 89,
        exercises: [
            { id: 'n5-1', text: '2024 2025 2026 2024 2025 2026', difficulty: 'beginner' },
            { id: 'n5-2', text: '01/15 02/28 12/31 01/15 02/28', difficulty: 'beginner' },
            { id: 'n5-3', text: '1990 2000 2010 2020 2030', difficulty: 'beginner' },
            { id: 'n5-4', text: 'Born: 1990. Graduated: 2012. Married: 2018.', difficulty: 'intermediate' },
            { id: 'n5-5', text: 'Meeting on 03/15/2024. Deadline: 12/31/2024.', difficulty: 'intermediate' },
            { id: 'n5-6', text: 'The project runs from 01/01/2024 to 06/30/2024.', difficulty: 'intermediate' },
            { id: 'n5-7', text: 'Submit by 2024-12-15. Review on 2025-01-10. Launch: 2025-02-01.', difficulty: 'advanced' },
            { id: 'n5-8', text: 'The fiscal year 2024 ends on 03/31. New year starts 04/01/2024.', difficulty: 'advanced' },
        ],
    },

    // Lesson 53: Amounts and Money
    {
        id: 'num-6-money',
        title: 'Amounts and Currency',
        description: 'Type prices, amounts, and financial figures with ease.',
        category: 'numbers',
        keys: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.', ','],
        targetWpm: 30,
        targetAccuracy: 89,
        exercises: [
            { id: 'n6-1', text: '10.00 25.50 99.99 10.00 25.50', difficulty: 'beginner' },
            { id: 'n6-2', text: '100 200 500 1000 100 200 500', difficulty: 'beginner' },
            { id: 'n6-3', text: '1,000 10,000 100,000 1,000,000', difficulty: 'beginner' },
            { id: 'n6-4', text: 'Price: 29.99. Tax: 2.40. Total: 32.39.', difficulty: 'intermediate' },
            { id: 'n6-5', text: 'Budget: 50,000. Spent: 35,500. Remaining: 14,500.', difficulty: 'intermediate' },
            { id: 'n6-6', text: 'Item costs 199.99. With 20 percent off: 159.99.', difficulty: 'intermediate' },
            { id: 'n6-7', text: 'Revenue: 1,250,000. Expenses: 875,000. Profit: 375,000.', difficulty: 'advanced' },
            { id: 'n6-8', text: 'Pay 500.00 now. Balance: 1,500.00. Interest: 75.00. Total: 1,575.00.', difficulty: 'advanced' },
        ],
    },

    // Lesson 54: Phone Numbers and Codes
    {
        id: 'num-7-phone',
        title: 'Phone Numbers and Codes',
        description: 'Type phone numbers, ZIP codes, and identification numbers.',
        category: 'numbers',
        keys: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '(', ')'],
        targetWpm: 32,
        targetAccuracy: 88,
        exercises: [
            { id: 'n7-1', text: '555-1234 555-5678 555-9012', difficulty: 'beginner' },
            { id: 'n7-2', text: '(555) 123-4567 (555) 890-1234', difficulty: 'beginner' },
            { id: 'n7-3', text: 'ZIP: 12345 67890 54321 09876', difficulty: 'beginner' },
            { id: 'n7-4', text: 'Call (800) 555-1234. Fax: (800) 555-5678.', difficulty: 'intermediate' },
            { id: 'n7-5', text: 'ID: 123-45-6789. Ref: A1B2C3D4.', difficulty: 'intermediate' },
            { id: 'n7-6', text: 'Order 12345-67890. Tracking: 98765-43210.', difficulty: 'intermediate' },
            { id: 'n7-7', text: 'Main: (555) 100-2000. Support: (555) 300-4000. Sales: (555) 500-6000.', difficulty: 'advanced' },
            { id: 'n7-8', text: 'Account 1234-5678-9012-3456. PIN: 1234. Security: 567890.', difficulty: 'advanced' },
        ],
    },

    // Lesson 55: Numbers Graduation
    {
        id: 'num-8-graduation',
        title: 'Numbers Graduation',
        description: 'Final number row challenge! Mix all number types for mastery.',
        category: 'numbers',
        keys: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
        targetWpm: 35,
        targetAccuracy: 89,
        exercises: [
            { id: 'n8-1', text: 'We have 15 items at 25.99 each. Total: 389.85.', difficulty: 'beginner' },
            { id: 'n8-2', text: 'Call (555) 123-4567 by 5 pm on 12/15/2024.', difficulty: 'beginner' },
            { id: 'n8-3', text: 'The event runs from 9 am to 6 pm. Expect 500 guests.', difficulty: 'intermediate' },
            { id: 'n8-4', text: 'Order 12345. Price: 149.99. Ship by 01/20/2024.', difficulty: 'intermediate' },
            { id: 'n8-5', text: 'Born 1985. Age 39. ID: 123-45-6789. ZIP: 90210.', difficulty: 'intermediate' },
            { id: 'n8-6', text: 'Budget 50,000. Spent 35,750.25. Balance: 14,249.75. Save 10 percent.', difficulty: 'advanced' },
            { id: 'n8-7', text: 'Meeting at 10 am on 03/15. Room 305. Call (800) 555-1234 to confirm.', difficulty: 'advanced' },
            { id: 'n8-8', text: 'Invoice 2024-0001. Amount: 2,500.00. Due: 02/28/2024. Contact: (555) 000-1111.', difficulty: 'advanced' },
        ],
    },
];

export { numbersLessons };
