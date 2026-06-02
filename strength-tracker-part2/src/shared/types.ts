export type StrengthCategory = 'bench'|'squat'|'deadlift'|'ohp'|'pullup'|'none';

export interface Exercise {
  id?: string;
  user_id: string;
  name: string;
  day_of_week: number; // 0-6
  sets: number;
  current_reps: number;
  current_weight: number;
  max_reps: number;
  weight_increment: number;
  progression_type: 'reps_then_weight'|'weight_only'|'reps_only';
  minimum_successful_sets: number;
  active: boolean;
  strength_category: StrengthCategory;
  created_at?: string;
}

export interface Workout {
  id?: string;
  user_id: string;
  date: string; // ISO
  weekday: number;
  generated: boolean;
}

export interface WorkoutSet {
  id?: string;
  workout_id: string;
  exercise_id: string;
  target_reps: number;
  target_sets: number;
  target_weight: number;
  set_index: number;
  actual_reps?: number;
  created_at?: string;
}

export interface ProgressionHistoryEntry {
  id?: string;
  user_id: string;
  exercise_id: string;
  from_reps: number;
  from_weight: number;
  to_reps: number;
  to_weight: number;
  reason: string;
  created_at?: string;
}
