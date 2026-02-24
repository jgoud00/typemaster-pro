/**
 * Levenshtein Distance Algorithm
 * 
 * Calculates the minimum number of single-character edits (insertions, deletions, or substitutions)
 * required to change one string into another.
 * Used for advanced error analysis in typing tests to distinguish between wrong keys, missed keys, and extra keys.
 * 
 * Loosely based on the dynamic programming approach found in:
 * TypeScript-master/dynamic_programming/lcs.ts
 */

export interface EditOp {
    type: 'match' | 'substitution' | 'insertion' | 'deletion';
    char: string; // The character involved (from target for sub/ins, from source for del)
    index: number; // Index in the target string
}

export interface LevenshteinResult {
    distance: number;
    operations: EditOp[];
    breakdown: {
        substitutions: number;
        insertions: number;
        deletions: number;
    };
}

export function levenshteinDistance(source: string, target: string): LevenshteinResult {
    const m = source.length;
    const n = target.length;

    // Create DP matrix
    // dp[i][j] stores the distance between source[0..i] and target[0..j]
    const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

    // Initialize first row and column
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    // Fill DP table
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            const cost = source[i - 1] === target[j - 1] ? 0 : 1;
            dp[i][j] = Math.min(
                dp[i - 1][j] + 1,      // Deletion
                dp[i][j - 1] + 1,      // Insertion
                dp[i - 1][j - 1] + cost // Substitution
            );
        }
    }

    // Backtrack to find operations
    let i = m;
    let j = n;
    const operations: EditOp[] = [];
    let substitutions = 0;
    let insertions = 0;
    let deletions = 0;

    while (i > 0 || j > 0) {
        if (i > 0 && j > 0 && source[i - 1] === target[j - 1]) {
            operations.unshift({ type: 'match', char: source[i - 1], index: j - 1 });
            i--;
            j--;
        } else if (j > 0 && (i === 0 || dp[i][j] === dp[i][j - 1] + 1)) {
            operations.unshift({ type: 'insertion', char: target[j - 1], index: j - 1 });
            insertions++;
            j--;
        } else if (i > 0 && (j === 0 || dp[i][j] === dp[i - 1][j] + 1)) {
            operations.unshift({ type: 'deletion', char: source[i - 1], index: j });
            deletions++;
            i--;
        } else {
            operations.unshift({ type: 'substitution', char: target[j - 1], index: j - 1 });
            substitutions++;
            i--;
            j--;
        }
    }

    return {
        distance: dp[m][n],
        operations,
        breakdown: {
            substitutions,
            insertions,
            deletions
        }
    };
}
