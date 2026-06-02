import React, { useEffect, useState } from 'react';
import { generateWorkoutForToday, getWorkoutSets, logSet } from './WorkoutService';
import { supabase } from '../../core/supabase';
import { shouldProgress, computeNext, applyProgression } from '../progression/ProgressionEngine';

export default function WorkoutPage(){
  const [workout, setWorkout] = useState<any>(null);
  const [sets, setSets] = useState<any[]>([]);

  useEffect(()=>{
    (async ()=>{
      const user = await supabase.auth.getUser();
      const uid = user.data.user?.id;
      if(!uid) return;
      const w = await generateWorkoutForToday(uid);
      setWorkout(w);
      if(w?.id){
        const res = await getWorkoutSets(w.id);
        setSets(res.data || []);
      }
    })();
  },[]);

  async function onLog(setId:string, val:number){
    // persist immediate
    const s = sets.find((s:any)=>s.id===setId);
    await logSet({ workout_id: workout.id, exercise_id: s.exercise_id, target_sets: s.target_sets, target_reps: s.target_reps, target_weight: s.target_weight, set_index: s.set_index, actual_reps: val });
    // refresh
    const res = await getWorkoutSets(workout.id);
    setSets(res.data || []);
  }

  async function completeWorkout(){
    // for each exercise, gather sets and determine progression
    const exercisesMap: Record<string, any[]> = {};
    for(const s of sets){
      exercisesMap[s.exercise_id] = exercisesMap[s.exercise_id] || [];
      exercisesMap[s.exercise_id].push(s);
    }

    const { data: user } = await supabase.auth.getUser();
    const uid = user?.user?.id;
    if(!uid) return;

    for(const exId of Object.keys(exercisesMap)){
      const setsForEx = exercisesMap[exId];
      const successful = setsForEx.filter((x:any)=> (x.actual_reps || 0) >= x.target_reps).length;
      // fetch exercise details
      const { data: exRows } = await supabase.from('exercises').select('*').eq('id', exId).single();
      const ex = exRows as any;
      if(!ex) continue;
      if(shouldProgress(successful, ex.minimum_successful_sets)){
        const next = computeNext(ex);
        await applyProgression(uid, exId, ex.current_reps, ex.current_weight, next.to_reps, next.to_weight, 'auto_workout');
      }
    }
  }

  async function overloadExtraAll(){
    const { data: user } = await supabase.auth.getUser();
    const uid = user?.user?.id;
    if(!uid) return;
    const processed = new Set<string>();
    for(const s of sets){
      if(processed.has(s.exercise_id)) continue;
      processed.add(s.exercise_id);
      try{ await (await import('../progression/ProgressionEngine')).applyOverloadExtra(uid, s.exercise_id); }catch(e){ }
    }
    // refresh exercises
    const res = await getWorkoutSets(workout.id);
    setSets(res.data || []);
  }

  async function deloadAll(percent:number){
    const { data: user } = await supabase.auth.getUser();
    const uid = user?.user?.id;
    if(!uid) return;
    const processed = new Set<string>();
    for(const s of sets){
      if(processed.has(s.exercise_id)) continue;
      processed.add(s.exercise_id);
      try{ await (await import('../progression/ProgressionEngine')).applyDeload(uid, s.exercise_id, percent); }catch(e){ }
    }
    const res = await getWorkoutSets(workout.id);
    setSets(res.data || []);
  }

  if(!workout) return <div>Generating workout...</div>;

  return (
    <div style={{padding:20}}>
      <h2>Today's Workout</h2>
      <ul>
        {sets.map(s=> (
          <li key={s.id}>{s.exercise_id} - target {s.target_reps} reps @ {s.target_weight}
            <div>
              <input type="number" placeholder="reps" onBlur={e=> onLog(s.id, Number(e.currentTarget.value))} />
            </div>
          </li>
        ))}
      </ul>
      <div>
        <button onClick={completeWorkout}>Complete Workout</button>
        <button onClick={overloadExtraAll} style={{marginLeft:10}}>Overload Extra</button>
        <button onClick={()=>deloadAll(5)} style={{marginLeft:10}}>Deload 5%</button>
        <button onClick={()=>deloadAll(10)} style={{marginLeft:10}}>Deload 10%</button>
      </div>
    </div>
  );
}
