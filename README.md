# 💀 Vectra Tips - Complete Management Manual
### by Abdulrahman Abu El-Naga

Welcome to the **Vectra Tips** documentation. This guide is designed for absolute beginners to help you add, edit, and manage knowledge on this website. 

---

## 🏁 1. Getting Started (First Time Only)
To manage this website, you only need two things on your computer:
1.  **Python**: [Download and Install Python](https://www.python.org/downloads/) (Make sure to check the box "Add Python to PATH" during installation).
2.  **A Text Editor**: We recommend [VS Code](https://code.visualstudio.com/), but you can use any editor.

---

## 🚀 2. Modern Workflow (Recommended: CMS Dashboard)
The easiest way to manage your website is through the built-in **CMS Dashboard**. It allows you to edit files, manage categories, and see translations instantly without touching a single code file.

### A. Start the Dashboard
Open your Terminal and run:
```powershell
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```
*   **Login**: Use `admin` and `cyberadmin123`.
*   **Access**: Go to `http://localhost:8000`.

### B. Dashboard Features
*   **Tree View**: Navigate through your categories and modules easily.
*   **New File**: Click the **(+)** icon to create new folders or modules.
*   **Save & Build**: Every time you save, the system automatically runs the build process and generates **Expert Translations** (e.g., Arabic).
*   **Manage**: Rename or Delete files directly from the interface.

---

## 📜 3. Legacy Workflow (Manual Method)
If you prefer to manage files manually using a text editor (like VS Code), you can still do so.

### A. The "Sync" Workflow (Crucial!)
The website uses a local "database" (`data.js`) to make searching fast. This database **does not** update itself automatically when you edit files manually.

**The Golden Rule:** Whenever you change any file in the `/content/` folder manually:
1.  Open your Terminal (or PowerShell).
2.  Type: `python build.py`
3.  Press Enter.
4.  Refresh your browser.

### B. The Manual Knowledge Tree (How to Organize)
The website's structure follows your folder structure exactly.

1.  **Adding a New "Part" (Main Category)**:
    *   Create a folder in `/content/` (e.g., `content/mobile-security/`).
    *   Create a description file named `mobile-security.md` directly inside `/content/`.
2.  **Adding a Subcategory**:
    *   Inside a category folder, create another folder (e.g., `content/web-pentest/injections/`).
    *   Create a description file at the parent level (e.g., `content/web-pentest/injections.md`).
3.  **Adding a New "Module" (Cheatsheet)**:
    *   Create a `.md` file inside any folder (e.g., `content/network/pivoting.md`).

---

## ✍️ 4. Writing Your Content (Markdown Tips)
Use standard Markdown to make your tips look professional on the site:

| To create a... | Use this syntax | Result on Website |
| :--- | :--- | :--- |
| **Main Title** | `# My Awesome Title` | Large, clean header |
| **Section** | `## Exploitation` | Red accented sub-header |
| **Code Block** | ` ```bash ` ... ` ``` ` | Styled, copyable code box |
| **Bold Text** | `**Critical**` | **Critical** highlighted text |
| **List** | `- Step 1` | Clean bullet points |
| **Table** | `| Tool | Port |` | Beautifully aligned data table |

> [!TIP]
> **Expert Translation:** The system automatically protects code blocks (```) and technical terms like **XSS** or **Payload** during translation, so they remain accurate for professionals!

---

## 🛠️ 5. Troubleshooting (Common Problems)

**Q: I saved a file but I don't see it on the website!**
- **Fix:** If using the manual method, did you run `python build.py`? If using the dashboard, check the "Save Status" message.

**Q: My code blocks look plain and have no colors.**
- **Fix:** Make sure you specify the language after the backticks (e.g., ` ```python ` or ` ```bash `).

**Q: I want to change the icon for a category.**
- **Fix:** Open `script.js` and find the `icons` section at the top. You can change the icon name (use [FontAwesome](https://fontawesome.com/search?o=r&m=free) names like `fa-globe`).

---

## 📁 File Reference Table

| File | Should I edit it? | Why? |
| :--- | :--- | :--- |
| `/content/` | **YES** | This is where all your knowledge lives. |
| `main.py` | **Rarely** | This runs the Dashboard server and Auth. |
| `index.html` | **Rarely** | Main website structure. |
| `dashboard/` | **Rarely** | Contains the files for the CMS interface. |
| `build.py` | **NO** | The build engine and translation logic. |
| `data.js` | **NEVER** | Auto-generated database. |

---
*Created and maintained with ❤️ by Abdulrahman Abu El-Naga*
