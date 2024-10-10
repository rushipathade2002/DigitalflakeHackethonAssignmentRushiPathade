const {Schema, model } = require ('mongoose');

const wearhouseSchema = new Schema({
    wearhouseName:{type:String, required:true},
    cityName:{type:String, required:true},
    stateName:{type:String, required:true},
    status:{type:String, required:true},
},
{
    timestamps:true,
});

// create a model or a Collection
const Wearhouse = new model('Wearhouse', wearhouseSchema);

module.exports= Wearhouse;