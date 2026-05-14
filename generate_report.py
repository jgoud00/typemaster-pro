# Codebase Bug and Error Analysis Report
# Extracted from the included analysis and manual bug reports.

def get_codebase_health_summary():
    """
    Analyzes the Typemaster Pro codebase for errors, bugs, and code smells.
    """
    return {
        "total_issues": 647,  #
        "effort_to_fix": "2523 minutes",  #
        "critical_issues": [
            "Cognitive complexity issues in core algorithms", 
            "Asynchronous operations inside constructors"
        ],
        "major_issues": [
            "Unused variable assignments", 
            "Array indices as keys in React", 
            "Deprecated functional usage"
        ]
    }

# 1. Critical & Major Issues Breakdown by File
bugs_by_file = {
    "src/app/practice/page.tsx": [
        "CRITICAL: Refactor function to reduce Cognitive Complexity from 18 to 15.",  #
        "MAJOR: Remove useless assignment to variable 'sessionId'."  #
    ],
    "src/hooks/use-typing-controller.ts": [
        "CRITICAL: Refactor function to reduce Cognitive Complexity from 23 to 15.",  #
        "MAJOR: Remove useless assignments to 'getWpm' and 'getAccuracy'."  #
    ],
    "src/components/typing/typing-area.tsx": [
        "MAJOR: Do not use Array index in keys.",  #
        "MINOR: Mark the props of the component as read-only."  #
    ],
    "scripts/train-weakness-detector.ts": [
        "CRITICAL: Refactor function to reduce its Cognitive Complexity from 52 to the 15 allowed.",  #
        "MAJOR: Remove useless assignment to variables like 'header', 'key', and 'sessionKey'."  #
    ],
    "src/lib/skill-tree.ts": [
        "CRITICAL: Refactor asynchronous operation outside of the constructor.",  #
        "MAJOR: This branch's code block is the same as the block for the branch on line 315."  #
    ],
    "playwright-report/index.html": [
        "MAJOR BUG: Add 'lang' and/or 'xml:lang' attributes to this '<html>' element.",  #
        "MAJOR BUG: Unexpected duplicate 'font-weight' and selector ':root'."  #
    ]
}

# 2. Recurring Patterns & Smells (Global Themes)
common_systemic_issues = [
    "Next.js SSR Hydration Errors: Widespread use of `window` instead of `globalThis.window` across multiple E2E and component files.",  #
    "String Replacements: Systemic usage of `.replace()` where `.replaceAll()` is preferred for global replacements.",  #
    "Unused Variables & Imports: Numerous occurrences of useless variable assignments and unused imports that clutter dead code.",  #
    "Ternary Readability: Frequent nested ternary operations that need to be extracted into independent statements to improve clarity.",  #
    "React Anti-Patterns: Usage of Array index in keys, impacting rendering performance."  #
]

def analyze_json_for_automated_parsing():
    import json
    
    # An example logic loop for resolving these structurally:
    # 1. Address `globalThis` replacements globally (sed or simple AST rewrites).
    # 2. Refactor `train-weakness-detector.ts` due to heavily flagged cognitive complexity.
    # 3. Resolve key indices in React mapping components.
    
    return "Execute targeted refactoring iterations to address the 647 flagged instances systematically."

if __name__ == "__main__":
    summary = get_codebase_health_summary()
    print("=" * 60)
    print("  TYPEMASTER PRO — CODEBASE HEALTH REPORT")
    print("=" * 60)
    print(f"\nTotal Issues: {summary['total_issues']}")
    print(f"Effort to Fix: {summary['effort_to_fix']}")
    print(f"\nCritical: {', '.join(summary['critical_issues'])}")
    print(f"Major:    {', '.join(summary['major_issues'])}")

    print("\n" + "-" * 60)
    print("  BUGS BY FILE")
    print("-" * 60)
    for file, issues in bugs_by_file.items():
        print(f"\n  {file}")
        for issue in issues:
            print(f"    • {issue}")

    print("\n" + "-" * 60)
    print("  SYSTEMIC ISSUES")
    print("-" * 60)
    for i, issue in enumerate(common_systemic_issues, 1):
        print(f"  {i}. {issue}")

    print("\n" + "=" * 60)
    print(f"  {analyze_json_for_automated_parsing()}")
    print("=" * 60)