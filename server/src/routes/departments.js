import { Router } from 'express';
import { pool } from '../db.js';
import { authenticate, allowRoles } from '../middleware/auth.js';
const router=Router();
router.get('/',authenticate,async(req,res,next)=>{try{const [rows]=await pool.query('SELECT id,name,email FROM departments ORDER BY name');res.json(rows);}catch(e){next(e);}});
router.post('/',authenticate,allowRoles('admin'),async(req,res,next)=>{try{const {name,email}=req.body;if(!name?.trim())return res.status(400).json({message:'Department name is required.'});const [r]=await pool.query('INSERT INTO departments(name,email) VALUES(?,?)',[name.trim(),email||null]);res.status(201).json({id:r.insertId,name:name.trim(),email:email||null});}catch(e){if(e.code==='ER_DUP_ENTRY')return res.status(409).json({message:'That department already exists.'});next(e);}});
export default router;
