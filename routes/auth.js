const router = require('express').Router();
const Model = require('../models/Models');
const User = Model.User;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

//Register new User
router.post(
  '/register',

  [
    check('password', 'Password is required').not().isEmpty(),
    check('email', 'Email does not appear to be valid').isEmail(),
  ],

  async (req, res) => {
    // check the validation object for errors (express validator)
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    //check if email exist
    const emailExist = await User.findOne({
      email: req.body.email,
    });
    if (emailExist) {
      return res.status(400).send('User already exist. Please Singin');
    }

    //Hash password with bcrypt
    const salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(req.body.password, salt);

    //Register new User
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });

    try {
      const savedUser = await user.save();
      res.status(200).send('User has been registered');
    } catch (error) {
      res.status(400).send(error);
    }
  }
);

//Login existing user
router.post('/login', async (req, res) => {
  //Check if email exist in db
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Invalid Email or password');

  //Checking if password is correct
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid Email or Password');

  //create and assign jwt to header
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header('auth-token', token).send({ user, token });
});

//Update user details
router.patch(
  '/:name',
  //check validity of email and password
  [
    check('password', 'Password is required').not().isEmpty(),
    check('email', 'Email does not appear to be valid').isEmail(),
  ],

  async (req, res) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      const userUpdates = await User.updateOne(
        { name: req.params.name },
        {
          $set: {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
          },
        },
        { new: true }
      );
      res.json(userUpdates);
    } catch (error) {
      res.send({ message: error });
    }
  }
);

module.exports = router;
