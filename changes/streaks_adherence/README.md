Streaks & Adherence updates:

- Implemented `getStreaks` that computes weekly streaks based on scheduled active exercise weekdays and completed workouts.
- Implemented `computeAdherence` to calculate completed/scheduled percentages over a specified window (4 and 12 week use cases).
- Files changed:
  - strength-tracker-part2/src/modules/streaks/StreaksService.ts
  - strength-tracker-part2/src/modules/adherence/AdherenceService.ts

Next: Add unit tests and edge case handling (zero scheduled days, timezone handling), and dashboard cards.
