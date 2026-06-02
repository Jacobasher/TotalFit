import React, { useEffect, useState } from 'react';
import { computeAdherence } from './AdherenceService';
import { supabase } from '../../core/supabase';

export default function AdherencePage(){
  const [data,setData] = useState<any>(null);
  useEffect(()=>{
    (async ()=>{
      const user = await supabase.auth.getUser();
      const uid = user.data.user?.id;
      if(!uid) return;
      const res = await computeAdherence(uid,12);
      setData(res);
    })();
  },[]);

  if(!data) return <div>Loading...</div>;
  return (
    <div style={{padding:20}}>
      <h2>Adherence</h2>
      <div>12-week: {data.percent}%</div>
    </div>
  );
}
