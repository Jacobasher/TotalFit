import React, { useEffect, useState } from 'react';
import { supabase } from '../../core/supabase';
import { logWeighIn, getRecentWeighIns } from './BodyweightService';

function rollingAverage(values:number[], days=7){
  if(values.length===0) return 0;
  const slice = values.slice(0, days);
  const sum = slice.reduce((a,b)=>a+b,0);
  return sum / slice.length;
}

export default function BodyweightPage(){
  const [weight,setWeight] = useState(0);
  const [avg,setAvg] = useState(0);

  useEffect(()=>{
    (async ()=>{
      const user = await supabase.auth.getUser();
      const uid = user.data.user?.id;
      if(!uid) return;
      const res = await getRecentWeighIns(uid, 14);
      const vals = (res.data || []).map((r:any)=> Number(r.body_weight));
      setAvg(rollingAverage(vals,7));
    })();
  },[]);

  async function save(e:React.FormEvent){
    e.preventDefault();
    const user = await supabase.auth.getUser();
    const uid = user.data.user?.id;
    if(!uid) return;
    const today = new Date().toISOString().slice(0,10);
    await logWeighIn({ user_id: uid, date: today, body_weight: weight });
  }

  return (
    <div style={{padding:20}}>
      <h2>Bodyweight</h2>
      <form onSubmit={save}>
        <div><label>Weight</label><input type="number" value={weight} onChange={e=>setWeight(Number(e.target.value))} /></div>
        <button type="submit">Log</button>
      </form>
      <div>7-day rolling average: {avg.toFixed(2)}</div>
    </div>
  );
}
