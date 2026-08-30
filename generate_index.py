import json
import os

def generate_indices():
    with open('index.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    # 1. Generate ALL_FILES.md
    with open('ALL_FILES.md', 'w', encoding='utf-8') as f:
        f.write('# Master Cheatsheet Index\n\n')
        f.write('This file links to every Markdown source file in the repository for direct editing.\n\n')
        
        # Group by category (first part of URI)
        categories = {}
        for item in data:
            parts = [p for p in item['uri'].split('/') if p]
            cat = parts[0] if parts else 'General'
            if cat not in categories: 
                categories[cat] = []
            categories[cat].append(item)
        
        for cat in sorted(categories.keys()):
            # Format category name nicely
            display_cat = cat.replace('-', ' ').title()
            f.write(f"## {display_cat}\n")
            for item in sorted(categories[cat], key=lambda x: x.get('title', {}).get('en', 'Untitled') if isinstance(x.get('title'), dict) else str(x.get('title', 'Untitled'))):
                title_val = item.get('title', 'Untitled')
                if isinstance(title_val, dict):
                    title = title_val.get('en', 'Untitled')
                else:
                    title = str(title_val)
                    
                path = item.get('filePath', '')
                f.write(f"- [{title}](content/{path})\n")
            f.write('\n')

    print('Generated ALL_FILES.md successfully.')

    # 2. Generate content/SUMMARY.md
    summary_path = os.path.join('content', 'SUMMARY.md')
    os.makedirs(os.path.dirname(summary_path), exist_ok=True)
    
    with open(summary_path, 'w', encoding='utf-8') as f:
        f.write('# SUMMARY.md\n\n')
        f.write('# 👽 Welcome!\n\n')
        f.write('- [About the Author$$external:https://book.hacktricks.wiki/en/welcome/about-the-author.html$$]()\n\n')
        
        # Group by category
        categories = {}
        for item in data:
            parts = [p for p in item['uri'].split('/') if p]
            cat = parts[0] if parts else 'general'
            if cat not in categories:
                categories[cat] = []
            categories[cat].append(item)
            
        category_icons = {
            "active-directory": "🛡️",
            "windows-security": "🖥️",
            "linux-security": "🐧",
            "macos-security": "🍎",
            "aws-security": "☁️",
            "azure-security": "🔷",
            "gcp-security": "🌐",
            "kubernetes-containers": "☸️",
            "ci-cd-devops": "🏭",
            "other-cloud-security": "⛈️",
            "web-pentesting": "🌐",
            "network-pentesting": "🔌",
            "cryptography-steganography": "🔒",
            "mobile-security": "📱",
            "hardware-security": "📟",
            "forensics-incident-response": "🔍",
            "red-teaming-hacking": "👽",
            "reverse-engineering-exploit-dev": "👾",
            "methodologies-resources": "📚",
            "meta-assets": "⚙️"
        }
        
        for cat in sorted(categories.keys()):
            if cat in ('summary', 'welcome', 'categories'):
                continue
            icon = category_icons.get(cat, "📁")
            display_cat = cat.replace('-', ' ').title()
            
            f.write(f"# {icon} {display_cat}\n\n")
            
            # Sort items by subfolder, then by title
            subfolders = {}
            for item in categories[cat]:
                # Extract subfolder from filePath (Category/Subfolder/File.md)
                parts = item.get('filePath', '').replace('\\', '/').split('/')
                if len(parts) > 2:
                    sub = parts[1]
                else:
                    sub = ''
                if sub not in subfolders:
                    subfolders[sub] = []
                subfolders[sub].append(item)
                
            for sub in sorted(subfolders.keys()):
                # Sort items in subfolder by English title
                sorted_items = sorted(subfolders[sub], key=lambda x: x.get('title', {}).get('en', 'Untitled') if isinstance(x.get('title'), dict) else str(x.get('title', 'Untitled')))
                
                if sub:
                    display_sub = sub.replace('-', ' ').title()
                    f.write(f"- {display_sub}\n")
                    for item in sorted_items:
                        title_val = item.get('title', 'Untitled')
                        if isinstance(title_val, dict):
                            title = title_val.get('en', 'Untitled')
                        else:
                            title = str(title_val)
                        path = item.get('filePath', '')
                        # Path relative to content folder
                        f.write(f"  - [{title}]({path})\n")
                else:
                    for item in sorted_items:
                        title_val = item.get('title', 'Untitled')
                        if isinstance(title_val, dict):
                            title = title_val.get('en', 'Untitled')
                        else:
                            title = str(title_val)
                        path = item.get('filePath', '')
                        f.write(f"- [{title}]({path})\n")
            f.write('\n')
            
    print('Generated content/SUMMARY.md successfully.')

if __name__ == "__main__":
    generate_indices()
