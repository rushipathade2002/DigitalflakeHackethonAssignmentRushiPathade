const {Schema, model } = require ('mongoose');

const citiesSchema = new Schema({
    cityName:{type:String, required:true},
    cityCode:{type:String, required:true},
    stateName:{type:String, required:true},
    status:{type:String, required:true},
},
{
    timestamps:true,
});

// create a model or a Collection
const  City = new model('City', citiesSchema);

module.exports= City;