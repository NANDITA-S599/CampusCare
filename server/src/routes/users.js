import { Router } from 'express';
import { pool } from '../db.js';
import { authenticate, allowRoles } from '../middleware/auth.js';
const router=Router();
router.get('/',authenticate,allowRoles('admin'),async(req,res,next)=>{try{const [rows]=await pool.query('SELECT u.id,u.name,u.email,u.role,u.department_id,d.name AS department_name,u.phone,u.created_at FROM users u LEFT JOIN departments d ON d.id=u.department_id ORDER BY u.created_at DESC');res.json(rows);}catch(e){next(e);}});
router.patch('/me',authenticate,async(req,res,next)=>{try{const {name,phone}=req.body;if(!name?.trim())return res.status(400).json({message:'Name is required.'});await pool.query('UPDATE users SET name=?,phone=? WHERE id=?',[name.trim(),phone||null,req.user.id]);const [rows]=await pool.query('SELECT id,name,email,role,department_id,phone FROM users WHERE id=?',[req.user.id]);res.json({user:rows[0]});}catch(e){next(e);}});
export default router;
