import dotenv from 'dotenv'; import bcrypt from 'bcryptjs'; import {pool} from './db.js'; dotenv.config();
const departments=['Facilities','IT Support','Housekeeping','Transport','Campus Security','Administration'];
try {
  for(const name of departments) await pool.query('INSERT IGNORE INTO departments(name) VALUES(?)',[name]);
  const [depts]=await pool.query('SELECT id,name FROM departments'); const dept=Object.fromEntries(depts.map(d=>[d.name,d.id]));
  const password_hash=await bcrypt.hash('CampusCare@123',12);
  const users=[
    ['CampusCare Administrator','admin@campuscare.local','admin',null],
    ['Facilities Officer','facilities@campuscare.local','department_staff',dept['Facilities']],
    ['Demo Student','student@campuscare.local','student',null],
    ['IT Support Officer','it@campuscare.local','department_staff',dept['IT Support']]
  ];
  for(const [name,email,role,department_id] of users) await pool.query('INSERT INTO users(name,email,password_hash,role,department_id) VALUES(?,?,?,?,?) ON DUPLICATE KEY UPDATE name=VALUES(name),role=VALUES(role),department_id=VALUES(department_id)',[name,email,password_hash,role,department_id]);
  const [[student]]=await pool.query('SELECT id FROM users WHERE email=?',['student@campuscare.local']);
  const [[existing]]=await pool.query('SELECT COUNT(*) AS n FROM complaints');
  if(!existing.n){
    const samples=[['Repair broken classroom projector','The projector in Block B, Room 204 is not turning on.','Infrastructure','High','Facilities'],['Wi-Fi disconnects in library','Campus Wi-Fi repeatedly disconnects on the second floor.','Wi-Fi & IT','Medium','IT Support'],['Overflowing bins near cafeteria','Waste bins near the cafeteria entrance need attention.','Cleanliness','Low','Housekeeping']];
    for(const [title,description,category,priority,dname] of samples){const [r]=await pool.query('INSERT INTO complaints(user_id,title,description,category,priority,department_id) VALUES(?,?,?,?,?,?)',[student.id,title,description,category,priority,dept[dname]]);const year=new Date().getFullYear();await pool.query('UPDATE complaints SET ticket_id=? WHERE id=?',[`CC-${year}-${String(r.insertId).padStart(5,'0')}`,r.insertId]);await pool.query('INSERT INTO complaint_history(complaint_id,actor_id,action,new_value,note) VALUES(?,?,\'created\',\'Submitted\',\'Demo ticket created by seed script.\')',[r.insertId,student.id]);}
  }
  console.log('Seed complete. Demo accounts use password CampusCare@123.');
} catch(e){console.error('Seed failed:',e.message);process.exitCode=1;} finally {await pool.end();}
