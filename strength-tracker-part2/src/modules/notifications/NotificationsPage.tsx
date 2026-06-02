import React, { useEffect, useState } from 'react';
import { getNotifications, markRead } from './NotificationService';
import { supabase } from '../../core/supabase';

export default function NotificationsPage(){
  const [items,setItems] = useState<any[]>([]);

  useEffect(()=>{
    (async ()=>{
      const user = await supabase.auth.getUser();
      const uid = user.data.user?.id;
      if(!uid) return;
      const res = await getNotifications(uid);
      setItems(res.data || []);
    })();
  },[]);

  async function mark(id:string){
    await markRead(id);
    setItems(items.map(i=> i.id===id ? {...i, read:true} : i));
  }

  return (
    <div style={{padding:20}}>
      <h2>Notifications</h2>
      <ul>
        {items.map(i=> (
          <li key={i.id} style={{opacity: i.read?0.6:1}}>
            <div>{i.type}: {i.message}</div>
            <div><small>{i.created_at}</small></div>
            {!i.read && <button onClick={()=>mark(i.id)}>Mark read</button>}
          </li>
        ))}
      </ul>
    </div>
  );
}
