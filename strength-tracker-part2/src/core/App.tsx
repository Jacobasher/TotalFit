
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import modules from '../modules';
import { supabase } from './supabase';
import { getNotifications } from '../modules/notifications/NotificationService';

const queryClient = new QueryClient();
const authPaths = ['/login', '/register', '/forgot-password'];

function Dashboard(){
  return (
    <div style={{padding:20}}>
      <h1>Dashboard</h1>
      <div>Welcome to the Progressive Overload Tracker.</div>
    </div>
  );
}

function AppContent(){
  const authModule = modules.find((m:any)=> m.name === 'auth');
  const ProtectedRoute = authModule?.components?.ProtectedRoute ?? (({ children }: any) => children);
  const { data: notifications = [] } = useQuery(['notifications'], async () => {
    const { data: user } = await supabase.auth.getUser();
    const uid = user?.user?.id;
    if(!uid) return [];
    const res = await getNotifications(uid);
    return res.data || [];
  }, { retry: false });

  const unreadCount = notifications.filter((item:any)=> !item.read).length;

  return (
    <BrowserRouter>
      <nav style={{padding:12, display:'flex', flexWrap:'wrap', gap:'10px', background:'#fafafa', borderBottom:'1px solid #ddd'}}>
        <Link to="/">Dashboard</Link>
        <Link to="/exercises">Exercises</Link>
        <Link to="/workout">Workout</Link>
        <Link to="/goals">Goals</Link>
        <Link to="/nutrition">Nutrition</Link>
        <Link to="/bodyweight">Bodyweight</Link>
        <Link to="/analytics">Analytics</Link>
        <Link to="/notifications">Notifications{unreadCount ? ` (${unreadCount})` : ''}</Link>
        <span style={{marginLeft:'auto'}}>
          <Link to="/login">Sign in</Link> | <Link to="/register">Register</Link>
        </span>
      </nav>
      <Routes>
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        {modules.flatMap((m:any)=> (m.routes||[]).map((r:any,idx:number)=> {
          const element = authPaths.includes(r.path)
            ? r.element
            : <ProtectedRoute>{r.element}</ProtectedRoute>;
          return <Route key={(m.name||'mod')+idx} path={r.path} element={element} />;
        }))}
        <Route path="*" element={<div style={{padding:20}}>Page not found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App(){
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
