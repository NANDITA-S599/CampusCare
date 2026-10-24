import { Router } from 'express';
import { pool } from '../db.js';
import { authenticate, allowRoles } from '../middleware/auth.js';
const router=Router();
const cell=v=>`"${String(v??'').replaceAll('"','""')}"`;
router.get('/complaints.csv',authenticate,allowRoles('admin'),async(req,res,next)=>{try{const [rows]=await pool.query(`SELECT c.ticket_id,c.title,c.category,c.priority,c.status,u.name AS submitted_by,d.name AS department,c.created_at,c.resolved_at,c.resolution_notes FROM complaints c JOIN users u ON u.id=c.user_id LEFT JOIN departments d ON d.id=c.department_id ORDER BY c.created_at DESC`);const cols=['ticket_id','title','category','priority','status','submitted_by','department','created_at','resolved_at','resolution_notes'];const csv=[cols.join(','),...rows.map(r=>cols.map(k=>cell(r[k] instanceof Date?r[k].toISOString():r[k])).join(','))].join('\r\n');res.setHeader('Content-Type','text/csv; charset=utf-8');res.setHeader('Content-Disposition','attachment; filename="campuscare-complaints.csv"');res.send(csv);}catch(e){next(e);}});
export default router;
