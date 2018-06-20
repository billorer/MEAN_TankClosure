const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

//EMAIL
const emails = require('../config/email');

const User = require('../models/user');
const Option = require('../models/option');

// Register
router.post('/register', (req, res, next) => {
    let newUser = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        score: 0 //by default
    });

    // We check if the username alreay exists
    User.getUserByUsername(newUser.username, (err, user) => {
        if(err) throw err;
        if(user){
            return res.json({success: false, msg: 'Username already exists!'});
        }

        User.getUserByEmail(newUser.email, (err, user) => {
            if(err) throw err;
            if(user){
                return res.json({success: false, msg: 'Email already exists!'});
            }
            // The username does not exist, so we can create the new entity
            User.addUser(newUser, (err, user) => {
                if(err){
                    res.json({success: false, msg: 'Failed to register user: '+err});
                }else {
                    // Adding default options to the new user as well
                    Option.addOption(user._id, (err, options) => {
                        if(err){
                            res.json({success: false, msg: 'Failed to save options to the new user: '+err});
                        }else {
                            // Sending emeail to the newly registered user
                            emails.sendEmail(newUser);
                            res.json({success: true, msg: 'User registered successfully and the registration email has been sent!'});
                        }
                    });
                }
            });
        });
    });
});

// Authenticate
router.post('/authenticate', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username, (err, user) => {
        if(err) throw err;
        if(!user){
            return res.json({success: false, msg: 'User not found!'});
        }

        User.comparePassword(password, user.password, (err, isMatch) => {
            if(err) throw err;
            if(isMatch){
                const token = jwt.sign(user.toJSON(), config.secret, {
                    expiresIn: 604800 //1 week in seconds
                });

                Option.getOptionByUserId(user._id, (err, option) => {
                    if(err) throw err;
                    if(!option){
                        return res.json({success: false, msg: 'Options not found!'});
                    }
                    console.log("OPTIONS: " + option);
                    res.json({
                        success: true,
                        token: 'JWT ' + token,
                        user: {
                            id: user._id,
                            first_name: user.first_name,
                            last_name: user.last_name,
                            username: user.username,
                            email: user.email,
                            //score: user.score
                        },
                        options: option
                    });
                });
            } else {
                return res.json({success: false, msg: 'Wrong password!'});
            }
        });
    });
});

// Reset password
router.put('/resetPassword', (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.updatePassword(email, password, (err, returnData) => {
        if(err) throw err;
        if(returnData.n === 0 && returnData.nModified === 0){
            return res.json({success: false, msg: 'User not found!'});
        } else if (returnData.n === 1 && returnData.nModified === 1){
            return res.json({success: true, msg: 'The password has been reset!'});
        }
    });
});

// Update score
router.put('/updateScore', (req, res, next) => {
    const newUserScore = req.body.newUserScore;
    const username = req.body.username;
    console.log("UpdateScore: " + newUserScore + " " + username);
    User.getUserByUsername(username, (getUserError, curUser) => {
        if(getUserError) throw getUserError;
        if(!curUser){
            return res.json({success: false, msg: 'Game over, the points cannot be saved!'});
        }
        let newScore = newUserScore + curUser.score;
        User.updateUserScore(username, newScore, (err, user) => {
            if(err) throw err;
            if(!user){
                return res.json({success: false, msg: 'Game over, the points cannot be saved!'});
            }
            return res.json({success: true, msg: 'Game over, the points have been saved!'});
        });
        //return res.json({success: true, msg: 'Game over, the points have been saved!'});
    });

});

// Profile
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    res.json({user: req.user});
});

module.exports = router;
