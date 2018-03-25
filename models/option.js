const mongoose = require('mongoose');

// Option Schema
const OptionSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    forwardKey:{
        type: String,
        required: true,
        default: 'w'
    },
    backwardKey:{
        type: String,
        required: true,
        default: 's'
    },
    leftKey: {
        type: String,
        required: true,
        default: 'a'
    },
    rightKey: {
        type: String,
        required: true,
        default: 'd'
    },
    attackKey: {
        type: String,
        required: true,
        default: 'k'
    }
});

const Option = module.exports = mongoose.model('Option', OptionSchema);

module.exports.addOption = function(newOption, callback){
    const option = new Option({userId:newOption});
    option.save(callback);
};

// Option.path('forwardKey').validate(function (v) {
//     return v.length <= 1;
// }, 'The maximum length is 1');

module.exports.getOptionByUserId = function(userId, callback){
    const query = {userId: userId};
    Option.findOne(query, callback);
};

module.exports.updateOption = function(newOption, callback){
    Option.findOne({ userId: newOption.userId }, function (err, option){
      option.forwardKey = newOption.forwardKey;
      option.backwardKey = newOption.backwardKey;
      option.leftKey = newOption.leftKey;
      option.rightKey = newOption.rightKey;
      option.attackKey = newOption.attackKey;
      option.save(callback);
    });
};
