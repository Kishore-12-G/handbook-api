const mongoose = require('mongoose');
const {v4:uuidv4} = require('uuid');

const TodoSchema = new mongoose.Schema({
    todoId:{
        type:String,
        default:uuidv4,
        unique:true
    },
    userId:{
        type:String,
        required:true
    },
    activity:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:['pending','in-progress','completed'],
        default:'pending'
    },
    priority:{
        type:String,
        enum:['low','medium','high'],
        default:'medium'
    },
    dueDate:{
        type:String
    },
    createdAt:{
        type:String,
        default: () => new Date().toISOString()
    },
    updatedAt:{
        type:String,
        default: () => new Date().toISOString()
    }

});

TodoSchema.pre('save',function(next){
    this.updatedAt = new Date().toDateString();
    next();
});

module.exports = mongoose.model('Todo',TodoSchema);