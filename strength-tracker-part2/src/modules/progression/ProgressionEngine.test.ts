import { describe, it, expect } from 'vitest';
import { shouldProgress, computeNext } from './ProgressionEngine';

describe('ProgressionEngine', () => {
  it('correctly determines success when successful sets meet requirement', () => {
    expect(shouldProgress(3, 3)).toBe(true);
    expect(shouldProgress(2, 3)).toBe(false);
  });

  it('computes next reps then weight progression until max reps then increases weight', () => {
    const exercise = {
      current_reps: 8,
      current_weight: 135,
      max_reps: 12,
      weight_increment: 5,
      progression_type: 'reps_then_weight',
    };
    expect(computeNext(exercise as any)).toEqual({ to_reps: 9, to_weight: 135 });

    const maxed = { ...exercise, current_reps: 12 };
    expect(computeNext(maxed as any)).toEqual({ to_reps: 8, to_weight: 140 });
  });

  it('computes weight only and reps only progressions', () => {
    const weightOnly = { current_reps: 8, current_weight: 135, max_reps: 12, weight_increment: 5, progression_type: 'weight_only' };
    expect(computeNext(weightOnly as any)).toEqual({ to_reps: 8, to_weight: 140 });

    const repsOnly = { current_reps: 8, current_weight: 135, max_reps: 12, weight_increment: 5, progression_type: 'reps_only' };
    expect(computeNext(repsOnly as any)).toEqual({ to_reps: 9, to_weight: 135 });
  });
});
