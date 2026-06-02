import React, { useEffect, useState } from 'react';
import { getStreaks } from './StreaksService';
import { supabase } from '../../core/supabase';

export default function StreaksPage(){
  const [streaks,setStreaks] = useState<any>(null);

  useEffect(()=>{
    (async ()=>{
      const user = await supabase.auth.getUser();
      const uid = user.data.user?.id;
      if(!uid) return;
      const s = await getStreaks(uid);
      setStreaks(s);
    })();
  },[]);

  if(!streaks) return <div>Loading...</div>;
  return (
    <div style={{padding:20}}>
      <h2>Weekly Streaks</h2>
      <div>Current: {streaks.current_streak}</div>
      <div>Longest: {streaks.longest_streak}</div>
    </div>
  );
}
