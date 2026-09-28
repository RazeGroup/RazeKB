const fs = require('fs');

let content = fs.readFileSync('style.css', 'utf8');

const rootRepl = `/* === Design Tokens — RAZE Software Identity + Linear Aesthetic === */
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
}`;

content = content.replace(/\/\* === Design Tokens[\s\S]*?:root\s*\{[\s\S]*?\}/, rootRepl);

// Update fonts and specific styling globally
content = content.replace(/font-weight:\s*(?:600|700|bold)\b/g, 'font-weight: 590');
content = content.replace(/border-radius:\s*10px/g, 'border-radius: var(--radius-lg)');

// Apply Linear's typography settings to body
content = content.replace(/body\s*\{([\s\S]*?)\}/, (match, bodyContent) => {
  if (!bodyContent.includes('font-feature-settings')) {
    return `body {${bodyContent}  font-feature-settings: "cv01" on, "ss03" on, "zero" on;\n  letter-spacing: -0.011em;\n}`;
  }
  return match;
});

fs.writeFileSync('style.css', content, 'utf8');
console.log('style.css updated.');
