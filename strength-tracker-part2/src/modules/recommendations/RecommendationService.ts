import { supabase } from '../../core/supabase';
import { createNotification } from '../notifications/NotificationService';

async function getLatestBodyweight(userId:string){
  const { data } = await supabase.from('bodyweight').select('body_weight,date').eq('user_id',userId).order('date',{ascending:false}).limit(1);
  return data?.[0];
}

async function getNutritionToday(userId:string){
  const today = new Date().toISOString().slice(0,10);
  const { data } = await supabase.from('nutrition').select('*').eq('user_id',userId).eq('date',today).limit(1);
  return data?.[0];
}

async function getStrengthTrend(userId:string, weeks=4){
  const { data } = await supabase.from('strength_score_history').select('score,date').eq('user_id',userId).order('date',{ascending:true}).limit(weeks);
  return data || [];
}

function weeklyPercentChange(start:number,end:number,days:number){
  if(!start) return 0;
  const raw = (end - start) / start;
  return raw * (7 / days) * 100;
}

export async function proteinRecommendation(userId:string){
  const bw = await getLatestBodyweight(userId);
  if(!bw) return null;
  const weight = Number(bw.body_weight);
  const target = Math.round(0.8 * weight);
  const todayNutrition = await getNutritionToday(userId);
  const currentProtein = todayNutrition?.protein || 0;
  if(currentProtein < target){
    const note = { type: 'protein_warning', message: `Increase protein intake to ${target}g (current ${currentProtein}g)` };
    try{ await createNotification({ user_id: userId, ...note, read:false }); }catch(e){}
    return note;
  }
  return { type: 'protein_ok', message: `Protein target met (${currentProtein}g / ${target}g)` };
}

export async function calorieRecommendation(userId:string){
  // analyze weight trend over last 21 days
  const { data: wdata } = await supabase.from('bodyweight').select('body_weight,date').eq('user_id',userId).order('date',{ascending:true}).limit(21);
  const rows = wdata || [];
  if(rows.length < 2) return { type: 'insufficient_data', message: 'Not enough weight data' };
  const start = Number(rows[0].body_weight);
  const end = Number(rows[rows.length-1].body_weight);
  const days = (new Date(rows[rows.length-1].date).getTime() - new Date(rows[0].date).getTime()) / (1000*60*60*24) || 1;
  const weeklyPct = weeklyPercentChange(start,end,days);

  // strength trend
  const strength = await getStrengthTrend(userId, 4);
  const strStart = strength[0]?.score || 0;
  const strEnd = strength[strength.length-1]?.score || 0;
  const strengthIncreasing = strEnd > strStart;
  const strengthDeclining = strEnd < strStart;

  // check goal
  const { data: goals } = await supabase.from('goals').select('*').eq('user_id',userId).limit(1);
  const goal = goals?.[0];
  const currentWeight = end;
  const cutting = goal && goal.goal_weight < currentWeight;

  // aggressive cut detection
  if(weeklyPct <= -1 && strengthDeclining){
    const note = { type: 'aggressive_cut', message: 'Weight loss >1%/week and strength declining — aggressive cut warning' };
    try{ await createNotification({ user_id: userId, ...note, read:false }); }catch(e){}
    return note;
  }

  // if weight stable (+/-1%) and strength increasing => recomp
  if(Math.abs(weeklyPct) <= 1 && strengthIncreasing){
    const note = { type: 'recomp', message: 'Weight stable and strength increasing — likely recomp. Avoid calorie reduction.' };
    try{ await createNotification({ user_id: userId, ...note, read:false }); }catch(e){}
    return note;
  }

  // if cutting and weight stagnant for ~3 weeks -> suggest decreasing calories further
  if(cutting){
    // weight change over 21 days
    const pct21 = ((rows[0].body_weight - rows[rows.length-1].body_weight) / rows[0].body_weight) * 100;
    if(Math.abs(pct21) < 0.5){
        const note = { type: 'stalled_cut', message: 'Weight stagnated for ~3 weeks during cut — consider reducing calories further.' };
        try{ await createNotification({ user_id: userId, ...note, read:false }); }catch(e){}
        return note;
    }
  }

  // if losing faster than 1%/week -> suggest increasing calories
  if(weeklyPct <= -1){
    const note = { type: 'increase_calories', message: 'Losing weight faster than 1%/week — consider increasing calories to preserve strength.' };
    try{ await createNotification({ user_id: userId, ...note, read:false }); }catch(e){}
    return note;
  }

  return { type: 'no_change', message: 'No calorie adjustments recommended.' };
}
