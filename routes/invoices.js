const express = require('express');
const db = require("../db");

const router = express.Router();


router.get('/', async (req, res, next) => {

    try {
      const result = await db.query('SELECT id, comp_code FROM invoices');
      return res.json({invoices: result.rows})
    } catch (err) {
      next(err); 
    }
});

router.post('/', async (req, res, next) => {
    try {
      const { comp_code, amt } = req.body;
      const result = await db.query(
        `INSERT INTO invoices (comp_code, amt) 
         VALUES ($1, $2) 
         RETURNING id, comp_code, amt, paid, add_date, paid_date`,
        [comp_code, amt]
      );
  
      return res.status(201).json({ invoice: result.rows[0] });
    } catch (err) {
      next(err);
    }
});

  
router.get('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const invoiceResult = await db.query(
        'SELECT id, amt, paid, add_date, paid_date, comp_code FROM invoices WHERE id = $1',
        [id]
      );
      
      if (invoiceResult.rows.length === 0) {
        throw new ExpressError(`Invoice not found: ${id}`, 404);
      }
  
      const invoice = invoiceResult.rows[0];
      
      const compResult = await db.query(
        'SELECT code, name FROM companies WHERE code = $1',
        [invoice.comp_code] 
      );
  
      if (compResult.rows.length === 0) {

        throw new ExpressError(`Company not found for invoice: ${id}`, 404);
      }
  
      return res.json({ invoice: invoice, company: compResult.rows[0] });
    } catch (err) {
      next(err);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const { amt } = req.body;
      const result = await db.query(
        `UPDATE invoices 
         SET amt = $1 
         WHERE id = $2 
         RETURNING id, comp_code, amt, paid, add_date, paid_date`,
        [amt, id]
      );
  
      if (result.rows.length === 0) {
        throw new ExpressError(`Invoice not found: ${id}`, 404);
      }
  
      return res.json({ invoice: result.rows[0] });
    } catch (err) {
      next(err);
    }
});
  
router.delete('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await db.query(
        `DELETE FROM invoices WHERE id = $1 RETURNING id`,
        [id]
      );
  
      if (result.rows.length === 0) {
        throw new ExpressError(`Invoice not found: ${id}`, 404);
      }
  
      return res.json({ status: "deleted" });
    } catch (err) {
      next(err);
    }
});
  
  
  

module.exports = router;