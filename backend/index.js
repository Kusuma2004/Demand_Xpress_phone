require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const validate = ({name,email,phone})=>{
  const emailRe = /^\S+@\S+\.\S+$/;
  const phoneRe = /^\d{10}$/;
  if(!name || !emailRe.test(email) || !phoneRe.test(phone)) return false;
  return true;
};

// POST /contacts
app.post('/contacts', async (req, res) => {
  const { name, email, phone } = req.body;
  if(!validate({name,email,phone})) return res.status(400).json({ error: 'Invalid input' });
  const sql = `INSERT INTO contacts (name,email,phone) VALUES (?,?,?)`;
  db.run(sql, [name,email,phone], function(err){
    if(err) return res.status(500).json({error:err.message});
    db.get(`SELECT * FROM contacts WHERE id = ?`, [this.lastID], (e,row)=>{
      if(e) return res.status(500).json({error:e.message});
      res.status(201).json(row);
    });
  });
});

// GET /contacts?page=1&limit=10
app.get('/contacts', (req,res)=>{
  const page = Math.max(1, parseInt(req.query.page)||1);
  const limit = Math.max(1, parseInt(req.query.limit)||10);
  const offset = (page-1)*limit;
  db.get(`SELECT COUNT(*) as total FROM contacts`, [], (err,countRow)=>{
    if(err) return res.status(500).json({error:err.message});
    const total = countRow.total || 0;
    db.all(`SELECT * FROM contacts ORDER BY id DESC LIMIT ? OFFSET ?`, [limit,offset], (err,rows)=>{
      if(err) return res.status(500).json({error:err.message});
      res.json({ contacts: rows, total });
    });
  });
});

// DELETE /contacts/:id
app.delete('/contacts/:id', (req,res)=>{
  const id = req.params.id;
  db.run(`DELETE FROM contacts WHERE id = ?`, [id], function(err){
    if(err) return res.status(500).json({error:err.message});
    if(this.changes===0) return res.status(404).json({error:'Not found'});
    res.sendStatus(204);
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>console.log(`Server running on ${PORT}`));
