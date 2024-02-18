/** BizTime express application. */
const express = require("express");

const app = express();
const ExpressError = require("./expressError")


app.use(express.json());

const companiesRouter = require('./routes/companies.js');
const invoicesRouter = require('./routes/invoices.js');


app.use('/companies', companiesRouter);
app.use('/invoices', invoicesRouter);




app.get('/', (req, res) => {

  res.send('hi');
});



/** 404 handler */

app.use(function(req, res, next) {
  const err = new ExpressError("Not Found", 404);
  return next(err);
});

/** general error handler */

app.use((err, req, res, next) => {
  res.status(err.status || 500);

  return res.json({
    error: err,
    message: err.message
  });
});


module.exports = app;
