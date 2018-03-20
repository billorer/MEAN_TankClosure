const express = require('express');
const router = express.Router();

const User = require('../models/user');

//retrieving users
router.get('/users', (req, res, next)=>{
    User.find(function(err, users){
        res.json(users);
    });
});

//add user
router.post('/user', (req, res, next)=>{
    let newUser = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        phone: req.body.phone
    });

    newUser.save((err, user)=>{
        if(err){
            res.json({msg: 'Failed to add user!'});
        }else {
            res.json({msg: 'User added successfully!'});
        }
    });
});

//delete user
router.delete('/user/:id', (req, res, next)=>{
    User.remove({_id: req.params.id}, function(err, result){
        if(err){
            res.json(err);
        }else{
            res.json(result);
        }
    });
});

//update user
router.put('/user/:id', (req, res, next)=>{

});

module.exports = router;
