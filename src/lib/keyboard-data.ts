import { KeyData, Finger } from '@/types';

// Finger color mapping for visual keyboard
export const fingerColors: Record<Finger, { bg: string; border: string; text: string }> = {
    'left-pinky': { bg: 'bg-rose-500/20', border: 'border-rose-500', text: 'text-rose-400' },
    'left-ring': { bg: 'bg-orange-500/20', border: 'border-orange-500', text: 'text-orange-400' },
    'left-middle': { bg: 'bg-yellow-500/20', border: 'border-yellow-500', text: 'text-yellow-400' },
    'left-index': { bg: 'bg-lime-500/20', border: 'border-lime-500', text: 'text-lime-400' },
    'right-index': { bg: 'bg-cyan-500/20', border: 'border-cyan-500', text: 'text-cyan-400' },
    'right-middle': { bg: 'bg-blue-500/20', border: 'border-blue-500', text: 'text-blue-400' },
    'right-ring': { bg: 'bg-purple-500/20', border: 'border-purple-500', text: 'text-purple-400' },
    'right-pinky': { bg: 'bg-pink-500/20', border: 'border-pink-500', text: 'text-pink-400' },
    'thumb': { bg: 'bg-gray-500/20', border: 'border-gray-500', text: 'text-gray-400' },
};

// Full keyboard layout with finger assignments
export const keyboardLayout: KeyData[][] = [
    // Row 0: Number row
    [
        { key: '`', shiftKey: '~', finger: 'left-pinky', row: 0 },
        { key: '1', shiftKey: '!', finger: 'left-pinky', row: 0 },
        { key: '2', shiftKey: '@', finger: 'left-ring', row: 0 },
        { key: '3', shiftKey: '#', finger: 'left-middle', row: 0 },
        { key: '4', shiftKey: '$', finger: 'left-index', row: 0 },
        { key: '5', shiftKey: '%', finger: 'left-index', row: 0 },
        { key: '6', shiftKey: '^', finger: 'right-index', row: 0 },
        { key: '7', shiftKey: '&', finger: 'right-index', row: 0 },
        { key: '8', shiftKey: '*', finger: 'right-middle', row: 0 },
        { key: '9', shiftKey: '(', finger: 'right-ring', row: 0 },
        { key: '0', shiftKey: ')', finger: 'right-pinky', row: 0 },
        { key: '-', shiftKey: '_', finger: 'right-pinky', row: 0 },
        { key: '=', shiftKey: '+', finger: 'right-pinky', row: 0 },
        { key: 'Backspace', finger: 'right-pinky', row: 0, width: 2 },
    ],
    // Row 1: QWERTY row
    [
        { key: 'Tab', finger: 'left-pinky', row: 1, width: 1.5 },
        { key: 'q', shiftKey: 'Q', finger: 'left-pinky', row: 1 },
        { key: 'w', shiftKey: 'W', finger: 'left-ring', row: 1 },
        { key: 'e', shiftKey: 'E', finger: 'left-middle', row: 1 },
        { key: 'r', shiftKey: 'R', finger: 'left-index', row: 1 },
        { key: 't', shiftKey: 'T', finger: 'left-index', row: 1 },
        { key: 'y', shiftKey: 'Y', finger: 'right-index', row: 1 },
        { key: 'u', shiftKey: 'U', finger: 'right-index', row: 1 },
        { key: 'i', shiftKey: 'I', finger: 'right-middle', row: 1 },
        { key: 'o', shiftKey: 'O', finger: 'right-ring', row: 1 },
        { key: 'p', shiftKey: 'P', finger: 'right-pinky', row: 1 },
        { key: '[', shiftKey: '{', finger: 'right-pinky', row: 1 },
        { key: ']', shiftKey: '}', finger: 'right-pinky', row: 1 },
        { key: '\\', shiftKey: '|', finger: 'right-pinky', row: 1, width: 1.5 },
    ],
    // Row 2: Home row (ASDF)
    [
        { key: 'CapsLock', finger: 'left-pinky', row: 2, width: 1.75 },
        { key: 'a', shiftKey: 'A', finger: 'left-pinky', row: 2 },
        { key: 's', shiftKey: 'S', finger: 'left-ring', row: 2 },
        { key: 'd', shiftKey: 'D', finger: 'left-middle', row: 2 },
        { key: 'f', shiftKey: 'F', finger: 'left-index', row: 2 },
        { key: 'g', shiftKey: 'G', finger: 'left-index', row: 2 },
        { key: 'h', shiftKey: 'H', finger: 'right-index', row: 2 },
        { key: 'j', shiftKey: 'J', finger: 'right-index', row: 2 },
        { key: 'k', shiftKey: 'K', finger: 'right-middle', row: 2 },
        { key: 'l', shiftKey: 'L', finger: 'right-ring', row: 2 },
        { key: ';', shiftKey: ':', finger: 'right-pinky', row: 2 },
        { key: "'", shiftKey: '"', finger: 'right-pinky', row: 2 },
        { key: 'Enter', finger: 'right-pinky', row: 2, width: 2.25 },
    ],
    // Row 3: Bottom row (ZXCV)
    [
        { key: 'Shift', finger: 'left-pinky', row: 3, width: 2.25 },
        { key: 'z', shiftKey: 'Z', finger: 'left-pinky', row: 3 },
        { key: 'x', shiftKey: 'X', finger: 'left-ring', row: 3 },
        { key: 'c', shiftKey: 'C', finger: 'left-middle', row: 3 },
        { key: 'v', shiftKey: 'V', finger: 'left-index', row: 3 },
        { key: 'b', shiftKey: 'B', finger: 'left-index', row: 3 },
        { key: 'n', shiftKey: 'N', finger: 'right-index', row: 3 },
        { key: 'm', shiftKey: 'M', finger: 'right-index', row: 3 },
        { key: ',', shiftKey: '<', finger: 'right-middle', row: 3 },
        { key: '.', shiftKey: '>', finger: 'right-ring', row: 3 },
        { key: '/', shiftKey: '?', finger: 'right-pinky', row: 3 },
        { key: 'Shift', finger: 'right-pinky', row: 3, width: 2.75 },
    ],
    // Row 4: Space bar row
    [
        { key: 'Ctrl', finger: 'left-pinky', row: 4, width: 1.25 },
        { key: 'Win', finger: 'left-pinky', row: 4, width: 1.25 },
        { key: 'Alt', finger: 'left-pinky', row: 4, width: 1.25 },
        { key: ' ', finger: 'thumb', row: 4, width: 6.25 },
        { key: 'Alt', finger: 'right-pinky', row: 4, width: 1.25 },
        { key: 'Win', finger: 'right-pinky', row: 4, width: 1.25 },
        { key: 'Menu', finger: 'right-pinky', row: 4, width: 1.25 },
        { key: 'Ctrl', finger: 'right-pinky', row: 4, width: 1.25 },
    ],
];

// Get key data by character
export function getKeyData(char: string): KeyData | undefined {
    for (const row of keyboardLayout) {
        for (const key of row) {
            if (key.key === char || key.shiftKey === char) {
                return key;
            }
        }
    }
    return undefined;
}

// Check if shift is needed for a character
export function needsShift(char: string): boolean {
    for (const row of keyboardLayout) {
        for (const key of row) {
            if (key.shiftKey === char) {
                return true;
            }
        }
    }
    return false;
}

// Home row keys for initial lessons
export const homeRowKeys = ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'];
export const topRowKeys = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
export const bottomRowKeys = ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'];
export const numberRowKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
