import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { archiveExercise } from './ExerciseService';

export default function ExerciseArchivePage(){
  const { id } = useParams();
  const nav = useNavigate();

  async function archive(){
    if(!id) return;
    await archiveExercise(id);
    nav('/exercises');
  }

  return (
    <div style={{padding:20}}>
      <h2>Archive Exercise</h2>
      <p>Are you sure you want to archive?</p>
      <button onClick={archive}>Archive</button>
    </div>
  );
}
