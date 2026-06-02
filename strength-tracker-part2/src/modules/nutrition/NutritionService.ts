import { supabase } from '../../core/supabase';

export async function logNutrition(data:any){
  return supabase.from('nutrition').insert(data).select();
}

export async function getTodayNutrition(userId:string, date:string){
  return supabase.from('nutrition').select('*').eq('user_id',userId).eq('date',date).limit(1);
}
