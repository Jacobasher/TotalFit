import { supabase } from '../../core/supabase';

function epley(weight:number,reps:number){
  return weight * (1 + reps/30);
}

export function estimate1RM(weight:number,reps:number){
  return epley(weight,reps);
}

export function computeStrengthScore(parts:{bench?:number,squat?:number,deadlift?:number,ohp?:number,pullup?:number}){
  const bench = parts.bench || 0;
  const squat = parts.squat || 0;
  const deadlift = parts.deadlift || 0;
  const ohp = (parts.ohp || 0) * 0.7;
  const pullup = (parts.pullup || 0) * 0.8;
  return bench + squat + deadlift + ohp + pullup;
}

export async function snapshotWeekly(userId:string, values:any){
  return supabase.from('strength_score_history').insert({ user_id: userId, ...values }).select();
}
