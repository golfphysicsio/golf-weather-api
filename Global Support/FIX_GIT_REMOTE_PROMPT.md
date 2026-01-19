# PROMPT FOR CLAUDE CODE - Fix Git Remote URL

**Quick fix for git remote URL**

---

```
I noticed the git remote URL is pointing to the old repository name. Please update it to use the correct golfphysicsio organization URL.

---

## TASK: Update Git Remote URL

### Step 1: Check Current Remote

```bash
git remote -v
```

**Expected to show:**
```
origin  https://github.com/roastedzen-png/golf-weather-api.git (fetch)
origin  https://github.com/roastedzen-png/golf-weather-api.git (push)
```

---

### Step 2: Update to Correct URL

```bash
git remote set-url origin https://github.com/golfphysicsio/golf-weather-api.git
```

---

### Step 3: Verify the Change

```bash
git remote -v
```

**Expected to show:**
```
origin  https://github.com/golfphysicsio/golf-weather-api.git (fetch)
origin  https://github.com/golfphysicsio/golf-weather-api.git (push)
```

---

### Step 4: Test with a Small Change (Optional)

To verify it works, you can make a tiny change and push:

```bash
# Make a minor update to verify push works
echo "" >> README.md
git add README.md
git commit -m "chore: Verify git remote URL update"
git push origin main
```

**Expected:** Push should go directly to golfphysicsio/golf-weather-api (no redirect message)

---

## REPORT

When complete, confirm:
- [x] Remote URL updated
- [x] Verified with `git remote -v`
- [x] Test push successful (if you ran Step 4)

That's it! Simple fix completed.
```
