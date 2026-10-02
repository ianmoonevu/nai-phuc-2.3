import { useEffect, useRef, useState } from 'react';
import { getSupabase } from '../lib/supabase';
import { authenticateAdmin, verifyAdmin } from '../lib/adminIdentity';

export function useAdminAuth() {
  const [isAdminAuthenticated,setAuthenticated]=useState(false);
  const generation=useRef(0);
  useEffect(()=>{
    const db=getSupabase();if(!db)return;
    let disposed=false;
    let timer:ReturnType<typeof setTimeout>;
    const check=async()=>{
      const ticket=++generation.current;
      try {const allowed=await verifyAdmin(db);if(!disposed&&ticket===generation.current)setAuthenticated(allowed);}
      catch {if(!disposed&&ticket===generation.current)setAuthenticated(false);}
    };
    // Never await another Auth call inside the Auth event callback.
    const {data:{subscription}}=db.auth.onAuthStateChange((event)=>{
      if(event==='SIGNED_OUT'){generation.current++;setAuthenticated(false);}
      clearTimeout(timer);timer=setTimeout(()=>void check(),0);
    });
    const focus=()=>void check();window.addEventListener('focus',focus);
    void check();
    try {sessionStorage.removeItem('hoki_admin_auth_session');}catch{/* Legacy flags grant no access. */}
    return()=>{disposed=true;generation.current++;clearTimeout(timer);subscription.unsubscribe();window.removeEventListener('focus',focus);};
  },[]);
  const loginAdmin=async(id:string,password:string)=>{
    const db=getSupabase();if(!db)return false;
    try {const allowed=await authenticateAdmin(db,id,password);setAuthenticated(allowed);return allowed;}
    catch {setAuthenticated(false);return false;}
  };
  const logoutAdmin=()=>{
    generation.current++;setAuthenticated(false);
    void getSupabase()?.auth.signOut({scope:'local'});
  };
  return {isAdminAuthenticated,loginAdmin,logoutAdmin};
}
