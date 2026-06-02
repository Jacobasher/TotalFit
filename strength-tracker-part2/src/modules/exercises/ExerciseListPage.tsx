import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getExercises } from './ExerciseService';
import { supabase } from '../../core/supabase';
import { Link } from 'react-router-dom';

export default function ExerciseListPage(){
  const userId = supabase.auth.getUser().then(r=>r.data.user?.id).catch(()=>null);
  const { data, isLoading } = useQuery(['exercises'], async ()=>{
    const uid = (await userId) || '';
    const res = await getExercises(uid);
    return res.data || [];
  });

  if(isLoading) return <div>Loading exercises...</div>;

  return (
    <div style={{padding:20}}>
      <h2>Exercises</h2>
      <Link to="/exercises/create">Create Exercise</Link>
      <ul>
        {data.map((e:any)=> (
          <li key={e.id}>{e.name} - <Link to={`/exercises/${e.id}/edit`}>Edit</Link></li>
        ))}
      </ul>
    </div>
  );
}
