Plateau detection module added:

Files added:
- strength-tracker-part2/src/modules/plateau/PlateauService.ts
- strength-tracker-part2/src/modules/plateau/PlateauPage.tsx
- strength-tracker-part2/src/modules/plateau/index.tsx

Behavior:
- Detects exercises that appeared in the last 5 generated workouts but have no progression history entries since the earliest of those workouts.
- Flags those exercises as possible plateaus and suggests deloading or nutrition adjustments.

Next steps:
- Add automatic Notifications creation when plateau detected.
- Improve detection (track workouts-per-exercise, allow custom thresholds per exercise).
