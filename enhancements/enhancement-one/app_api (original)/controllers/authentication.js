const mongoose = require('mongoose');
const passport = require('passport');
const User = mongoose.model('users');

const register = async (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.password) {
    return res
      .status(400)
      .json({ message: 'All fields required' });
  }

  const user = new User({
    name: req.body.name,
    email: req.body.email
  });

  user.setPassword(req.body.password);

  const q = await user.save();

  if (!q) {
    return res
      .status(404)
      .json({ message: 'User not created' });
  } else {
    const token = user.generateJwt();

    return res
      .status(200)
      .json({ token });
  }
};

const login = (req, res) => {
  // Validate message to ensure that email and password are present.
  if (!req.body.email || !req.body.password) {
    return res
      .status(400)
      .json({"message": "All fields required"});
  }

  // Delegate authentication to passport module
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      // Error in Authentication Process
      return res
        .status(404)
        .json(err);
    }

    if (user) {
      // Auth succeeded - generate JWT and return to caller
      const token = user.generateJwt();
      res
        .status(200)
        .json({token});
    } else {
      // Auth failed return error
      res
        .status(401)
        .json(info);
    }
  })(req, res);
};

module.exports = {
  register,
  login
};