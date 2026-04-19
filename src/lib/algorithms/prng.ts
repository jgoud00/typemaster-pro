export class PRNG {
    private seed: number;
    constructor(seed: number = 1337) { this.seed = seed; }
    next(): number {
        this.seed = (this.seed * 1664525 + 1013904223) % 4294967296;
        return this.seed / 4294967296;
    }
    getSeed(): number { return this.seed; }
    setSeed(seed: number): void { this.seed = seed; }
}

export const random = new PRNG(Date.now());
