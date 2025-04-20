const mongoose = require('mongoose');
const {v4:uuidv4} = require('uuid')

const AllowanceSchema = new mongoose.Schema({
    calculationId:{
        type:String,
        default:uuidv4,
        unique:true
    },
    userId:{
        type:String,
        required:true
    },
    jobDesignation:{
        type:String,
        required:true
    },
    basicPay:{
        type:Number,
        required:true
    },
    marriedStatus:{
        type:Boolean,
        required:true
    },
    distanceTravelled:{
        type:Number,
        required:true
    },
    vehicleIncluded:{
        type:{
        type: String,
        enum:['car','bike','none'],
        default:'none'
     },
     details:String,
     weight:Number
    },
    result: {
        totalAllowance:Number,
        breakdown:{
            baseAllowance:Number,
            distanceAllowance:Number,
            familyAllowance:Number,
            vehicleAllowance:Number
        }
    },
    calculatedAt:{
        type:Date,
        default:Date.now
    }

});

module.exports = mongoose.model('Allowance',AllowanceSchema);