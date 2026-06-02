import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUp } from './AuthService';
import { supabase } from '../../core/supabase';

export default function RegisterPage(){
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [error,setError] = useState<string | null>(null);
  const nav = useNavigate();

  async function submit(e:React.FormEvent){
    e.preventDefault();
    setError(null);
    try{
      const { data, error } = await signUp(email,password);
      if(error) throw error;
      const user = data?.user;
      if(user){
        // create profile row
        await supabase.from('profiles').insert({ id: user.id, email: user.email });
      }
      nav('/');
    }catch(err:any){
      setError(err.message || String(err));
    }
  }

  return (
    <div style={{padding:20}}>
      <h2>Register</h2>
      <form onSubmit={submit}>
        <div>
          <label>Email</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <div>
          <label>Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        <div>
          <button type="submit">Create account</button>
        </div>
        {error && <div style={{color:'red'}}>{error}</div>}
      </form>
    </div>
  );
}
