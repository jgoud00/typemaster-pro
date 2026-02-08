/**
 * Transfer Learning Insights
 * 
 * Identifies keys that share characteristics (same finger, row, hand)
 * and predicts how improving one key will benefit others.
 */

type Finger = 'pinky' | 'ring' | 'middle' | 'index' | 'thumb';
type Hand = 'left' | 'right';
type Row = 'number' | 'top' | 'home' | 'bottom';

interface KeyCharacteristics {
    key: string;
    hand: Hand;
    finger: Finger;
    row: Row;
}

// Complete key mappings
const KEY_CHARACTERISTICS: KeyCharacteristics[] = [
    // Left hand - Number row
    { key: '1', hand: 'left', finger: 'pinky', row: 'number' },
    { key: '2', hand: 'left', finger: 'ring', row: 'number' },
    { key: '3', hand: 'left', finger: 'middle', row: 'number' },
    { key: '4', hand: 'left', finger: 'index', row: 'number' },
    { key: '5', hand: 'left', finger: 'index', row: 'number' },
    // Left hand - Top row
    { key: 'q', hand: 'left', finger: 'pinky', row: 'top' },
    { key: 'w', hand: 'left', finger: 'ring', row: 'top' },
    { key: 'e', hand: 'left', finger: 'middle', row: 'top' },
    { key: 'r', hand: 'left', finger: 'index', row: 'top' },
    { key: 't', hand: 'left', finger: 'index', row: 'top' },
    // Left hand - Home row
    { key: 'a', hand: 'left', finger: 'pinky', row: 'home' },
    { key: 's', hand: 'left', finger: 'ring', row: 'home' },
    { key: 'd', hand: 'left', finger: 'middle', row: 'home' },
    { key: 'f', hand: 'left', finger: 'index', row: 'home' },
    { key: 'g', hand: 'left', finger: 'index', row: 'home' },
    // Left hand - Bottom row
    { key: 'z', hand: 'left', finger: 'pinky', row: 'bottom' },
    { key: 'x', hand: 'left', finger: 'ring', row: 'bottom' },
    { key: 'c', hand: 'left', finger: 'middle', row: 'bottom' },
    { key: 'v', hand: 'left', finger: 'index', row: 'bottom' },
    { key: 'b', hand: 'left', finger: 'index', row: 'bottom' },
    // Right hand - Number row
    { key: '6', hand: 'right', finger: 'index', row: 'number' },
    { key: '7', hand: 'right', finger: 'index', row: 'number' },
    { key: '8', hand: 'right', finger: 'middle', row: 'number' },
    { key: '9', hand: 'right', finger: 'ring', row: 'number' },
    { key: '0', hand: 'right', finger: 'pinky', row: 'number' },
    // Right hand - Top row
    { key: 'y', hand: 'right', finger: 'index', row: 'top' },
    { key: 'u', hand: 'right', finger: 'index', row: 'top' },
    { key: 'i', hand: 'right', finger: 'middle', row: 'top' },
    { key: 'o', hand: 'right', finger: 'ring', row: 'top' },
    { key: 'p', hand: 'right', finger: 'pinky', row: 'top' },
    // Right hand - Home row
    { key: 'h', hand: 'right', finger: 'index', row: 'home' },
    { key: 'j', hand: 'right', finger: 'index', row: 'home' },
    { key: 'k', hand: 'right', finger: 'middle', row: 'home' },
    { key: 'l', hand: 'right', finger: 'ring', row: 'home' },
    { key: ';', hand: 'right', finger: 'pinky', row: 'home' },
    // Right hand - Bottom row
    { key: 'n', hand: 'right', finger: 'index', row: 'bottom' },
    { key: 'm', hand: 'right', finger: 'index', row: 'bottom' },
    { key: ',', hand: 'right', finger: 'middle', row: 'bottom' },
    { key: '.', hand: 'right', finger: 'ring', row: 'bottom' },
    { key: '/', hand: 'right', finger: 'pinky', row: 'bottom' },
];

export interface TransferInsight {
    sourceKey: string;
    relatedKeys: Array<{
        key: string;
        relationship: 'same_finger' | 'same_hand' | 'same_row' | 'mirror';
        transferScore: number; // 0-100, how much improvement transfers
    }>;
    explanation: string;
}

class TransferLearningAnalyzer {
    private keyMap: Map<string, KeyCharacteristics> = new Map();

    constructor() {
        KEY_CHARACTERISTICS.forEach(kc => {
            this.keyMap.set(kc.key, kc);
        });
    }

    /**
     * Get keys that share the same finger
     */
    getSameFingerKeys(key: string): string[] {
        const characteristics = this.keyMap.get(key.toLowerCase());
        if (!characteristics) return [];

        return KEY_CHARACTERISTICS
            .filter(kc =>
                kc.hand === characteristics.hand &&
                kc.finger === characteristics.finger &&
                kc.key !== characteristics.key
            )
            .map(kc => kc.key);
    }

    /**
     * Get mirror keys (same position, opposite hand)
     */
    getMirrorKey(key: string): string | null {
        const characteristics = this.keyMap.get(key.toLowerCase());
        if (!characteristics) return null;

        const mirror = KEY_CHARACTERISTICS.find(kc =>
            kc.hand !== characteristics.hand &&
            kc.finger === characteristics.finger &&
            kc.row === characteristics.row
        );

        return mirror?.key || null;
    }

    /**
     * Get transfer learning insights for a key
     */
    getTransferInsights(key: string): TransferInsight {
        const characteristics = this.keyMap.get(key.toLowerCase());

        if (!characteristics) {
            return {
                sourceKey: key,
                relatedKeys: [],
                explanation: 'No transfer data available for this key.',
            };
        }

        const relatedKeys: TransferInsight['relatedKeys'] = [];

        // Same finger keys (highest transfer)
        const sameFinger = this.getSameFingerKeys(key);
        sameFinger.forEach(k => {
            relatedKeys.push({
                key: k,
                relationship: 'same_finger',
                transferScore: 80, // High transfer for same finger
            });
        });

        // Mirror key (moderate transfer)
        const mirror = this.getMirrorKey(key);
        if (mirror) {
            relatedKeys.push({
                key: mirror,
                relationship: 'mirror',
                transferScore: 50, // Moderate transfer for mirror
            });
        }

        // Same hand keys (lower transfer)
        KEY_CHARACTERISTICS
            .filter(kc =>
                kc.hand === characteristics.hand &&
                kc.finger !== characteristics.finger &&
                kc.key !== key.toLowerCase()
            )
            .slice(0, 3) // Limit to 3
            .forEach(kc => {
                relatedKeys.push({
                    key: kc.key,
                    relationship: 'same_hand',
                    transferScore: 30,
                });
            });

        // Same row keys (lowest transfer)
        KEY_CHARACTERISTICS
            .filter(kc =>
                kc.row === characteristics.row &&
                kc.hand !== characteristics.hand &&
                !relatedKeys.some(r => r.key === kc.key)
            )
            .slice(0, 2)
            .forEach(kc => {
                relatedKeys.push({
                    key: kc.key,
                    relationship: 'same_row',
                    transferScore: 20,
                });
            });

        // Sort by transfer score
        relatedKeys.sort((a, b) => b.transferScore - a.transferScore);

        // Generate explanation
        const sameFingerList = sameFinger.map(k => k.toUpperCase()).join(', ');
        const explanation = sameFinger.length > 0
            ? `Improving "${key.toUpperCase()}" will significantly boost ${sameFingerList} (same ${characteristics.finger} finger).`
            : `Improving "${key.toUpperCase()}" will help with ${characteristics.hand} hand dexterity.`;

        return {
            sourceKey: key,
            relatedKeys,
            explanation,
        };
    }

    /**
     * Get all same-finger key groups
     */
    getAllFingerGroups(): Map<string, string[]> {
        const groups = new Map<string, string[]>();

        const hands: Hand[] = ['left', 'right'];
        const fingers: Finger[] = ['pinky', 'ring', 'middle', 'index'];

        for (const hand of hands) {
            for (const finger of fingers) {
                const groupKey = `${hand}-${finger}`;
                const keys = KEY_CHARACTERISTICS
                    .filter(kc => kc.hand === hand && kc.finger === finger)
                    .map(kc => kc.key);
                groups.set(groupKey, keys);
            }
        }

        return groups;
    }

    /**
     * Calculate expected improvement for related keys
     */
    calculateTransferEffect(
        sourceKey: string,
        improvementPercent: number
    ): Array<{ key: string; expectedImprovement: number }> {
        const insights = this.getTransferInsights(sourceKey);

        return insights.relatedKeys.map(related => ({
            key: related.key,
            expectedImprovement: Math.round(improvementPercent * (related.transferScore / 100)),
        }));
    }
}

export const transferLearningAnalyzer = new TransferLearningAnalyzer();
