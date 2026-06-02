import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn } from './AuthService';

export default function LoginPage(){
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [error,setError] = useState<string | null>(null);
  const nav = useNavigate();

  async function submit(e:React.FormEvent){
    e.preventDefault();
    setError(null);
    try{
      const { data, error } = await signIn(email,password);
      if(error) throw error;
      nav('/');
    }catch(err:any){
      setError(err.message || String(err));
    }
  }

  return (
    <div style={{padding:20}}>
      <h2>Sign In</h2>
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
          <button type="submit">Sign In</button>
        </div>
        {error && <div style={{color:'red'}}>{error}</div>}
      </form>
    </div>
  );
}
