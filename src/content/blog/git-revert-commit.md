---
title: "Git - How to Revert and Reset Commits"
description: "Guide for reverting commits and resetting branches in Git"
pubDate: "Jul 08 2022"
tags: ["git", "snippet"]
---

## Reset to Remote Branch

```sh
git reset --hard origin/master
```

This command discards all staged and unstaged changes, and makes your current local branch exactly match the remote `origin/master` branch.

## Reverting to a Specific Commit

If you want to revert to a specific commit (e.g., `5555dddd`), first ensure you have no uncommitted changes that you want to keep:

```sh
# Reset the index and working tree to the desired tree
git reset --hard 5555dddd

# Move the branch pointer back to the previous HEAD
git reset --soft "HEAD@{1}"
```

## Replacing a Remote Branch with Another Branch

When you need to completely replace one branch with another (e.g., updating `staging` with `new_release`):

```sh
# Checkout to new_release
git checkout new_release

# Delete local staging
git branch -D staging

# Create new local staging from new_release
git checkout -b staging

# Push new staging (now copy of new_release) to remote
git push origin staging -f
```
