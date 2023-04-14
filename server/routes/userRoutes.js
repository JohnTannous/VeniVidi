import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const userRoutes = express.Router();


const genToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, { expiresIn: '2h' });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPasswords(password))) {
    res.json({
      _id: user._id,
      email: user.email,
      token: genToken(user._id),
    });
  } else {
    res.status(401).send('Invalid Email or Password');
  }
};

userRoutes.route('/login').post(loginUser);

export default userRoutes;