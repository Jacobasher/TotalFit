import { supabase } from '../../core/supabase';

export async function createNotification(data:any){
  return supabase.from('notifications').insert(data).select();
}

export async function getNotifications(userId:string){
  return supabase.from('notifications').select('*').eq('user_id',userId).order('created_at',{ascending:false});
}

export async function markRead(id:string){
  return supabase.from('notifications').update({ read: true }).eq('id', id).select();
}
