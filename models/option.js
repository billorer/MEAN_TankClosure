const mongoose = require('mongoose');

// Option Schema
const OptionSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    code: {
        type: Number,
        required: true,
        default: 999
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
    },
    forwardCode:{
        type: Number,
        required: true,
        default: '87'
    },
    backwardCode:{
        type: Number,
        required: true,
        default: '83'
    },
    leftCode: {
        type: Number,
        required: true,
        default: '65'
    },
    rightCode: {
        type: Number,
        required: true,
        default: '68'
    },
    attackCode: {
        type: Number,
        required: true,
        default: '120'
    }
});

const Option = module.exports = mongoose.model('Option', OptionSchema);

module.exports.addOption = function(newOption, callback){
    const option = new Option({userId:newOption});
    console.log("New option:");
    console.log(option);
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
      option.forwardCode = newOption.forwardCode;
      option.backwardCode = newOption.backwardCode;
      option.leftCode = newOption.leftCode;
      option.rightCode = newOption.rightCode;
      option.attackCode = newOption.attackCode;
      option.code = newOption.code;
      option.save(callback);
    });
};
