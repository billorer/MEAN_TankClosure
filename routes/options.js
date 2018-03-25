const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

const Option = require('../models/option');

//Save options
router.put('/saveOptions', (req, res, next) => {
    let newOption = new Option({
        forwardKey: req.body.forwardKey,
        backwardKey: req.body.backwardKey,
        leftKey: req.body.leftKey,
        rightKey: req.body.rightKey,
        attackKey: req.body.attackKey,
        userId: req.body.userId
    });

    Option.updateOption(newOption, (err, options) => {
        if(err){
            res.json({success: false, msg: 'Failed to save options: '+err});
        }else {
            res.json({success: true, msg: 'Options saved successfully!'});
        }
    });
});

// Options
router.get('/getOption/:userId', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    const userId = req.params.userId;
    Option.getOptionByUserId(userId, (err, option) => {
        if(err) throw err;
        if(!option){
            return res.json({success: false, msg: 'Option not found!'});
        }
        res.json({
            success: true,
            options: {
                id: option._id,
                forwardKey: option.forwardKey,
                backwardKey: option.backwardKey,
                leftKey: option.leftKey,
                rightKey: option.rightKey,
                attackKey:option.attackKey,
                userId: option.userId
            }
        });
    });
});

module.exports = router;
