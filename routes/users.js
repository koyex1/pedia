
const express = require('express');
const router = express.Router();

const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../models/User');

// @route   POST api/users
// @desc    Register a User
// @access  Public
//router.post('',[],()=>{})
router.post(
  '/',
  [ //where error happens
    body('name', 'Name is required').not().isEmpty(),
    body('email', 'Please include a valid E-mail').isEmail(),
    body('password', 'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
  //holds record of error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res.json({msg: 'exist' });
      }
	
	//place body contents in model
      user = new User({
        name,
        email,
        password,
		role,
      });

      //encrypt password in model
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
	  //send and save in database
      await user.save();

      //CREATE & SEND the Token tracking ID
	  //the form jwt sign takes this augument
      const payload = {
        user: {
          id: user.id,
        },
      };
//jwt.sign(payload, config, {},()=>)
//automatic login after page reason for signing token
      
	  res.json({ msg: 'success'});
	  
    } catch (err) {
      console.error(err.message);
	  //send json({msg:'server error'})
      res.status(500).send({
	  type: 'server',
	  msg: 'Server Error'});
    }
  }
);

module.exports = router;
