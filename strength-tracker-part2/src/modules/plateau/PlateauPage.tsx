import React, { useEffect, useState } from 'react';
import { detectPlateaus } from './PlateauService';
import { supabase } from '../../core/supabase';

export default function PlateauPage(){
  const [items,setItems] = useState<any[]>([]);

  useEffect(()=>{
    (async ()=>{
      const user = await supabase.auth.getUser();
      const uid = user.data.user?.id;
      if(!uid) return;
      const p = await detectPlateaus(uid);
      setItems(p);
    })();
  },[]);

  return (
    <div style={{padding:20}}>
      <h2>Possible Plateaus</h2>
      {items.length===0 && <div>No plateaus detected for recent workouts.</div>}
      <ul>
        {items.map(i=> (
          <li key={i.exercise_id}>Exercise {i.exercise_id} may be plateaued — consider deloading or adjusting nutrition.</li>
        ))}
      </ul>
    </div>
  );
}
