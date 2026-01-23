Perfect! Here's the complete Git workflow you should follow for every new feature.

---

## **🎯 Complete Git Workflow**

---

## **📝 PHASE 1: Starting a New Feature**

### **Step 1: Make Sure You're Up to Date**

```bash
# Go to develop branch
git checkout develop

# Get latest changes from GitHub
git pull

# Verify you're on develop
git branch
# Should show: * develop
```

---

### **Step 2: Create Feature Branch**

```bash
# Create and switch to new branch (one command)
git checkout -b feature/name-of-feature

# Example:
git checkout -b feature/shuffle-playlist

# Verify you're on the new branch
git branch
# Should show: * feature/shuffle-playlist
```

**Branch naming conventions:**
- `feature/` - New features (e.g., `feature/auto-sort`)
- `fix/` - Bug fixes (e.g., `fix/duplicate-tracks`)
- `refactor/` - Code improvements (e.g., `refactor/api-structure`)

---

## **💻 PHASE 2: Making Changes**

### **Step 3: Write Code**

```bash
# Edit your files in VS Code
# Add new features, fix bugs, etc.
```

---

### **Step 4: Check What Changed**

```bash
# See which files changed
git status

# See actual code differences
git diff

# See changes in a specific file
git diff client/src/components/Playlist.tsx
```

---

### **Step 5: Save Your Work (Commit)**

```bash
# Stage all changes
git add .

# OR stage specific files
git add client/src/components/Playlist.tsx
git add client/src/store/playlistStore.ts

# Commit with descriptive message
git commit -m "feat: add shuffle feature to playlist

- Add shuffle button in playlist header
- Implement Fisher-Yates shuffle algorithm
- Maintain current playing track position
- Add visual feedback when shuffle is active"

# Verify commit was created
git log --oneline -1
```

**Commit message format:**
```
<type>: <short description>

<optional detailed explanation>
<optional list of changes>
```

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `refactor:` - Code restructure (no functionality change)
- `docs:` - Documentation only
- `style:` - Formatting, semicolons, etc.
- `test:` - Adding tests
- `chore:` - Maintenance tasks

---

### **Step 6: Push to GitHub (Backup)**

```bash
# First time pushing this branch
git push -u origin feature/shuffle-playlist

# Subsequent pushes (after first time)
git push
```

---

## **🔄 PHASE 3: Continue Working (Multiple Commits)**

### **Step 7: Make More Changes**

```bash
# Edit more files...

# Check what changed
git status

# Commit again
git add .
git commit -m "feat: add shuffle icon and tooltip"

# Push to GitHub
git push
```

**Best practices:**
- ✅ Commit often (logical chunks of work)
- ✅ Each commit should be a complete, working change
- ❌ Don't commit broken code
- ❌ Don't commit huge changes in one commit

---

## **✅ PHASE 4: Feature Complete - Merge Back**

### **Step 8: Finalize and Merge to Develop**

```bash
# Make sure all changes are committed
git status
# Should show: "nothing to commit, working tree clean"

# Switch to develop
git checkout develop

# Update develop with latest from GitHub
git pull

# Merge your feature branch into develop
git merge feature/shuffle-playlist

# Push updated develop to GitHub
git push
```

---

### **Step 9: Clean Up (Optional)**

```bash
# Delete local branch (after merging)
git branch -d feature/shuffle-playlist

# Delete remote branch on GitHub (optional)
git push origin --delete feature/shuffle-playlist
```

---

## **🎨 COMPLETE EXAMPLE: Adding Shuffle Feature**

```bash
# ========== START NEW FEATURE ==========
git checkout develop
git pull
git checkout -b feature/shuffle-playlist

# ========== MAKE CHANGES ==========
# Edit: client/src/components/Playlist.tsx
# Edit: client/src/store/playlistStore.ts

# ========== COMMIT CHANGES ==========
git status
git add .
git commit -m "feat: add shuffle functionality

- Add shuffle button to playlist header
- Implement shuffle logic in store
- Maintain currently playing track"

git push -u origin feature/shuffle-playlist

# ========== MAKE MORE CHANGES ==========
# Edit: client/src/components/Playlist.tsx (add icon)

git add .
git commit -m "feat: add shuffle icon and visual feedback"
git push

# ========== TEST & FIX BUGS ==========
# Find a bug, fix it

git add .
git commit -m "fix: shuffle maintains correct track positions"
git push

# ========== MERGE TO DEVELOP ==========
git checkout develop
git pull
git merge feature/shuffle-playlist
git push

# ========== CLEANUP ==========
git branch -d feature/shuffle-playlist
git push origin --delete feature/shuffle-playlist
```

---

## **🚨 Common Scenarios**

### **Scenario 1: Made Changes But Want to Switch Branches**

```bash
# Option A: Commit your changes first
git add .
git commit -m "wip: work in progress on feature"
git checkout other-branch

# Option B: Stash changes temporarily
git stash
git checkout other-branch
# Later, come back:
git checkout feature/shuffle-playlist
git stash pop
```

---

### **Scenario 2: Made a Mistake in Last Commit**

```bash
# Fix the files, then:
git add .
git commit --amend -m "feat: corrected commit message"

# If already pushed:
git push --force  # ⚠️ Only if you're the only one working on this branch!
```

---

### **Scenario 3: Want to Undo Changes (Before Commit)**

```bash
# Undo changes to a specific file
git checkout -- client/src/components/Playlist.tsx

# Undo ALL uncommitted changes (⚠️ CAREFUL!)
git reset --hard
```

---

### **Scenario 4: Forgot to Create Branch**

```bash
# If you made changes on develop by accident:
git stash                                    # Save your changes
git checkout -b feature/new-feature          # Create proper branch
git stash pop                                # Restore changes
git add .
git commit -m "feat: my feature"
```

---

## **📊 Useful Commands Reference**

### **Checking Status**
```bash
git status                    # What changed?
git log --oneline -5          # Last 5 commits
git branch                    # List branches (* = current)
git diff                      # What changed in files?
git show HEAD                 # Show last commit details
```

### **Branch Management**
```bash
git branch                              # List local branches
git branch -a                           # List all branches (local + remote)
git branch -d feature/old-feature       # Delete local branch
git push origin --delete feature/old    # Delete remote branch
```

### **Syncing**
```bash
git pull                      # Get latest from GitHub
git push                      # Send commits to GitHub
git fetch                     # Check for updates (doesn't merge)
```

---

## **✅ Your Workflow Checklist**

For **every new feature**, follow this checklist:

```
□ Switch to develop: git checkout develop
□ Update develop: git pull
□ Create feature branch: git checkout -b feature/my-feature
□ Make changes in code
□ Check changes: git status
□ Stage changes: git add .
□ Commit: git commit -m "feat: description"
□ Push to GitHub: git push -u origin feature/my-feature
□ Continue coding (repeat stage/commit/push as needed)
□ When done: git checkout develop
□ Update develop: git pull
□ Merge: git merge feature/my-feature
□ Push develop: git push
□ Delete branch: git branch -d feature/my-feature
```

---

## **🎯 Quick Reference Card**

**Starting:**
```bash
git checkout develop
git pull
git checkout -b feature/name
```

**Working:**
```bash
git add .
git commit -m "type: description"
git push
```

**Finishing:**
```bash
git checkout develop
git pull
git merge feature/name
git push
git branch -d feature/name
```

---

Save this workflow and follow it every time! It will keep your work organized and safe. 🎉