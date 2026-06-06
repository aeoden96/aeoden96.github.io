---
title: "Git - Interactive Rebase"
description: "Rewriting history with git rebase -i: squash, reword, drop, edit, and reorder commits"
pubDate: "Jun 07 2026"
tags: ["git", "snippet"]
---

## Open Interactive Rebase

```sh
git rebase -i HEAD~N      # rewrite last N commits
git rebase -i <hash>      # rewrite everything after this commit
```

An editor opens listing the commits. Change the command word on each line to control what happens.

## Available Commands

| Command  | What it does |
|----------|--------------|
| `pick`   | Keep commit as-is |
| `reword` | Keep commit, edit the message |
| `edit`   | Pause to amend the commit itself |
| `squash` | Merge into previous commit, combine messages |
| `fixup`  | Merge into previous commit, discard this message |
| `drop`   | Delete the commit entirely |

## Squash Last N Commits into One

```sh
git rebase -i HEAD~3
# In editor: change 2nd and 3rd "pick" lines to "squash"
# Save → write the combined commit message
git push origin your-branch --force-with-lease
```

## Reword a Commit Message

```sh
git rebase -i HEAD~3
# Change target line from "pick" to "reword"
# Save → a new editor opens for just that message
```

## Drop a Commit

```sh
git rebase -i HEAD~5
# Change target line from "pick" to "drop" (or delete the line entirely)
```

## Abort if Something Goes Wrong

```sh
git rebase --abort
```
