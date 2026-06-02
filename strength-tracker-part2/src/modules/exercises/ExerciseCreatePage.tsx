import React, { useState } from 'react';
import { createExercise } from './ExerciseService';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../core/supabase';

export default function ExerciseCreatePage(){
  const nav = useNavigate();
  const [name,setName] = useState('');

  async function submit(e:React.FormEvent){
    e.preventDefault();
    const user = await supabase.auth.getUser();
    const uid = user.data.user?.id;
    if(!uid) return;
    await createExercise({ user_id: uid, name, day_of_week:0, sets:3, current_reps:8, current_weight:45, max_reps:12, weight_increment:5, progression_type:'reps_then_weight', minimum_successful_sets:3, active:true, strength_category: 'none' });
    nav('/exercises');
  }

  return (
    <div style={{padding:20}}>
      <h2>Create Exercise</h2>
      <form onSubmit={submit}>
        <div>
          <label>Name</label>
          <input value={name} onChange={e=>setName(e.target.value)} />
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  );
}
