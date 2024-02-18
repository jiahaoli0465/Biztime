const express = require('express');
const db = require("../db");


const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
      const result = await db.query('SELECT code, name FROM companies');
      return res.json({companies: result.rows})
    } catch (err) {
      next(err); 
    }
});

router.post('/', async (req, res, next) => {
    try {
      const { code, name, description } = req.body;
      

      if (!code || !name) {
        throw new ExpressError("Code and name are required", 400);
      }
  
      const result = await db.query(
        'INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING code, name, description',
        [code, name, description]
      );
  
      if (result.rows.length === 0) {
        throw new ExpressError("Error adding the company", 500);
      }
  
      return res.status(201).json({ company: result.rows[0] });

    } catch (err) {
      next(err);
    }
});

router.get('/:code', async (req, res, next) => {
    try {
      const { code } = req.params;
      const result = await db.query(
        'SELECT code, name, description FROM companies WHERE code = $1',
        [code]
      );
  
      if (result.rows.length === 0) {
        throw new ExpressError(`Company not found with code: ${code}`, 404);
      }
  
      res.json({ company: result.rows[0] });
    } catch (err) {
      next(err); 
    }
});

router.put('/:code', async (req, res, next) => {
    try {
      const { code } = req.params;
      const { name, description } = req.body;
      const result = await db.query(
        'UPDATE companies SET name = $1, description = $2 WHERE code = $3 RETURNING code, name, description',
        [name, description, code]
      );
  
      if (result.rows.length === 0) {
        throw new ExpressError(`Company not found with code: ${code}`, 404);
      }
  
      res.json({ company: result.rows[0] });
    } catch (err) {
      next(err);
    }
});



router.delete('/:code', async (req, res, next) => {
    try {
      const { code } = req.params;
      const result = await db.query(
        'DELETE FROM companies WHERE code = $1 RETURNING code',
        [code]
      );
  
      if (result.rows.length === 0) {
        throw new ExpressError(`Company not found with code: ${code}`, 404);
      }
  
      res.json({ status: "deleted" });
    } catch (err) {
      next(err);
    }
});
  





module.exports = router;