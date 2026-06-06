---
title: "Git - Syncing a Fork PR with Upstream"
description: "How to catch up a long-open PR branch with upstream changes and push new commits"
pubDate: "Jun 07 2026"
tags: ["git", "snippet"]
---

## Add Upstream Remote

Do this once after cloning your fork.

```sh
git remote add upstream https://github.com/original/repo.git
```

## Fetch and Rebase onto Upstream

```sh
git fetch upstream
git checkout your-branch
git rebase upstream/main
```

## Resolve Conflicts (if any)

Git will pause at each conflicted commit. Fix the files, then continue.

```sh
# after resolving each conflicted file:
git add <file>
git rebase --continue

# to abort and start over:
git rebase --abort
```

## Force Push to Update the Open PR

```sh
git push origin your-branch --force-with-lease
```

`--force-with-lease` is safer than `--force` — it refuses the push if someone else has pushed to the branch since you last fetched.

## Add Additional Commits on Top

After the rebase the branch is up to date. Continue working normally.

```sh
git add .
git commit -m "Your new changes"
git push origin your-branch
```
