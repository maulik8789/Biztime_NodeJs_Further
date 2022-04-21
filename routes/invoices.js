/** Routes for users of pg-intro-demo. */

const express = require("express");
const ExpressError = require("../expressError")
const router = express.Router();
const db = require("../db");

router.get('/', async (req, res, next) => {
  try {
    const results = await db.query(`SELECT * FROM invoices`);
    return res.json({ invoices: results.rows })
  } catch (e) {
    return next(e);
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const results = await db.query('SELECT * FROM invoices WHERE id = $1', [id])
    if (results.rows.length === 0) {
      throw new ExpressError(`Can't find invoice with id of ${id}`, 404)
    }
    return res.send({ invoice: results.rows[0] })
  } catch (e) {
    return next(e)
  }
})

router.post('/', async (req, res, next) => {
    try {
      const { id, comp_code, amt, paid, add_date, paid_date} = req.body;
      const results = await db.query('INSERT INTO invoices (id, comp_code, amt, paid, add_date, paid_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, comp_code, amt, paid, add_date, paid_date', [id, comp_code, amt, paid, add_date, paid_date]);
      return res.status(201).json({ invoice: results.rows[0] })
    } catch (e) {
      return next(e)
    }
  })
  
  router.patch('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const { comp_code, amt, paid, add_date, paid_date } = req.body;
      const results = await db.query('UPDATE invoices SET comp_code=$1, amt=$2, paid=$3, add_date=$4, paid_date=$5 WHERE id=$6 RETURNING id, comp_code, amt, paid, add_date, paid_date', [comp_code, amt, paid, add_date, paid_date, id])
      if (results.rows.length === 0) {
        throw new ExpressError(`Can't update invoice with id of ${id}`, 404)
      }
      return res.send({ invoice: results.rows[0] })
    } catch (e) {
      return next(e)
    }
  })
  
  router.delete('/:id', async (req, res, next) => {
    try {
      const results = db.query('DELETE FROM invoices WHERE id = $1', [req.params.id])
      return res.send({ msg: "DELETED!" })
    } catch (e) {
      return next(e)
    }
  })
  
  
  module.exports = router;