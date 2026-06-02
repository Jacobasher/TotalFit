import React, { useEffect, useState } from 'react';
import { proteinRecommendation, calorieRecommendation } from './RecommendationService';
import { supabase } from '../../core/supabase';

export default function RecommendationsPage(){
  const [items,setItems] = useState<any[]>([]);

  useEffect(()=>{
    (async ()=>{
      const user = await supabase.auth.getUser();
      const uid = user.data.user?.id;
      if(!uid) return;
      const p = await proteinRecommendation(uid);
      const c = await calorieRecommendation(uid);
      setItems([p,c].filter(Boolean));
    })();
  },[]);

  return (
    <div style={{padding:20}}>
      <h2>Recommendations</h2>
      <ul>
        {items.map((it,i)=> (
          <li key={i}>{it.type}: {it.message}</li>
        ))}
      </ul>
    </div>
  );
}
