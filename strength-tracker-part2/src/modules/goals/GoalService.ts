import { supabase } from '../../core/supabase';

export async function setGoal(data:any){
  return supabase.from('goals').upsert(data).select();
}

export async function getGoals(userId:string){
  return supabase.from('goals').select('*').eq('user_id',userId);
}
