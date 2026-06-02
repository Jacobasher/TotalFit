import { supabase } from '../../core/supabase';

export async function logWeighIn(data:any){
  return supabase.from('bodyweight').insert(data).select();
}

export async function getRecentWeighIns(userId:string, limit=14){
  return supabase.from('bodyweight').select('*').eq('user_id',userId).order('date',{ascending:false}).limit(limit);
}
