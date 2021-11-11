const router = require('express').Router();
const Model = require('../models/Models');
const Item = Model.Item;
const { check, validationResult } = require('express-validator');
const verified = require('../verificationToken');

//get all item
router.get('/get', async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(400).json({ message: 'No item was found' });
  }
});

//add item (post)
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('costprice', 'Cost price is required').not().isEmpty(),
    check('sellingprice', 'Selling price is required').not().isEmpty(),
  ],
  async (req, res) => {
    // check the validation object for errors (express validator)
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    //Register new Item
    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      costprice: req.body.costprice,
      sellingprice: req.body.sellingprice,
    });

    try {
      const newItem = await item.save();
      res.status(200).send('New Item has been registered');
    } catch (error) {
      res.status(400).send(error);
    }
  }
);

//update item
router.patch(
  '/:id',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('costprice', 'Costprice is required').not().isEmpty(),
    check('sellingprice', 'Sellingprice is required').not().isEmpty(),
  ],
  async (req, res) => {
    // check the validation object for errors (express validator)
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    //update item
    try {
      const item = await Item.updateOne(
        { _id: req.params.id },
        {
          $set: {
            name: req.body.name,
            description: req.body.description,
            costprice: req.body.costprice,
            sellingprice: req.body.sellingprice,
          },
        },
        { new: true }
      );
      res.send(item);
    } catch (err) {
      res.send({ message: err });
    }
  }
);

//delete item
router.delete('/:id', async (req, res) => {
  try {
    const deleteItem = await Item.findOneAndDelete({ _id: req.params.id });
    res.status(200).send('Item has been deleted');
  } catch (error) {
    res.json({ message: 'Item could not be deleted' });
  }
});

module.exports = router;
