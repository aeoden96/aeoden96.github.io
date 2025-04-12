---
title: "VS Code - Custom Settings"
description: "Enhancing productivity with customized VS Code settings"
pubDate: "Jul 8 2023"
heroImage: "/blog-placeholder-3.jpg"
---

## Custom Settings for VS Code

Visual Studio Code allows you to customize settings to match your workflow.

### Adding to settings.json

To customize your settings in VS Code, press `Ctrl+Shift+P` (or `Cmd+Shift+P` on macOS) and search for "Preferences: Open Settings (JSON)". Then add these settings:

```json
// USER keybinds
{
  // "Default" profile settings
  "editor.inlineSuggest.enabled": true,
  "editor.stickyScroll.enabled": true,
  "editor.guides.bracketPairs": "active",
  "editor.unicodeHighlight.nonBasicASCII": false,

  // "javascript.validate.enable": false,

  "diffEditor.ignoreTrimWhitespace": false,
  "typescript.updateImportsOnFileMove.enabled": "always",
  "search.quickOpen.includeHistory": false,

  "task.problemMatchers.neverPrompt": {
    "shell": true
  },
  "security.workspace.trust.enabled": false,
  "workbench.editor.openSideBySideDirection": "down",
  "editor.tabSize": 2,

  "workbench.startupEditor": "none",
  "todohighlight.isEnable": true,

  // ---------- Editor ----------

  "editor.fontFamily": "MesloLGS NF",
  "editor.fontLigatures": true,
  "editor.fontSize": 14,

  // ---------- Terminal ----------

  "terminal.external.osxExec": "iTerm.app",
  "terminal.external.linuxExec": "konsole",
  "terminal.integrated.fontFamily": "MesloLGS NF",
  "terminal.integrated.fontSize": 12,
  "terminal.integrated.lineHeight": 1.0,
  "terminal.integrated.defaultProfile.osx": "zsh",
  "terminal.integrated.defaultProfile.linux": "zsh",
  "terminal.integrated.automationProfile.linux": {
    "path": "/usr/bin/zsh" // or "/bin/zsh" if you're using Ubuntu
  },

  // ---------- Git ----------

  "git.autofetch": true,
  "git.ignoreRebaseWarning": true,
  "git.openRepositoryInParentFolders": "never",

  "github.copilot.enable": {
    "*": true,
    "plaintext": true,
    "markdown": false,
    "scminput": false,
    "typescript": true,
    "yaml": true,
    "jsonc": true,
    "ruby": true
  },

  // ---------- Eslint and Prettier ----------

  "eslint.format.enable": true,
  "editor.formatOnSave": true,
  "editor.formatOnPaste": true,

  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],

  "editor.defaultFormatter": "esbenp.prettier-vscode",

  "prettier.singleQuote": true,
  "prettier.trailingComma": "none",
  "prettier.enable": true,

  // ---------- Language Specific Settings ----------

  "files.associations": {
    "*.html.erb": "html"
  },

  "editor.codeActionsOnSave": {
    "source.fixAll": "always",
    "source.fixAll.eslint": true
  },

  "[python]": {
    "editor.formatOnType": true
  },

  "[json]": {
    "editor.defaultFormatter": "vscode.json-language-features"
  },

  "[jsonc]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }

  // "[javascript][javascriptreact][typescript][typescriptreact]": {
  //   "editor.codeActionsOnSave": {
  //     "source.fixAll.eslint": "explicit"
  //   }
  // }
}
```
