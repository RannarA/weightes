const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const config = require('../config/config');
const User = require('../models/user');

const saltRounds = 10;

router.post('/sign-in', (req, res) => {
    User.findOne({
        email: req.body.email
    }, (err, user) => {
        if (err) throw err;

        if (!user) {
            console.log('user not found');
            res.json({success: false, message: 'Authentication failed'});
        } else if (user) {
            if (bcrypt.compareSync(req.body.password, user.password)) {
                const payload = {
                    userId: user._id
                };

                const token = jwt.sign(payload, config.secret, {
                    expiresIn: 1440
                });

                res.json({
                    success: true,
                    token: token
                });
            } else {
                console.log('Wrong password');
                res.json({success: false, message: 'Authentication failed'});
            }
        }
    })
});

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
            bcrypt.hash(user.password, saltRounds, (err, hash) => {
                // Store hash in your password DB.
                user.password = hash;

                const newUser = new User(user);
                newUser.save(err => {
                    if (err) throw err;

                    res.status(200).send({
                        success: true
                    })
                });
            });
        }
    })
});

module.exports = router;
