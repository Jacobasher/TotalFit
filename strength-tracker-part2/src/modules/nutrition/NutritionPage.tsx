import React, { useEffect, useState } from 'react';
import { supabase } from '../../core/supabase';
import { logNutrition, getTodayNutrition } from './NutritionService';

export default function NutritionPage(){
  const [calories,setCalories] = useState(0);
  const [protein,setProtein] = useState(0);
  const [carbs,setCarbs] = useState(0);
  const [fat,setFat] = useState(0);

  useEffect(()=>{
    (async ()=>{
      const user = await supabase.auth.getUser();
      const uid = user.data.user?.id;
      if(!uid) return;
      const today = new Date().toISOString().slice(0,10);
      const res = await getTodayNutrition(uid, today);
      const row = res.data?.[0];
      if(row){ setCalories(row.calories); setProtein(row.protein); setCarbs(row.carbs); setFat(row.fat); }
    })();
  },[]);

  async function save(e:React.FormEvent){
    e.preventDefault();
    const user = await supabase.auth.getUser();
    const uid = user.data.user?.id;
    if(!uid) return;
    const today = new Date().toISOString().slice(0,10);
    await logNutrition({ user_id: uid, date: today, calories, protein, carbs, fat });
  }

  return (
    <div style={{padding:20}}>
      <h2>Nutrition</h2>
      <form onSubmit={save}>
        <div><label>Calories</label><input type="number" value={calories} onChange={e=>setCalories(Number(e.target.value))} /></div>
        <div><label>Protein</label><input type="number" value={protein} onChange={e=>setProtein(Number(e.target.value))} /></div>
        <div><label>Carbs</label><input type="number" value={carbs} onChange={e=>setCarbs(Number(e.target.value))} /></div>
        <div><label>Fat</label><input type="number" value={fat} onChange={e=>setFat(Number(e.target.value))} /></div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
}
