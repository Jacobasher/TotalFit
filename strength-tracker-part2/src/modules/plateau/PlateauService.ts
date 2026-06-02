import { supabase } from '../../core/supabase';
import { createNotification } from '../notifications/NotificationService';

export async function detectPlateaus(userId:string){
  // get last 5 generated workouts
  const { data: workouts } = await supabase.from('workouts').select('id,date').eq('user_id',userId).eq('generated',true).order('date',{ascending:false}).limit(5);
  if(!workouts || workouts.length===0) return [];
  const earliest = workouts[workouts.length-1].date;

  // find exercises that appeared in those workouts
  const workoutIds = workouts.map((w:any)=> w.id);
  const { data: sets } = await supabase.from('workout_sets').select('exercise_id,workout_id').in('workout_id', workoutIds);
  const exerciseIds = Array.from(new Set((sets||[]).map((s:any)=> s.exercise_id)));

  const plateaus:any[] = [];
  for(const exId of exerciseIds){
    // check if there's any progression_history entry for this exercise after earliest workout
    const { data: prog } = await supabase.from('progression_history').select('id,created_at').eq('exercise_id',exId).gt('created_at', earliest).limit(1);
    if(!prog || prog.length===0){
      plateaus.push({ exercise_id: exId });
      // create a notification for plateau
      try{
        await createNotification({ user_id: userId, type: 'plateau_warning', message: `Exercise ${exId} may be plateaued`, read: false });
      }catch(e){ /* ignore */ }
    }
  }
  return plateaus;
}
