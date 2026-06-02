
import { supabase } from '../../core/supabase';
import { Workout, WorkoutSet, Exercise } from '../../shared/types';

export async function createWorkout(data:Workout){
	return supabase.from('workouts').insert(data).select();
}

export async function logSet(data:WorkoutSet){
	return supabase.from('workout_sets').insert(data).select();
}

export async function getWorkoutSets(workoutId:string){
	return supabase.from<WorkoutSet>('workout_sets').select('*').eq('workout_id',workoutId).order('set_index',{ascending:true});
}

export async function generateWorkoutForToday(userId:string){
	const today = new Date();
	const weekday = today.getDay();
	// fetch active exercises assigned to weekday
	const { data: exercises } = await supabase.from<Exercise>('exercises').select('*').eq('user_id', userId).eq('active', true).eq('day_of_week', weekday);
	// create workout
	const { data: workout } = await supabase.from('workouts').insert({ user_id: userId, date: today.toISOString(), weekday, generated: true }).select().single();
	if(!workout) return null;
	// create workout_sets entries for each exercise
	for(const ex of exercises || []){
		for(let i=0;i<ex.sets;i++){
			await supabase.from('workout_sets').insert({ workout_id: workout.id, exercise_id: ex.id, target_sets: ex.sets, target_reps: ex.current_reps, target_weight: ex.current_weight, set_index: i });
		}
	}
	return workout;
}

