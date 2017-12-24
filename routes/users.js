const express = require('express');
const router = express.Router();

const User = require('../models/user');

router.post('/register', (req, res) => {
    let user = {
        email: req.body.email,
        password: req.body.password,
    };

    User.findOne({
        email: user.email
    }, (err, existingUser) => {
        if (err || existingUser) {
          res.json({success: false, message: 'Sign up failed'})
        } else {
          const newUser = new User(user);
          newUser.save(err => {
            if (err) throw err;

              res.status(200).send({
                  success: true
              })
          });
        }
    })
});

module.exports = router;
