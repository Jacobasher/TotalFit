import React, { useState, useEffect } from 'react';
import { supabase } from '../../core/supabase';
import { setGoal, getGoals } from './GoalService';

function epley(weight:number, reps:number){
  return weight * (1 + reps/30);
}

export default function GoalPage(){
  const [weight,setWeight] = useState(0);
  const [reps,setReps] = useState(8);
  const [sets,setSets] = useState(3);
  const [message,setMessage] = useState('');

  useEffect(()=>{
    (async ()=>{
      const user = await supabase.auth.getUser();
      const uid = user.data.user?.id;
      if(!uid) return;
      const res = await getGoals(uid);
      if(res.data?.[0]){
        const g = res.data[0];
        setWeight(g.goal_weight || 0);
        setReps(g.goal_reps || 8);
        setSets(g.goal_sets || 3);
      }
    })();
  },[]);

  async function save(e:React.FormEvent){
    e.preventDefault();
    const user = await supabase.auth.getUser();
    const uid = user.data.user?.id;
    if(!uid) return;
    await setGoal({ user_id: uid, goal_weight: weight, goal_reps: reps, goal_sets: sets });
    setMessage('Saved');
  }

  const goal1rm = epley(weight, reps);

  return (
    <div style={{padding:20}}>
      <h2>Goal</h2>
      <form onSubmit={save}>
        <div>
          <label>Weight</label>
          <input type="number" value={weight} onChange={e=>setWeight(Number(e.target.value))} />
        </div>
        <div>
          <label>Reps</label>
          <input type="number" value={reps} onChange={e=>setReps(Number(e.target.value))} />
        </div>
        <div>
          <label>Sets</label>
          <input type="number" value={sets} onChange={e=>setSets(Number(e.target.value))} />
        </div>
        <button type="submit">Save Goal</button>
      </form>
      <div>Goal 1RM estimate: {goal1rm.toFixed(1)}</div>
      {message && <div>{message}</div>}
    </div>
  );
}
