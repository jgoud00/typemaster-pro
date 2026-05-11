import json
from collections import defaultdict

def generate_full_bug_report(json_file_path: str, output_md_path: str) -> None:
    try:
        with open(json_file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except FileNotFoundError:
        print(f"Error: Could not find {json_file_path}")
        return

    issues = data.get('issues', [])
    file_issues = defaultdict(list)
    
    # Group issues by their specific file
    for issue in issues:
        component = issue.get('component', '')
        file_name = component.split(':')[-1] if ':' in component else component
        file_issues[file_name].append(issue)
        
    with open(output_md_path, 'w', encoding='utf-8') as out:
        out.write("# Detailed File-by-File Bug Report\n\n")
        
        for file_name, bugs in sorted(file_issues.items()):
            out.write(f"## File: `{file_name}`\n")
            out.write(f"**Total Issues:** {len(bugs)}\n\n")
            
            for bug in sorted(bugs, key=lambda x: x.get('severity', 'INFO')):
                severity = bug.get('severity', 'INFO')
                message = bug.get('message', 'No description provided.')
                line = bug.get('line', 'N/A')
                issue_type = bug.get('type', 'CODE_SMELL')
                
                out.write(f"- **Line {line}** | [{severity}] {issue_type}: {message}\n")
                
                # Map common issues to direct solutions
                if "conditionally" in message and "Hook" in message:
                    out.write("  - *Solution*: Move the React hook outside of conditional statements to ensure stable call order.\n")
                elif "Cognitive Complexity" in message:
                    out.write("  - *Solution*: Modularize the function. Extract deeply nested logic into smaller helper functions.\n")
                elif "window" in message and "globalThis" in message:
                    out.write("  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.\n")
                elif "useless assignment" in message.lower():
                    out.write("  - *Solution*: Delete the unused variable assignment to clean up dead code.\n")
                elif "replaceAll" in message:
                    out.write("  - *Solution*: Swap `.replace()` with `.replaceAll()` for global string replacements.\n")
                elif "ternary" in message:
                    out.write("  - *Solution*: Refactor the nested ternary into a clear `if/else` block.\n")
                    
            out.write("\n---\n\n")
            
    print(f"Report generated successfully: {output_md_path}")

if __name__ == "__main__":
    # Ensure this runs in the root directory where issues.json is located
    generate_full_bug_report("issues.json", "full_codebase_bugs.md")