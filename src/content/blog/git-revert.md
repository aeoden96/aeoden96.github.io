---
title: "Git: Managing Branches and Reverts"
description: "Essential Git commands for reverting to initial commits and merging branches"
pubDate: "Jul 08 2022"
tags: ["git", "snippet"]
---

## Creating a Development Branch

```md
git checkout -b development
git push origin main
```

## Reverting Main Branch to Initial Commit

```md
git checkout main
git reset --hard <branch id>
git push origin main --force
```

## Merging Development into Main

```md
git checkout main
git merge other-branch -m "Title - production 29.4." --no-ff
git push origin main
```
