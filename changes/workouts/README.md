Workout module changes:

Files created/updated:
- strength-tracker-part2/src/modules/workouts/WorkoutService.ts (generateWorkoutForToday, typed functions)
- strength-tracker-part2/src/modules/workouts/WorkoutPage.tsx
- strength-tracker-part2/src/modules/workouts/index.tsx

Purpose:
- Generate today's workout from active exercises for the weekday and persist workout and sets.
- Immediate logging of sets to `workout_sets`.

Next steps:
- Improve workout UI, show exercise names, support editing sets, and tie to progression engine.
