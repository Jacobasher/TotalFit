Progression engine changes:

Files updated/added:
- strength-tracker-part2/src/modules/progression/ProgressionEngine.ts (computeNext, applyProgression, history insertion)
- strength-tracker-part2/src/modules/progression/index.tsx

Purpose:
- Deterministic progression computation for reps/weight based on progression type.
- Apply progression and store history entries in `progression_history`.

Next steps:
- Add overload extra, deload options, and tie into workout completion flow.
