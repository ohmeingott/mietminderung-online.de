# CLAUDE.md - Project Configuration

## Project Overview
Mietminderung-online.de - A Next.js web application for calculating rent reductions (Mietminderung) in Germany.

## Tech Stack
- Next.js 16 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS 4
- lucide-react (icons)
- signature_pad

## Commands
- `npm run dev` - Start dev server
- `npm run build` - Production build
- `npm run lint` - ESLint
- `npm start` - Start production server

## Allowed Tool Permissions
```
allowedTools:
  - Bash(npm run dev)
  - Bash(npm run dev:*)
  - Bash(npm run build)
  - Bash(npm run build:*)
  - Bash(npm run lint)
  - Bash(npm run lint:*)
  - Bash(npm start)
  - Bash(npm start:*)
  - Bash(npm install:*)
  - Bash(npm install)
  - Bash(npx next:*)
  - Bash(npx tsc:*)
  - Bash(git status:*)
  - Bash(git add:*)
  - Bash(git commit:*)
  - Bash(git push:*)
  - Bash(git pull:*)
  - Bash(git stash:*)
  - Bash(git diff:*)
  - Bash(git log:*)
  - Bash(git branch:*)
  - Bash(git checkout:*)
  - Bash(git merge:*)
  - Bash(git remote:*)
  - Bash(git fetch:*)
  - Bash(git rebase:*)
  - Bash(git cherry-pick:*)
  - Bash(git tag:*)
  - Bash(git show:*)
  - Bash(git rev-parse:*)
  - Bash(ls:*)
  - Bash(cat:*)
  - Bash(find:*)
  - Bash(grep:*)
  - Bash(wc:*)
  - Bash(echo:*)
  - Bash(node -e:*)
  - Bash(open http://localhost:*)
  - Bash(curl:*)
  - Bash(lsof:*)
  - Bash(kill:*)
  - Bash(pkill:*)
  - Bash(xargs:*)
  - Bash(python3:*)
  - Bash(gh:*)
  - Bash(mkdir:*)
  - Bash(cp:*)
  - Bash(mv:*)
  - Bash(rm:*)
  - Bash(touch:*)
  - Bash(chmod:*)
  - Bash(head:*)
  - Bash(tail:*)
  - Bash(sort:*)
  - Bash(uniq:*)
  - Bash(sed:*)
  - Bash(awk:*)
  - Bash(which:*)
  - Bash(env:*)
  - Bash(export:*)
  - Bash(npx tailwindcss:*)
```

## Project Structure
```
src/
  app/
    page.tsx        - Main page
    layout.tsx      - Root layout
    globals.css     - Global styles
  components/
    Header.tsx      - Navigation header
    Hero.tsx        - Hero section
    HowItWorks.tsx  - "How it works" section
    MietminderungCheck.tsx - Main rent reduction calculator
  data/
    maengel.ts      - Defect/issue data for rent reduction
```

## Language
- UI and content: German
- Code: English (variable names, comments)
