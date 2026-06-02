
import { supabase } from '../../core/supabase';
import { Exercise } from '../../shared/types';

export async function createExercise(data:Exercise){
	return supabase.from('exercises').insert(data).select();
}

export async function getExercises(userId:string){
	return supabase.from<Exercise>('exercises').select('*').eq('user_id',userId).order('created_at',{ascending:false});
}

export async function updateExercise(id:string, data:Partial<Exercise>){
	return supabase.from('exercises').update(data).eq('id',id).select();
}

export async function archiveExercise(id:string){
	return supabase.from('exercises').update({ active: false }).eq('id',id).select();
}

