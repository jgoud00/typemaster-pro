/**
 * Keyboard Layouts
 * 
 * Supports QWERTY, Dvorak, Colemak, and AZERTY layouts
 * with finger assignments for each.
 */

export type LayoutName = 'qwerty' | 'dvorak' | 'colemak' | 'azerty';

export interface KeyboardKey {
    key: string;
    shifted: string;
    finger: 'pinky' | 'ring' | 'middle' | 'index';
    hand: 'left' | 'right';
    row: 'number' | 'top' | 'home' | 'bottom';
    width?: number; // For wider keys like backspace
}

export interface KeyboardLayout {
    name: LayoutName;
    displayName: string;
    description: string;
    rows: KeyboardKey[][];
}

// QWERTY Layout
const QWERTY_LAYOUT: KeyboardLayout = {
    name: 'qwerty',
    displayName: 'QWERTY',
    description: 'Standard English keyboard layout',
    rows: [
        // Number row
        [
            { key: '`', shifted: '~', finger: 'pinky', hand: 'left', row: 'number' },
            { key: '1', shifted: '!', finger: 'pinky', hand: 'left', row: 'number' },
            { key: '2', shifted: '@', finger: 'ring', hand: 'left', row: 'number' },
            { key: '3', shifted: '#', finger: 'middle', hand: 'left', row: 'number' },
            { key: '4', shifted: '$', finger: 'index', hand: 'left', row: 'number' },
            { key: '5', shifted: '%', finger: 'index', hand: 'left', row: 'number' },
            { key: '6', shifted: '^', finger: 'index', hand: 'right', row: 'number' },
            { key: '7', shifted: '&', finger: 'index', hand: 'right', row: 'number' },
            { key: '8', shifted: '*', finger: 'middle', hand: 'right', row: 'number' },
            { key: '9', shifted: '(', finger: 'ring', hand: 'right', row: 'number' },
            { key: '0', shifted: ')', finger: 'pinky', hand: 'right', row: 'number' },
            { key: '-', shifted: '_', finger: 'pinky', hand: 'right', row: 'number' },
            { key: '=', shifted: '+', finger: 'pinky', hand: 'right', row: 'number' },
        ],
        // Top row
        [
            { key: 'q', shifted: 'Q', finger: 'pinky', hand: 'left', row: 'top' },
            { key: 'w', shifted: 'W', finger: 'ring', hand: 'left', row: 'top' },
            { key: 'e', shifted: 'E', finger: 'middle', hand: 'left', row: 'top' },
            { key: 'r', shifted: 'R', finger: 'index', hand: 'left', row: 'top' },
            { key: 't', shifted: 'T', finger: 'index', hand: 'left', row: 'top' },
            { key: 'y', shifted: 'Y', finger: 'index', hand: 'right', row: 'top' },
            { key: 'u', shifted: 'U', finger: 'index', hand: 'right', row: 'top' },
            { key: 'i', shifted: 'I', finger: 'middle', hand: 'right', row: 'top' },
            { key: 'o', shifted: 'O', finger: 'ring', hand: 'right', row: 'top' },
            { key: 'p', shifted: 'P', finger: 'pinky', hand: 'right', row: 'top' },
            { key: '[', shifted: '{', finger: 'pinky', hand: 'right', row: 'top' },
            { key: ']', shifted: '}', finger: 'pinky', hand: 'right', row: 'top' },
            { key: '\\', shifted: '|', finger: 'pinky', hand: 'right', row: 'top' },
        ],
        // Home row
        [
            { key: 'a', shifted: 'A', finger: 'pinky', hand: 'left', row: 'home' },
            { key: 's', shifted: 'S', finger: 'ring', hand: 'left', row: 'home' },
            { key: 'd', shifted: 'D', finger: 'middle', hand: 'left', row: 'home' },
            { key: 'f', shifted: 'F', finger: 'index', hand: 'left', row: 'home' },
            { key: 'g', shifted: 'G', finger: 'index', hand: 'left', row: 'home' },
            { key: 'h', shifted: 'H', finger: 'index', hand: 'right', row: 'home' },
            { key: 'j', shifted: 'J', finger: 'index', hand: 'right', row: 'home' },
            { key: 'k', shifted: 'K', finger: 'middle', hand: 'right', row: 'home' },
            { key: 'l', shifted: 'L', finger: 'ring', hand: 'right', row: 'home' },
            { key: ';', shifted: ':', finger: 'pinky', hand: 'right', row: 'home' },
            { key: "'", shifted: '"', finger: 'pinky', hand: 'right', row: 'home' },
        ],
        // Bottom row
        [
            { key: 'z', shifted: 'Z', finger: 'pinky', hand: 'left', row: 'bottom' },
            { key: 'x', shifted: 'X', finger: 'ring', hand: 'left', row: 'bottom' },
            { key: 'c', shifted: 'C', finger: 'middle', hand: 'left', row: 'bottom' },
            { key: 'v', shifted: 'V', finger: 'index', hand: 'left', row: 'bottom' },
            { key: 'b', shifted: 'B', finger: 'index', hand: 'left', row: 'bottom' },
            { key: 'n', shifted: 'N', finger: 'index', hand: 'right', row: 'bottom' },
            { key: 'm', shifted: 'M', finger: 'index', hand: 'right', row: 'bottom' },
            { key: ',', shifted: '<', finger: 'middle', hand: 'right', row: 'bottom' },
            { key: '.', shifted: '>', finger: 'ring', hand: 'right', row: 'bottom' },
            { key: '/', shifted: '?', finger: 'pinky', hand: 'right', row: 'bottom' },
        ],
    ],
};

// Dvorak Layout
const DVORAK_LAYOUT: KeyboardLayout = {
    name: 'dvorak',
    displayName: 'Dvorak',
    description: 'Designed for faster and more efficient typing',
    rows: [
        // Number row (same as QWERTY)
        QWERTY_LAYOUT.rows[0],
        // Top row
        [
            { key: "'", shifted: '"', finger: 'pinky', hand: 'left', row: 'top' },
            { key: ',', shifted: '<', finger: 'ring', hand: 'left', row: 'top' },
            { key: '.', shifted: '>', finger: 'middle', hand: 'left', row: 'top' },
            { key: 'p', shifted: 'P', finger: 'index', hand: 'left', row: 'top' },
            { key: 'y', shifted: 'Y', finger: 'index', hand: 'left', row: 'top' },
            { key: 'f', shifted: 'F', finger: 'index', hand: 'right', row: 'top' },
            { key: 'g', shifted: 'G', finger: 'index', hand: 'right', row: 'top' },
            { key: 'c', shifted: 'C', finger: 'middle', hand: 'right', row: 'top' },
            { key: 'r', shifted: 'R', finger: 'ring', hand: 'right', row: 'top' },
            { key: 'l', shifted: 'L', finger: 'pinky', hand: 'right', row: 'top' },
            { key: '/', shifted: '?', finger: 'pinky', hand: 'right', row: 'top' },
            { key: '=', shifted: '+', finger: 'pinky', hand: 'right', row: 'top' },
            { key: '\\', shifted: '|', finger: 'pinky', hand: 'right', row: 'top' },
        ],
        // Home row
        [
            { key: 'a', shifted: 'A', finger: 'pinky', hand: 'left', row: 'home' },
            { key: 'o', shifted: 'O', finger: 'ring', hand: 'left', row: 'home' },
            { key: 'e', shifted: 'E', finger: 'middle', hand: 'left', row: 'home' },
            { key: 'u', shifted: 'U', finger: 'index', hand: 'left', row: 'home' },
            { key: 'i', shifted: 'I', finger: 'index', hand: 'left', row: 'home' },
            { key: 'd', shifted: 'D', finger: 'index', hand: 'right', row: 'home' },
            { key: 'h', shifted: 'H', finger: 'index', hand: 'right', row: 'home' },
            { key: 't', shifted: 'T', finger: 'middle', hand: 'right', row: 'home' },
            { key: 'n', shifted: 'N', finger: 'ring', hand: 'right', row: 'home' },
            { key: 's', shifted: 'S', finger: 'pinky', hand: 'right', row: 'home' },
            { key: '-', shifted: '_', finger: 'pinky', hand: 'right', row: 'home' },
        ],
        // Bottom row
        [
            { key: ';', shifted: ':', finger: 'pinky', hand: 'left', row: 'bottom' },
            { key: 'q', shifted: 'Q', finger: 'ring', hand: 'left', row: 'bottom' },
            { key: 'j', shifted: 'J', finger: 'middle', hand: 'left', row: 'bottom' },
            { key: 'k', shifted: 'K', finger: 'index', hand: 'left', row: 'bottom' },
            { key: 'x', shifted: 'X', finger: 'index', hand: 'left', row: 'bottom' },
            { key: 'b', shifted: 'B', finger: 'index', hand: 'right', row: 'bottom' },
            { key: 'm', shifted: 'M', finger: 'index', hand: 'right', row: 'bottom' },
            { key: 'w', shifted: 'W', finger: 'middle', hand: 'right', row: 'bottom' },
            { key: 'v', shifted: 'V', finger: 'ring', hand: 'right', row: 'bottom' },
            { key: 'z', shifted: 'Z', finger: 'pinky', hand: 'right', row: 'bottom' },
        ],
    ],
};

// Colemak Layout
const COLEMAK_LAYOUT: KeyboardLayout = {
    name: 'colemak',
    displayName: 'Colemak',
    description: 'Modern alternative designed for efficiency and ergonomics',
    rows: [
        // Number row (same as QWERTY)
        QWERTY_LAYOUT.rows[0],
        // Top row
        [
            { key: 'q', shifted: 'Q', finger: 'pinky', hand: 'left', row: 'top' },
            { key: 'w', shifted: 'W', finger: 'ring', hand: 'left', row: 'top' },
            { key: 'f', shifted: 'F', finger: 'middle', hand: 'left', row: 'top' },
            { key: 'p', shifted: 'P', finger: 'index', hand: 'left', row: 'top' },
            { key: 'g', shifted: 'G', finger: 'index', hand: 'left', row: 'top' },
            { key: 'j', shifted: 'J', finger: 'index', hand: 'right', row: 'top' },
            { key: 'l', shifted: 'L', finger: 'index', hand: 'right', row: 'top' },
            { key: 'u', shifted: 'U', finger: 'middle', hand: 'right', row: 'top' },
            { key: 'y', shifted: 'Y', finger: 'ring', hand: 'right', row: 'top' },
            { key: ';', shifted: ':', finger: 'pinky', hand: 'right', row: 'top' },
            { key: '[', shifted: '{', finger: 'pinky', hand: 'right', row: 'top' },
            { key: ']', shifted: '}', finger: 'pinky', hand: 'right', row: 'top' },
            { key: '\\', shifted: '|', finger: 'pinky', hand: 'right', row: 'top' },
        ],
        // Home row
        [
            { key: 'a', shifted: 'A', finger: 'pinky', hand: 'left', row: 'home' },
            { key: 'r', shifted: 'R', finger: 'ring', hand: 'left', row: 'home' },
            { key: 's', shifted: 'S', finger: 'middle', hand: 'left', row: 'home' },
            { key: 't', shifted: 'T', finger: 'index', hand: 'left', row: 'home' },
            { key: 'd', shifted: 'D', finger: 'index', hand: 'left', row: 'home' },
            { key: 'h', shifted: 'H', finger: 'index', hand: 'right', row: 'home' },
            { key: 'n', shifted: 'N', finger: 'index', hand: 'right', row: 'home' },
            { key: 'e', shifted: 'E', finger: 'middle', hand: 'right', row: 'home' },
            { key: 'i', shifted: 'I', finger: 'ring', hand: 'right', row: 'home' },
            { key: 'o', shifted: 'O', finger: 'pinky', hand: 'right', row: 'home' },
            { key: "'", shifted: '"', finger: 'pinky', hand: 'right', row: 'home' },
        ],
        // Bottom row
        [
            { key: 'z', shifted: 'Z', finger: 'pinky', hand: 'left', row: 'bottom' },
            { key: 'x', shifted: 'X', finger: 'ring', hand: 'left', row: 'bottom' },
            { key: 'c', shifted: 'C', finger: 'middle', hand: 'left', row: 'bottom' },
            { key: 'v', shifted: 'V', finger: 'index', hand: 'left', row: 'bottom' },
            { key: 'b', shifted: 'B', finger: 'index', hand: 'left', row: 'bottom' },
            { key: 'k', shifted: 'K', finger: 'index', hand: 'right', row: 'bottom' },
            { key: 'm', shifted: 'M', finger: 'index', hand: 'right', row: 'bottom' },
            { key: ',', shifted: '<', finger: 'middle', hand: 'right', row: 'bottom' },
            { key: '.', shifted: '>', finger: 'ring', hand: 'right', row: 'bottom' },
            { key: '/', shifted: '?', finger: 'pinky', hand: 'right', row: 'bottom' },
        ],
    ],
};

// AZERTY Layout (French)
const AZERTY_LAYOUT: KeyboardLayout = {
    name: 'azerty',
    displayName: 'AZERTY',
    description: 'Standard French keyboard layout',
    rows: [
        // Number row (different shifted values)
        [
            { key: '²', shifted: '', finger: 'pinky', hand: 'left', row: 'number' },
            { key: '&', shifted: '1', finger: 'pinky', hand: 'left', row: 'number' },
            { key: 'é', shifted: '2', finger: 'ring', hand: 'left', row: 'number' },
            { key: '"', shifted: '3', finger: 'middle', hand: 'left', row: 'number' },
            { key: "'", shifted: '4', finger: 'index', hand: 'left', row: 'number' },
            { key: '(', shifted: '5', finger: 'index', hand: 'left', row: 'number' },
            { key: '-', shifted: '6', finger: 'index', hand: 'right', row: 'number' },
            { key: 'è', shifted: '7', finger: 'index', hand: 'right', row: 'number' },
            { key: '_', shifted: '8', finger: 'middle', hand: 'right', row: 'number' },
            { key: 'ç', shifted: '9', finger: 'ring', hand: 'right', row: 'number' },
            { key: 'à', shifted: '0', finger: 'pinky', hand: 'right', row: 'number' },
            { key: ')', shifted: '°', finger: 'pinky', hand: 'right', row: 'number' },
            { key: '=', shifted: '+', finger: 'pinky', hand: 'right', row: 'number' },
        ],
        // Top row
        [
            { key: 'a', shifted: 'A', finger: 'pinky', hand: 'left', row: 'top' },
            { key: 'z', shifted: 'Z', finger: 'ring', hand: 'left', row: 'top' },
            { key: 'e', shifted: 'E', finger: 'middle', hand: 'left', row: 'top' },
            { key: 'r', shifted: 'R', finger: 'index', hand: 'left', row: 'top' },
            { key: 't', shifted: 'T', finger: 'index', hand: 'left', row: 'top' },
            { key: 'y', shifted: 'Y', finger: 'index', hand: 'right', row: 'top' },
            { key: 'u', shifted: 'U', finger: 'index', hand: 'right', row: 'top' },
            { key: 'i', shifted: 'I', finger: 'middle', hand: 'right', row: 'top' },
            { key: 'o', shifted: 'O', finger: 'ring', hand: 'right', row: 'top' },
            { key: 'p', shifted: 'P', finger: 'pinky', hand: 'right', row: 'top' },
            { key: '^', shifted: '¨', finger: 'pinky', hand: 'right', row: 'top' },
            { key: '$', shifted: '£', finger: 'pinky', hand: 'right', row: 'top' },
            { key: '*', shifted: 'µ', finger: 'pinky', hand: 'right', row: 'top' },
        ],
        // Home row
        [
            { key: 'q', shifted: 'Q', finger: 'pinky', hand: 'left', row: 'home' },
            { key: 's', shifted: 'S', finger: 'ring', hand: 'left', row: 'home' },
            { key: 'd', shifted: 'D', finger: 'middle', hand: 'left', row: 'home' },
            { key: 'f', shifted: 'F', finger: 'index', hand: 'left', row: 'home' },
            { key: 'g', shifted: 'G', finger: 'index', hand: 'left', row: 'home' },
            { key: 'h', shifted: 'H', finger: 'index', hand: 'right', row: 'home' },
            { key: 'j', shifted: 'J', finger: 'index', hand: 'right', row: 'home' },
            { key: 'k', shifted: 'K', finger: 'middle', hand: 'right', row: 'home' },
            { key: 'l', shifted: 'L', finger: 'ring', hand: 'right', row: 'home' },
            { key: 'm', shifted: 'M', finger: 'pinky', hand: 'right', row: 'home' },
            { key: 'ù', shifted: '%', finger: 'pinky', hand: 'right', row: 'home' },
        ],
        // Bottom row
        [
            { key: 'w', shifted: 'W', finger: 'pinky', hand: 'left', row: 'bottom' },
            { key: 'x', shifted: 'X', finger: 'ring', hand: 'left', row: 'bottom' },
            { key: 'c', shifted: 'C', finger: 'middle', hand: 'left', row: 'bottom' },
            { key: 'v', shifted: 'V', finger: 'index', hand: 'left', row: 'bottom' },
            { key: 'b', shifted: 'B', finger: 'index', hand: 'left', row: 'bottom' },
            { key: 'n', shifted: 'N', finger: 'index', hand: 'right', row: 'bottom' },
            { key: ',', shifted: '?', finger: 'index', hand: 'right', row: 'bottom' },
            { key: ';', shifted: '.', finger: 'middle', hand: 'right', row: 'bottom' },
            { key: ':', shifted: '/', finger: 'ring', hand: 'right', row: 'bottom' },
            { key: '!', shifted: '§', finger: 'pinky', hand: 'right', row: 'bottom' },
        ],
    ],
};

// All layouts
export const KEYBOARD_LAYOUTS: Record<LayoutName, KeyboardLayout> = {
    qwerty: QWERTY_LAYOUT,
    dvorak: DVORAK_LAYOUT,
    colemak: COLEMAK_LAYOUT,
    azerty: AZERTY_LAYOUT,
};

/**
 * Get a layout by name
 */
export function getLayout(name: LayoutName): KeyboardLayout {
    return KEYBOARD_LAYOUTS[name] || QWERTY_LAYOUT;
}

/**
 * Get all available layout names
 */
export function getAvailableLayouts(): Array<{ name: LayoutName; displayName: string; description: string }> {
    return Object.values(KEYBOARD_LAYOUTS).map(layout => ({
        name: layout.name,
        displayName: layout.displayName,
        description: layout.description,
    }));
}

/**
 * Find key info in a layout
 */
export function findKeyInLayout(layout: KeyboardLayout, key: string): KeyboardKey | undefined {
    for (const row of layout.rows) {
        for (const keyData of row) {
            if (keyData.key === key.toLowerCase() || keyData.shifted === key) {
                return keyData;
            }
        }
    }
    return undefined;
}
