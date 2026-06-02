import React, { useState } from 'react';
import { supabase } from '../../core/supabase';

export default function ForgotPasswordPage(){
  const [email,setEmail] = useState('');
  const [message,setMessage] = useState<string | null>(null);

  async function submit(e:React.FormEvent){
    e.preventDefault();
    setMessage(null);
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });
    if(error) setMessage(error.message);
    else setMessage('Password reset email sent');
  }

  return (
    <div style={{padding:20}}>
      <h2>Reset Password</h2>
      <form onSubmit={submit}>
        <div>
          <label>Email</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <div>
          <button type="submit">Send reset</button>
        </div>
        {message && <div>{message}</div>}
      </form>
    </div>
  );
}
