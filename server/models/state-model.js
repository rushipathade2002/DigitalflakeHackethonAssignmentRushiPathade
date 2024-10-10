const { Schema, model} = require("mongoose");

const stateSchema = new Schema({
    stateName : {type:String, required:true},
    stateCode : {type:String, required:true},
    status : {type:String, required:true}
},
{
    timestamps:true,
});

const State = new model ("State", stateSchema);

module.exports = State;