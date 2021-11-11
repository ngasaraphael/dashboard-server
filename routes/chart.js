const router = require('express').Router();
const Model = require('../models/Models');
const Chart = Model.Chart;
const { check, validationResult } = require('express-validator');
const verified = require('../verificationToken');

//register data once
router.post(
  '/',
  [
    check('month', 'Data is required for every Month').not().isEmpty(),
    check('costprice', 'Data is required for costprice').not().isEmpty(),
    check('salesprice', 'Data is required for salesprice').not().isEmpty(),
    check('profit', 'Data is required for profit').not().isEmpty(),
  ],
  async (req, res) => {
    // check the validation object for errors (express validator)
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    //Register monthly data
    const data = new Chart({
      month: req.body.month,
      costprice: req.body.costprice,
      salesprice: req.body.salesprice,
      profit: req.body.profit,
    });

    try {
      const newData = await data.save();
      res.status(200).send('Item Data has been posted');
    } catch (error) {
      res.status(400).send(error);
    }
  }
);

//Update chart data
router.patch(
  '/:id',
  [
    check('month', 'Data is required for Month').not().isEmpty(),
    check('costprice', 'Data is required for costprice').not().isEmpty(),
    check('salesprice', 'Data is required for salesprice').not().isEmpty(),
    check('profit', 'Data is required for profit').not().isEmpty(),
  ],
  async (req, res) => {
    // check the validation object for errors (express validator)
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    try {
      const data = await Chart.updateOne(
        { _id: req.params.id },
        {
          $set: {
            month: req.body.month,
            costprice: req.body.costprice,
            salesprice: req.body.salesprice,
            profit: req.body.profit,
          },
        },
        { new: true }
      );
      res.send({ data, message: 'Chart data has been updated' });
    } catch (err) {
      res.send({ message: err });
    }
  }
);

//Get chart data
router.get('/', async (req, res) => {
  try {
    const data = await Chart.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: 'Data not found' });
  }
});

module.exports = router;
