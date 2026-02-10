/**
 * Statistical Utility Functions
 * 
 * Beta distribution, Gamma distribution, and related statistical functions
 * used by the weakness detection system.
 */

/**
 * Approximate inverse of the regularized incomplete beta function
 * Used for calculating credible intervals
 */
export function betaInv(p: number, a: number, b: number): number {
    // Newton-Raphson approximation
    let x = 0.5;
    for (let i = 0; i < 10; i++) {
        const fx = betaInc(x, a, b) - p;
        const dfx = Math.pow(x, a - 1) * Math.pow(1 - x, b - 1) / beta(a, b);
        x = Math.max(0.001, Math.min(0.999, x - fx / dfx));
    }
    return x;
}

/**
 * Regularized incomplete beta function (approximation)
 */
export function betaInc(x: number, a: number, b: number): number {
    // Simple approximation using continued fraction for small values
    if (x === 0) return 0;
    if (x === 1) return 1;

    const bt = Math.exp(
        lgamma(a + b) - lgamma(a) - lgamma(b) +
        a * Math.log(x) + b * Math.log(1 - x)
    );

    if (x < (a + 1) / (a + b + 2)) {
        return bt * betaCF(x, a, b) / a;
    } else {
        return 1 - bt * betaCF(1 - x, b, a) / b;
    }
}

/**
 * Continued fraction for incomplete beta function
 */
function betaCF(x: number, a: number, b: number): number {
    const maxIterations = 100;
    const epsilon = 1e-10;

    let c = 1;
    let d = 1 - (a + b) * x / (a + 1);
    if (Math.abs(d) < epsilon) d = epsilon;
    d = 1 / d;
    let h = d;

    for (let m = 1; m <= maxIterations; m++) {
        const m2 = 2 * m;

        // Even step
        let aa = m * (b - m) * x / ((a + m2 - 1) * (a + m2));
        d = 1 + aa * d;
        if (Math.abs(d) < epsilon) d = epsilon;
        c = 1 + aa / c;
        if (Math.abs(c) < epsilon) c = epsilon;
        d = 1 / d;
        h *= d * c;

        // Odd step
        aa = -(a + m) * (a + b + m) * x / ((a + m2) * (a + m2 + 1));
        d = 1 + aa * d;
        if (Math.abs(d) < epsilon) d = epsilon;
        c = 1 + aa / c;
        if (Math.abs(c) < epsilon) c = epsilon;
        d = 1 / d;
        const delta = d * c;
        h *= delta;

        if (Math.abs(delta - 1) < epsilon) break;
    }

    return h;
}

/**
 * Beta function
 */
export function beta(a: number, b: number): number {
    return Math.exp(lgamma(a) + lgamma(b) - lgamma(a + b));
}

/**
 * Log-gamma function (Lanczos approximation)
 */
export function lgamma(x: number): number {
    const g = 7;
    const c = [
        0.99999999999980993,
        676.5203681218851,
        -1259.1392167224028,
        771.32342877765313,
        -176.61502916214059,
        12.507343278686905,
        -0.13857109526572012,
        9.9843695780195716e-6,
        1.5056327351493116e-7
    ];

    if (x < 0.5) {
        return Math.log(Math.PI / Math.sin(Math.PI * x)) - lgamma(1 - x);
    }

    x -= 1;
    let a = c[0];
    const t = x + g + 0.5;

    for (let i = 1; i < g + 2; i++) {
        a += c[i] / (x + i);
    }

    return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
}

/**
 * Gamma function
 */
export function gamma(x: number): number {
    return Math.exp(lgamma(x));
}

/**
 * Sample from Beta distribution using Box-Muller and ratio of uniforms
 */
export function sampleBeta(alpha: number, beta: number): number {
    const gammaAlpha = sampleGamma(alpha, 1);
    const gammaBeta = sampleGamma(beta, 1);
    return gammaAlpha / (gammaAlpha + gammaBeta);
}

/**
 * Sample from Gamma distribution (Marsaglia and Tsang's method)
 */
export function sampleGamma(shape: number, scale: number): number {
    if (shape < 1) {
        return sampleGamma(shape + 1, scale) * Math.pow(Math.random(), 1 / shape);
    }

    const d = shape - 1 / 3;
    const c = 1 / Math.sqrt(9 * d);

    while (true) {
        let x: number, v: number;
        do {
            x = randn();
            v = 1 + c * x;
        } while (v <= 0);

        v = v * v * v;
        const u = Math.random();

        if (u < 1 - 0.0331 * (x * x) * (x * x)) {
            return d * v * scale;
        }

        if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) {
            return d * v * scale;
        }
    }
}

/**
 * Standard normal random variable (Box-Muller)
 */
function randn(): number {
    const u1 = Math.random();
    const u2 = Math.random();
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

/**
 * Mean of Beta distribution
 */
export function betaMean(alpha: number, beta: number): number {
    return alpha / (alpha + beta);
}

/**
 * Variance of Beta distribution
 */
export function betaVariance(alpha: number, beta: number): number {
    const sum = alpha + beta;
    return (alpha * beta) / (sum * sum * (sum + 1));
}

/**
 * Standard deviation of Beta distribution
 */
export function betaStdDev(alpha: number, beta: number): number {
    return Math.sqrt(betaVariance(alpha, beta));
}
