import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../../core/supabase';

export default function ProtectedRoute({ children }:{children:JSX.Element}){
  const [loading,setLoading] = useState(true);
  const [authed,setAuthed] = useState(false);

  useEffect(()=>{
    let mounted = true;
    async function check(){
      const { data } = await supabase.auth.getSession();
      if(!mounted) return;
      setAuthed(!!data.session?.user);
      setLoading(false);
    }
    check();
    const { data: sub } = supabase.auth.onAuthStateChange(()=> check());
    return ()=>{
      mounted = false;
      sub.subscription.unsubscribe();
    };
  },[]);

  if(loading) return <div>Loading...</div>;
  if(!authed) return <Navigate to="/login" replace />;
  return children;
}
