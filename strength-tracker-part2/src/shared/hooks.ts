import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../core/supabase';
import * as Exercises from '../modules/exercises/ExerciseService';
import * as Workouts from '../modules/workouts/WorkoutService';

export function useExercises(){
  return useQuery(['exercises'], async ()=>{
    const { data: user } = await supabase.auth.getUser();
    const uid = user?.user?.id || '';
    const res = await Exercises.getExercises(uid);
    return res.data || [];
  });
}

export function useCreateExercise(){
  const qc = useQueryClient();
  return useMutation(async (data:any)=> Exercises.createExercise(data), { onSuccess: ()=> qc.invalidateQueries(['exercises']) });
}

export function useGenerateWorkout(){
  const qc = useQueryClient();
  return useMutation(async ()=>{
    const { data: user } = await supabase.auth.getUser();
    const uid = user?.user?.id || '';
    return Workouts.generateWorkoutForToday(uid);
  }, { onSuccess: ()=> qc.invalidateQueries(['workout']) });
}
