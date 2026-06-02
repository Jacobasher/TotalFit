import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { supabase } from '../../core/supabase';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale);

export default function AnalyticsPage(){
  const [dataSets,setDataSets] = useState<any>({});
  const [visible, setVisible] = useState({ strength:true, weight:true, calories:false, protein:false });

  useEffect(()=>{
    (async ()=>{
      // fetch weekly strength score history and bodyweight history
      const { data: s } = await supabase.from('strength_score_history').select('score,date').order('date',{ascending:true});
      const { data: w } = await supabase.from('bodyweight').select('body_weight as value,date').order('date',{ascending:true});
      const { data: n } = await supabase.from('nutrition').select('calories,protein,date').order('date',{ascending:true});

      setDataSets({ strength: s || [], weight: w || [], nutrition: n || [] });
    })();
  },[]);

  const chartData = {
    datasets: [
      visible.strength && { label: 'Strength Score', data: (dataSets.strength||[]).map((r:any)=> ({ x: r.date, y: r.score })), borderColor: 'rgb(54,162,235)', tension:0.2 },
      visible.weight && { label: 'Body Weight', data: (dataSets.weight||[]).map((r:any)=> ({ x: r.date, y: Number(r.value) })), borderColor: 'rgb(255,99,132)', tension:0.2 },
      visible.calories && { label: 'Calories', data: (dataSets.nutrition||[]).map((r:any)=> ({ x: r.date, y: r.calories })), borderColor: 'rgb(75,192,192)', tension:0.2 },
      visible.protein && { label: 'Protein', data: (dataSets.nutrition||[]).map((r:any)=> ({ x: r.date, y: r.protein })), borderColor: 'rgb(153,102,255)', tension:0.2 }
    ].filter(Boolean)
  };

  const options = { scales: { x: { type: 'time' } } };

  return (
    <div style={{padding:20}}>
      <h2>Analytics</h2>
      <div style={{marginBottom:10}}>
        <label><input type="checkbox" checked={visible.strength} onChange={e=>setVisible({...visible, strength: e.target.checked})} /> Strength Score</label>
        <label style={{marginLeft:8}}><input type="checkbox" checked={visible.weight} onChange={e=>setVisible({...visible, weight: e.target.checked})} /> Body Weight</label>
        <label style={{marginLeft:8}}><input type="checkbox" checked={visible.calories} onChange={e=>setVisible({...visible, calories: e.target.checked})} /> Calories</label>
        <label style={{marginLeft:8}}><input type="checkbox" checked={visible.protein} onChange={e=>setVisible({...visible, protein: e.target.checked})} /> Protein</label>
      </div>
      <Line data={chartData} options={options} />
    </div>
  );
}
