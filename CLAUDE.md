# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Galac6 Parent — React Native/Expo mobile app. Parent companion for the Galac6 AI EdTech platform.

## Commands

```bash
npx expo start              # Start dev server (scan QR with Expo Go)
npx expo start --web        # Run in browser
npx expo start --clear      # Clear cache and restart
npx tsc --noEmit            # Type check
npx expo export --platform web  # Build for web
```

## Architecture

- **Framework:** Expo SDK 54 with Expo Router (file-based routing)
- **Language:** TypeScript strict mode
- **State:** Zustand stores (no Redux, no Context providers)
- **Styling:** React Native StyleSheet (not NativeWind — had compatibility issues)
- **AI:** Claude API via direct fetch (services/claude.ts)
- **Data:** Mock data in constants/mockActivities.ts — mirrors real Galac6 activity types

## Key Patterns

- All screens in `app/(tabs)/` — Expo Router file-based routing
- Stores in `stores/` — Zustand with no middleware
- Colors and subjects in `constants/` — Galac6 brand palette (#7C3AED primary)
- French language throughout UI — this is a French EdTech app
- Mock data uses realistic Galac6 activity types: quiz, dictee, chat, exercice, fiche, brevet_blanc, calcul_mental, lecture
