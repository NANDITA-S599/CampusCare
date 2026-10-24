import jwt from 'jsonwebtoken';
import { pool } from '../db.js';

export async function authenticate(req, res, next) {
  try {
    const token = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Please log in to continue.' });
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'development-only-change-me');
    const [rows] = await pool.query('SELECT id,name,email,role,department_id,phone,created_at FROM users WHERE id=?', [payload.id]);
    if (!rows.length) return res.status(401).json({ message: 'Account not found.' });
    req.user = rows[0]; next();
  } catch (error) {
    return res.status(401).json({ message: error.name === 'TokenExpiredError' ? 'Session expired. Please log in again.' : 'Invalid session.' });
  }
}
export const allowRoles = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) return res.status(403).json({ message: 'You do not have permission to perform this action.' });
  next();
};
