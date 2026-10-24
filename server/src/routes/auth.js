import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js';
import { authenticate } from '../middleware/auth.js';
const router = Router();
const publicUser = u => ({ id:u.id, name:u.name, email:u.email, role:u.role, department_id:u.department_id, phone:u.phone });
router.post('/register', async (req,res,next) => {
  try {
    const { name,email,password,phone } = req.body;
    if (!name?.trim() || !email?.trim() || !password || password.length < 8) return res.status(400).json({message:'Name, email and a password of at least 8 characters are required.'});
    const hash = await bcrypt.hash(password, 12);
    const [result] = await pool.query('INSERT INTO users(name,email,password_hash,role,phone) VALUES(?,?,?,\'student\',?)',[name.trim(),email.trim().toLowerCase(),hash,phone||null]);
    const user = {id:result.insertId,name:name.trim(),email:email.trim().toLowerCase(),role:'student',department_id:null,phone:phone||null};
    const token = jwt.sign({id:user.id},process.env.JWT_SECRET || 'development-only-change-me',{expiresIn:process.env.JWT_EXPIRES_IN||'1d'});
    res.status(201).json({token,user});
  } catch(e) { if(e.code==='ER_DUP_ENTRY') return res.status(409).json({message:'An account with this email already exists.'}); next(e); }
});
router.post('/login', async (req,res,next) => {
  try {
    const {email,password} = req.body;
    if(!email || !password) return res.status(400).json({message:'Enter your email and password.'});
    const [rows] = await pool.query('SELECT * FROM users WHERE email=?',[email.trim().toLowerCase()]);
    if(!rows.length || !(await bcrypt.compare(password,rows[0].password_hash))) return res.status(401).json({message:'Email or password is incorrect.'});
    const user=publicUser(rows[0]); const token=jwt.sign({id:user.id},process.env.JWT_SECRET||'development-only-change-me',{expiresIn:process.env.JWT_EXPIRES_IN||'1d'});
    res.json({token,user});
  } catch(e){next(e);}
});
router.get('/me',authenticate,(req,res)=>res.json({user:req.user}));
export default router;
