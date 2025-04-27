---
title: "VS Code - Custom Keybindings"
description: "Enhancing productivity with custom keyboard shortcuts"
pubDate: "Jul 8 2023"
tags: ["vscode", "productivity"]
---

## Custom Keybindings for VS Code

Visual Studio Code allows you to customize keyboard shortcuts to match your workflow.

### Adding to keybinds.json

To customize your keybindings in VS Code, press `Ctrl+Shift+P` (or `Cmd+Shift+P` on macOS) and search for "Preferences: Open Keyboard Shortcuts (JSON)". Then add these keybindings:

```json
// USER keybinds
[
  {
    "key": "ctrl+numpad_divide",
    "command": "editor.action.commentLine",
    "when": "editorTextFocus && !editorReadonly"
  },
  {
    "key": "ctrl+shift+7",
    "command": "-editor.action.commentLine",
    "when": "editorTextFocus && !editorReadonly"
  },
  {
    "key": "ctrl+shift+numpad_divide",
    "command": "editor.action.blockComment",
    "when": "editorTextFocus && !editorReadonly"
  },
  {
    "key": "ctrl+shift+a",
    "command": "-editor.action.blockComment",
    "when": "editorTextFocus && !editorReadonly"
  }
]
```
