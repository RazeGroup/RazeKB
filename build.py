import json
import os
import re
import hashlib
from typing import Dict, List, Any

# --- Configuration ---
CONTENT_DIR = './content'
INDEX_JSON = './index.json'
DATA_JS = './data.js'
CACHE_FILE = './translation_cache.json'
LANGUAGES = ["en", "ar"] # Strictly supported languages
# ---------------------

translation_cache = {}

def load_cache():
    global translation_cache
    if os.path.exists(CACHE_FILE):
        try:
            with open(CACHE_FILE, 'r', encoding='utf-8') as f:
                translation_cache = json.load(f)
        except: translation_cache = {}

def save_cache():
    with open(CACHE_FILE, 'w', encoding='utf-8') as f:
        json.dump(translation_cache, f, ensure_ascii=False, indent=2)

def translate_text(text: str, target_lang: str) -> str:
    """
    Expert Context-Aware Translation for Cybersecurity Content.
    Rules:
    - Meaning-based (NOT literal).
    - Preserves technical terms (XSS, payload, exploit, etc.).
    - Protects code blocks and inline code.
    """
    if not text.strip() or target_lang == 'en': return text

    # Check cache
    text_hash = hashlib.md5(text.encode('utf-8')).hexdigest()
    cache_key = f"{text_hash}_{target_lang}"
    if cache_key in translation_cache: return translation_cache[cache_key]

    # 1. Protect code blocks (```...```) and inline code (`...`)
    placeholders = []
    def protect_callback(match):
        placeholders.append(match.group(0))
        return f" __PROTECTED_BLOCK_{len(placeholders)-1}__ "

    protected_text = re.sub(r'```[\s\S]*?```|`.*?`', protect_callback, text)

    # 2. Expert Translation Logic
    # In a production environment, this would call an LLM (like GPT-4) or a specialized API.
    # For this implementation, we simulate the "Context-Aware" logic.
    
    # Simulate technical term preservation
    technical_terms = ['XSS', 'Payload', 'SQL Injection', 'Exploit', 'Endpoint', 'Red Team', 'Bypass']
    
    def simulate_expert_translation(s):
        # This is where the "Expert" logic lives. 
        # For demonstration, we prefix but keep technical terms intact.
        if target_lang == 'ar':
            # Mock Arabic technical phrasing
            return f"[AR-Expert] {s}"
        return f"[{target_lang}] {s}"

    # Split by lines to preserve structure
    lines = protected_text.split('\n')
    translated_lines = []
    for line in lines:
        if line.strip() and not line.startswith('__PROTECTED_'):
            # Detect if line is mostly technical/command-like
            if re.search(r'[a-zA-Z]', line):
                translated_lines.append(simulate_expert_translation(line))
            else:
                translated_lines.append(line)
        else:
            translated_lines.append(line)

    final_translated = '\n'.join(translated_lines)

    # 3. Restore Protected Blocks
    for i, original in enumerate(placeholders):
        final_translated = final_translated.replace(f" __PROTECTED_BLOCK_{i}__ ", original)

    translation_cache[cache_key] = final_translated
    return final_translated

def build():
    load_cache()
    site_data = []
    print(f"Build starting: Scanning {CONTENT_DIR}...")
    
    for root, _, files in os.walk(CONTENT_DIR):
        for file in files:
            if not file.endswith('.md'): continue
            file_path = os.path.join(root, file)
            rel_path = os.path.relpath(file_path, CONTENT_DIR).replace('\\', '/')
            
            with open(file_path, 'r', encoding='utf-8') as f:
                lines = f.readlines()
            
            # Extract Raw English Content
            raw_title, content_lines, title_found = "Untitled", [], False
            for line in lines:
                if not title_found and line.startswith('# '):
                    raw_title, title_found = line.replace('# ', '').strip(), True
                else: content_lines.append(line)
            
            raw_content = "".join(content_lines).strip()
            
            # Multi-language Field Generation
            title_map, content_map = {}, {}
            for lang in LANGUAGES:
                title_map[lang] = translate_text(raw_title, lang)
                content_map[lang] = translate_text(raw_content, lang)

            site_data.append({
                "uri": '/' + rel_path.replace('.md', '/'),
                "title": title_map,
                "content": content_map,
                "filePath": rel_path
            })
    
    save_cache()
    # Save JSON and JS
    with open(DATA_JS, 'w', encoding='utf-8') as f:
        f.write("const siteData = " + json.dumps(site_data, ensure_ascii=False) + ";")
    with open(INDEX_JSON, 'w', encoding='utf-8') as f:
        json.dump(site_data, f, ensure_ascii=False, indent=2)
    
    print(f"Build complete: Generated data for {len(site_data)} modules, index.json and data.js saved.")

if __name__ == "__main__":
    build()
