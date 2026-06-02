
import { supabase } from '../../core/supabase';
import { Exercise, ProgressionHistoryEntry } from '../../shared/types';

export function shouldProgress(successfulSets:number, required:number){
	return successfulSets >= required;
}

export function computeNext(ex:Exercise){
	// returns { to_reps, to_weight }
	const max = ex.max_reps;
	const curReps = ex.current_reps;
	const curWeight = ex.current_weight;

	if(ex.progression_type === 'reps_then_weight'){
		if(curReps < max) return { to_reps: curReps + 1, to_weight: curWeight };
		// reach max reps -> reset reps and increase weight
		return { to_reps: ex.current_reps === max ? Math.max(8, ex.current_reps === max ? 8 : ex.current_reps) : 8, to_weight: curWeight + ex.weight_increment };
	}
	if(ex.progression_type === 'weight_only'){
		return { to_reps: curReps, to_weight: curWeight + ex.weight_increment };
	}
	// reps_only
	return { to_reps: Math.min(max, curReps + 1), to_weight: curWeight };
}

export async function applyProgression(userId:string, exerciseId:string, fromReps:number, fromWeight:number, toReps:number, toWeight:number, reason='auto'){
	// create progression history entry and update exercise
	const entry:ProgressionHistoryEntry = { user_id: userId, exercise_id: exerciseId, from_reps: fromReps, from_weight: fromWeight, to_reps: toReps, to_weight: toWeight, reason } as any;
	await supabase.from('progression_history').insert(entry);
	await supabase.from('exercises').update({ current_reps: toReps, current_weight: toWeight }).eq('id', exerciseId);
}

export async function applyOverloadExtra(userId:string, exerciseId:string){
	// apply one extra progression step based on current exercise values
	const { data: exRows } = await supabase.from('exercises').select('*').eq('id', exerciseId).single();
	const ex = exRows as Exercise;
	if(!ex) return;
	const next = computeNext(ex);
	await applyProgression(userId, exerciseId, ex.current_reps, ex.current_weight, next.to_reps, next.to_weight, 'overload_extra');
}

export async function applyDeload(userId:string, exerciseId:string, percent:number){
	// reduce weight by percent
	const { data: exRows } = await supabase.from('exercises').select('*').eq('id', exerciseId).single();
	const ex = exRows as Exercise;
	if(!ex) return;
	const newWeight = Math.max(0, Math.round(ex.current_weight * (1 - percent / 100)));
	const entry:ProgressionHistoryEntry = { user_id: userId, exercise_id: exerciseId, from_reps: ex.current_reps, from_weight: ex.current_weight, to_reps: ex.current_reps, to_weight: newWeight, reason: `deload_${percent}%` } as any;
	await supabase.from('progression_history').insert(entry);
	await supabase.from('exercises').update({ current_weight: newWeight }).eq('id', exerciseId);
}

