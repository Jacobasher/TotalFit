import { supabase } from '../../core/supabase';

export async function computeAdherence(userId:string, weeks:number){
  // scheduled: count of active exercises per week * weeks
  const { data: exercises } = await supabase.from('exercises').select('id,day_of_week,active').eq('user_id',userId).eq('active',true);
  const scheduledPerWeek = Array.from(new Set((exercises||[]).map((e:any)=> e.day_of_week))).length;
  const scheduled = scheduledPerWeek * weeks;

  const since = new Date(); since.setDate(since.getDate() - weeks*7);
  const { data: completed } = await supabase.from('workouts').select('id').eq('user_id',userId).gte('date', since.toISOString());
  const completedCount = (completed || []).length;
  const percent = scheduled === 0 ? 0 : Math.round((completedCount / scheduled) * 100);
  return { completed: completedCount, scheduled, percent };
}
