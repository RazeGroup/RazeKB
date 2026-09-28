import re

def main():
    with open('style.css', 'r', encoding='utf-8') as f:
        content = f.read()

    # Update :root tokens
    root_repl = """/* === Design Tokens — RAZE Software Identity + Linear Aesthetic === */
:root {
  --bg:            #080405; /* Void */
  --surface:       #14090b; /* Carbon */
  --surface-2:     #1f0c0f; /* Obsidian */
  --border:        #261215; /* Graphite */
  --border-focus:  #c80000;
  --text:          #ffffff; /* Paper */
  --text-muted:    #b5a7aa; /* Fog */
  --text-dim:      #7a6a6d; /* Ash */
  --accent:        #c80000; /* Acid Lime equivalent */
  --accent-hover:  #e60000;
  --accent-glow:   rgba(200, 0, 0, 0.35);
  --code-bg:       #100608;
  
  --sidebar-w:     240px;
  --header-h:      52px;
  
  /* Linear Spacing */
  --spacing-4: 4px; --spacing-8: 8px; --spacing-12: 12px; --spacing-16: 16px; 
  --spacing-24: 24px; --spacing-32: 32px; --spacing-96: 96px;
  
  /* Linear Radii */
  --radius-sm: 2px;
  --radius: 6px;
  --radius-lg: 12px;
  --radius-pill: 9999px;
  
  --trans:         120ms ease;
  
  /* Linear Fonts */
  --font:          'Inter', -apple-system, system-ui, sans-serif;
  --font-mono:     'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
}"""
    content = re.sub(r'/\* === Design Tokens.*?:root\s*\{.*?\n\}', root_repl, content, flags=re.DOTALL)

    # 1. Update font weights & body
    content = re.sub(r'font-weight:\s*(?:600|700|bold)\b', 'font-weight: 590', content)
    # Remove gradients in buttons or specific text (optional, but requested for linear)
    content = re.sub(r'border-radius:\s*10px', 'border-radius: var(--radius-lg)', content)
    
    # 2. Update Box Shadows to subtle inset or remove them
    content = re.sub(r'box-shadow:\s*0 4px 12px[^;]+;', 'box-shadow: 0 2px 4px rgba(0,0,0,0.4);', content)
    content = re.sub(r'box-shadow:\s*0 8px 24px[^;]+;', 'box-shadow: 0 4px 32px rgba(8,9,10,0.6);', content)
    
    # Shadows for cards (use inset)
    # Raze has `.card` maybe? We will blanket convert some `border: 1px solid` to `box-shadow: 0 0 0 1px inset var(--border)`
    # Linear prefers hairline borders and 12px radius for cards.

    with open('style.css', 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == '__main__':
    main()
