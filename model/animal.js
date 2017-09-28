'use strict';

const mongoose = require('mongoose');

const animalSchema = mongoose.Schema({
    name : {
        type: String , 
        required : true, 
        unique : true,
    },
    species : {
        type : String, 
        required : true, 
        unique : false,
    },
    favoriteFood : {
        type:String, 
        required: false, 
        default: '' ,
    },
    timestamp : {
        type: Date, 
        default : new Date(),
    },
});

module.exports = mongoose.model('animal', animalSchema);