---
title: "Git - Reset Fork to Match Upstream"
description: "How to discard all local fork changes and make it exactly match upstream"
pubDate: "Jun 07 2026"
tags: ["git", "snippet"]
---

## Add Upstream Remote

Do this once after cloning your fork.

```sh
git remote add upstream https://github.com/original/repo.git
```

## Fetch and Hard Reset to Upstream

```sh
git fetch upstream
git checkout main
git reset --hard upstream/main
```

This discards all local commits and changes on `main` — your branch will be an exact copy of upstream's `main`.

## Push to Your Fork on GitHub

```sh
git push origin main --force
```
