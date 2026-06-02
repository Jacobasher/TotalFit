import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getExercises, updateExercise } from './ExerciseService';
import { supabase } from '../../core/supabase';

export default function ExerciseEditPage(){
  const { id } = useParams();
  const nav = useNavigate();
  const [item,setItem] = useState<any>(null);

  useEffect(()=>{
    let mounted = true;
    (async ()=>{
      const user = await supabase.auth.getUser();
      const uid = user.data.user?.id || '';
      const res = await getExercises(uid);
      if(!mounted) return;
      const found = res.data?.find((x:any)=> x.id === id);
      setItem(found);
    })();
    return ()=>{ mounted = false };
  },[id]);

  if(!item) return <div>Loading...</div>;

  async function save(e:React.FormEvent){
    e.preventDefault();
    await updateExercise(item.id, { name: item.name });
    nav('/exercises');
  }

  return (
    <div style={{padding:20}}>
      <h2>Edit Exercise</h2>
      <form onSubmit={save}>
        <div>
          <label>Name</label>
          <input value={item.name} onChange={e=>setItem({...item, name: e.target.value})} />
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
}
