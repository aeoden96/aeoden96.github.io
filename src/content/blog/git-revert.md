---
title: 'Git - revert'
description: 'Lorem ipsum dolor sit amet'
pubDate: 'Jul 08 2022'
heroImage: '/blog-placeholder-3.jpg'
---

## Create dev branch

```md
git checkout -b development
git push origin main
```


## Revert main to initial commit

```md
git checkout main
git reset --hard 4a245b6b198f1ed8f8fcd6fc0f1c1cc3db6558e5
git push origin main --force
```


## Merge dev into main (or do a PR)
```md
git checkout main
git merge other-branch -m "Thespian web - production 29.4." --no-ff
git push origin main
```