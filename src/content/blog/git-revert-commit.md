---
title: 'Git - revert commit'
description: 'Lorem ipsum dolor sit amet'
pubDate: 'Jul 08 2022'
heroImage: '/blog-placeholder-3.jpg'
---

```sh
git reset --hard origin/master
```
- throw away all staged and unstaged changes, forget everything on my current local branch and make it exactly the same as origin/master


##  [Reverting commit(s)](https://pages.github.com/)
I want to revert to commit ```56e05fced```

Ensure you have no uncommitted changes that you want to keep
```sh
# Reset the index and working tree to the desired tree
git reset --hard 56e05fced

# Move the branch pointer back to the previous HEAD
git reset --soft "HEAD@{1}"
```

##  Rewriting entire remote branch with other branch
Rewriting ```staging``` branch with ```new_release```:
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