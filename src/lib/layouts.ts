export type KeyboardLayoutType = 'qwerty' | 'dvorak' | 'colemak' | 'workman';

export interface KeyMap {
    id: string; // The physical key identifier (e.g., 'KeyA', 'Digit1')
    label: string; // The primary char to display
    shiftLabel?: string; // The shifted char to display
    finger: number; // 0-9 (Left Pinky -> Right Pinky)
    row: number; // 0=digits, 1=top, 2=home, 3=bottom, 4=space
    width?: number; // Relative width (e.g., 1.5, 2.0)
    isSystem?: boolean; // True for shift, enter, space, etc
}

export interface KeyboardLayoutDef {
    id: KeyboardLayoutType;
    name: string;
    description: string;
    rows: KeyMap[][];
}

// Helper to construct standard rows to avoid boilerplate
const sys = (id: string, label: string, width: number, row: number, finger: number): KeyMap => ({
    id, label, width, isSystem: true, row, finger
});

const alpha = (id: string, label: string, shiftLabel: string, row: number, finger: number): KeyMap => ({
    id, label, shiftLabel, row, finger
});

export const LAYOUTS: Record<KeyboardLayoutType, KeyboardLayoutDef> = {
    qwerty: {
        id: 'qwerty',
        name: 'QWERTY',
        description: 'The standard modern layout',
        rows: [
            // Row 0: Digits
            [
                alpha('Backquote', '`', '~', 0, 0),
                alpha('Digit1', '1', '!', 0, 0),
                alpha('Digit2', '2', '@', 0, 1),
                alpha('Digit3', '3', '#', 0, 2),
                alpha('Digit4', '4', '$', 0, 3),
                alpha('Digit5', '5', '%', 0, 3),
                alpha('Digit6', '6', '^', 0, 6),
                alpha('Digit7', '7', '&', 0, 6),
                alpha('Digit8', '8', '*', 0, 7),
                alpha('Digit9', '9', '(', 0, 8),
                alpha('Digit0', '0', ')', 0, 9),
                alpha('Minus', '-', '_', 0, 9),
                alpha('Equal', '=', '+', 0, 9),
                sys('Backspace', 'Backspace', 2, 0, 9)
            ],
            // Row 1: Top Row
            [
                sys('Tab', 'Tab', 1.5, 1, 0),
                alpha('KeyQ', 'q', 'Q', 1, 0),
                alpha('KeyW', 'w', 'W', 1, 1),
                alpha('KeyE', 'e', 'E', 1, 2),
                alpha('KeyR', 'r', 'R', 1, 3),
                alpha('KeyT', 't', 'T', 1, 3),
                alpha('KeyY', 'y', 'Y', 1, 6),
                alpha('KeyU', 'u', 'U', 1, 6),
                alpha('KeyI', 'i', 'I', 1, 7),
                alpha('KeyO', 'o', 'O', 1, 8),
                alpha('KeyP', 'p', 'P', 1, 9),
                alpha('BracketLeft', '[', '{', 1, 9),
                alpha('BracketRight', ']', '}', 1, 9),
                alpha('Backslash', '\\', '|', 1, 9)
            ],
            // Row 2: Home Row
            [
                sys('CapsLock', 'Caps', 1.8, 2, 0),
                alpha('KeyA', 'a', 'A', 2, 0),
                alpha('KeyS', 's', 'S', 2, 1),
                alpha('KeyD', 'd', 'D', 2, 2),
                alpha('KeyF', 'f', 'F', 2, 3),
                alpha('KeyG', 'g', 'G', 2, 3),
                alpha('KeyH', 'h', 'H', 2, 6),
                alpha('KeyJ', 'j', 'J', 2, 6),
                alpha('KeyK', 'k', 'K', 2, 7),
                alpha('KeyL', 'l', 'L', 2, 8),
                alpha('Semicolon', ';', ':', 2, 9),
                alpha('Quote', "'", '"', 2, 9),
                sys('Enter', 'Enter', 2.2, 2, 9)
            ],
            // Row 3: Bottom Row
            [
                sys('ShiftLeft', 'Shift', 2.3, 3, 0),
                alpha('KeyZ', 'z', 'Z', 3, 0),
                alpha('KeyX', 'x', 'X', 3, 1),
                alpha('KeyC', 'c', 'C', 3, 2),
                alpha('KeyV', 'v', 'V', 3, 3),
                alpha('KeyB', 'b', 'B', 3, 3),
                alpha('KeyN', 'n', 'N', 3, 6),
                alpha('KeyM', 'm', 'M', 3, 6),
                alpha('Comma', ',', '<', 3, 7),
                alpha('Period', '.', '>', 3, 8),
                alpha('Slash', '/', '?', 3, 9),
                sys('ShiftRight', 'Shift', 2.7, 3, 9)
            ],
            // Row 4: Space Row
            [
                sys('ControlLeft', 'Ctrl', 1.25, 4, 0),
                sys('MetaLeft', 'Win', 1.25, 4, 1),
                sys('AltLeft', 'Alt', 1.25, 4, 2),
                sys('Space', 'Space', 6.25, 4, 4), // 4=thumbs
                sys('AltRight', 'Alt', 1.25, 4, 7),
                sys('MetaRight', 'Win', 1.25, 4, 8),
                sys('ControlRight', 'Ctrl', 1.25, 4, 9)
            ]
        ]
    },
    dvorak: {
        id: 'dvorak',
        name: 'Dvorak',
        description: 'Prioritizes maximum typing on the home row',
        rows: [] // To be modeled fully later
    },
    colemak: {
        id: 'colemak',
        name: 'Colemak',
        description: 'Optimized QWERTY successor minimizing finger travel',
        rows: [] // To be modeled
    },
    workman: {
        id: 'workman',
        name: 'Workman',
        description: 'Reduces lateral finger stretching',
        rows: [] // To be modeled
    }
};

/**
 * Returns a fast lookup map mapping actual character keys to their required finger 
 * depending on the passed layout model
 */
export function buildFingerMapForLayout(layoutType: KeyboardLayoutType): Map<string, number> {
    const layout = LAYOUTS[layoutType];
    const map = new Map<string, number>();
    
    if (!layout || layout.rows.length === 0) return map; // Fallback
    
    for (const row of layout.rows) {
        for (const key of row) {
            if (!key.isSystem) {
                map.set(key.label.toLowerCase(), key.finger);
                if (key.shiftLabel) {
                    map.set(key.shiftLabel, key.finger);
                }
            }
        }
    }
    
    return map;
}
