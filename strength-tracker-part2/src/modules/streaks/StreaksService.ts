import { supabase } from '../../core/supabase';

function weekStart(d:Date){ const c = new Date(d); c.setHours(0,0,0,0); c.setDate(c.getDate() - c.getDay()); return c; }

export async function getWorkoutCounts(userId:string, weeks=12){
  // compute scheduled workouts per week from exercises' active day_of_week
  const { data: exercises } = await supabase.from('exercises').select('id,day_of_week,active').eq('user_id',userId).eq('active',true);
  const scheduledPerWeek = (exercises || []).length ? new Set((exercises||[]).map((e:any)=> e.day_of_week)).size : 0;

  // completed workouts from workouts table
  const since = new Date(); since.setDate(since.getDate() - weeks*7);
  const { data: completed } = await supabase.from('workouts').select('date').eq('user_id',userId).gte('date', since.toISOString());
  const completedCount = (completed || []).length;

  return { scheduled: scheduledPerWeek * weeks, completed: completedCount };
}

export async function getStreaks(userId:string){
  // compute weekly adherence and derive streaks
  const { data: exercises } = await supabase.from('exercises').select('id,day_of_week,active').eq('user_id',userId).eq('active',true);
  const scheduledDays = Array.from(new Set((exercises||[]).map((e:any)=> e.day_of_week)));
  const scheduledPerWeek = scheduledDays.length;

  // load generated workouts for last 52 weeks
  const since = new Date(); since.setDate(since.getDate() - 52*7);
  const { data: workouts } = await supabase.from('workouts').select('date').eq('user_id',userId).gte('date', since.toISOString()).order('date',{ascending:false});
  const workoutDates = (workouts||[]).map((w:any)=> new Date(w.date));

  // bucket by week
  const weeks: { start:Date, completed:number, scheduled:number }[] = [];
  const today = new Date();
  for(let i=0;i<52;i++){
    const end = new Date(); end.setDate(today.getDate() - i*7);
    const start = weekStart(end);
    const endIso = new Date(start); endIso.setDate(start.getDate()+6);
    const completed = workoutDates.filter(d=> d >= start && d <= endIso).length;
    const scheduled = scheduledPerWeek;
    weeks.push({ start, completed, scheduled });
  }

  // compute streaks where completed/scheduled >= 0.75
  let current = 0; let longest = 0; let running = 0;
  for(const w of weeks){
    const ratio = w.scheduled === 0 ? 0 : (w.completed / w.scheduled);
    if(ratio >= 0.75){ running++; current = (current === 0 ? running : current + 1); }
    else { longest = Math.max(longest, running); running = 0; }
  }
  longest = Math.max(longest, running);

  return { current_streak: current, longest_streak: longest };
}
