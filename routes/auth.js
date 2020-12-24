
const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const User = require('../models/User');

// @route   POST api/auth
// @desc    Auth user & get token
// @access  Public
router.post(
  '/',
  //[
   // body('email', 'Please include a valid email').isEmail(),
   // body('password', 'Password is required').exists(),
  //],
  async (req, res) => {
    //const errors = validationResult(req);
    //if (!errors.isEmpty()) {
    //  return res.status(400).json({ errors: errors.array() });
    //}

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res.json({ msg: 'Invalid email' });
      }
		
		//decrypts password and compares with provide password
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.json({ msg: 'Invalid Password' });
      }

      const payload = {
        user: {
          id: user.id,
		  name:user.name,
        },
      };

	  //on signin a jwtoken is generated which is verified 
	  //during every request post url,auth,async
	  //CREATE & SEND token
jwt.sign(payload, config.get('jwtSecret'),{expiresIn: 360000,},(err, token) => {
          if (err) throw err;
          res.json({ token: token ,
					 user: payload.user});
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/auth
// @desc    Get logged in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
