import {createContext,useContext,useEffect,useState} from 'react';
import {api} from '../lib/api';
const AuthContext=createContext(null);
export function AuthProvider({children}){const [user,setUser]=useState(()=>{try{return JSON.parse(localStorage.getItem('cc_user'));}catch{return null;}});const [loading,setLoading]=useState(Boolean(localStorage.getItem('cc_token')));
useEffect(()=>{if(!localStorage.getItem('cc_token')){setLoading(false);return;}api.get('/auth/me').then(r=>{setUser(r.data.user);localStorage.setItem('cc_user',JSON.stringify(r.data.user));}).catch(()=>{setUser(null);}).finally(()=>setLoading(false));},[]);
const login=async(email,password)=>{const {data}=await api.post('/auth/login',{email,password});localStorage.setItem('cc_token',data.token);localStorage.setItem('cc_user',JSON.stringify(data.user));setUser(data.user);return data.user;};
const register=async(values)=>{const {data}=await api.post('/auth/register',values);localStorage.setItem('cc_token',data.token);localStorage.setItem('cc_user',JSON.stringify(data.user));setUser(data.user);return data.user;};
const logout=()=>{localStorage.removeItem('cc_token');localStorage.removeItem('cc_user');setUser(null);location.href='/login';};
const updateUser=u=>{setUser(u);localStorage.setItem('cc_user',JSON.stringify(u));};
return <AuthContext.Provider value={{user,loading,login,register,logout,updateUser}}>{children}</AuthContext.Provider>;}
export const useAuth=()=>useContext(AuthContext);
