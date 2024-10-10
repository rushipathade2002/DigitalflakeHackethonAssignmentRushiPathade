const City = require("../models/city-model");
const State = require("../models/state-model");
const Wearhouse = require("../models/wearhouse-model");


const getAllStates = async (req, res , next)=>{
    try {
        const states = await State.find({});
        if(!states || states.length === 0 ) {
            res.status(404).send({message:"States not Found"});
        }
        res.status(200).json(states)
    } catch (error) {
        console.log(error);
        next(error);
        
    }
}

const getAllCities = async(req, res, next)=>{
    try {
        const cities = await City.find({});
        if(!cities || cities.length === 0 ){
            res.status(404).send({message:"City not Found"});
        }
        res.status(200).json(cities)
    } catch (error) {
        next(error)
        console.log(error);
    }
}


const addState = async (req, res)=>{
    try {
        const { stateName, stateCode, status } = req.body;
        const addedState = await State.create({ stateName, stateCode, status });
        if(addedState){
            res.status(201).json({message:"State Added successfully", State:addedState});
        }
    } catch (error) {
        res.status(404).json({message: "page not found"});
    }   
}


const getStateById = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await State.findOne({_id:id});
        if(!data){
            res.status(404).send({message:"State not Found"});
        }
        return res.status(200).json(data)
    } catch (error) {
        res.status(404).json({message: error.message});
    }
}

const getCityById = async (req, res) => {
    try {
      const id = req.params.id;
      const data = await City.findById(id);
      if (!data) {
        return res.status(404).send({ message: "City not Found" });
      }
      return res.status(200).json(data);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  };


const updateStateById = async (req, res) => {
    try {
      const id = req.params.id; 
      const userData = req.body;
      const updateState = await State.updateOne({ _id: id }, { $set: userData });
      return res.status(200).json({ message: 'State updated successfully', updateState });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };


  const updateWearhouseById = async (req, res) => {
    try {
      const id = req.params.id;
      const userData = req.body;
      console.log(userData);
      const updateWearhouse = await Wearhouse.updateOne({ _id: id }, { $set: userData });
      return res.status(200).json({ message: 'Wearhouse updated successfully', updateWearhouse });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  

  const updateCityById = async (req, res) => {
    try {
      const id = req.params.id;
      const userData = req.body;      
      const updatedCity = await City.findByIdAndUpdate(id, userData, { new: true });
      return res.status(200).json({ message: 'City updated successfully', updatedCity });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  


//  City 
const addCity = async(req, res)=>{
    try {
        const { cityName, cityCode, stateName, status } = req.body;
        const newCity = {
            cityName,
            cityCode,
            stateName,
            status
        };
        const addedCity = await City.create(newCity);
        if (addedCity) {
        res.status(201).json({ message: "City added successfully", City: addedCity });
        } else {
        res.status(400).json({ message: "Failed to add City" });
        }
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error adding City' });
      }
}


// Product
const addWearhouse = async(req, res)=>{
    try {
        const { wearhouseName, cityName, stateName, status } = req.body;
        const newWearhouse = {
            wearhouseName,
            cityName,
            stateName,
            status
        };
        const addedWearhouse = await Wearhouse.create(newWearhouse);
        if (addedWearhouse) {
        res.status(201).json({ message: "Wearhouse added successfully", data: addedWearhouse });
        } else {
        res.status(400).json({ message: "Failed to add Wearhouse" });
        }
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error adding Wearhouse' });
      }
}


// get all products
const getAllWearhouses = async (req, res )=>{
    try {
        const Wearhouses = await Wearhouse.find({});
        if(!Wearhouses || Wearhouses.length === 0 ){
            res.status(404).send({message:"Wearhouse not Found"});
        }
        res.status(200).json(Wearhouses)
    } catch (error) {
        res.status(404).json({message: error.message});
    }
}

const getWearhouseById = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Wearhouse.findOne({_id:id});
        console.log(data)
        if(!data){
            res.status(404).send({message:"Wearhouse not Found"});
        }
        return res.status(200).json(data)
    } catch (error) {
        res.status(404).json({message: error.message});
    }
}

const deleteWearhouseById =async (req, res) => {
    try {
        const id = req.params.id;
        await Wearhouse.deleteOne({_id: id})
        res.status(200).json({message: "Wearhouse Deleted Successfully"});
    } catch (error) {
        console.error(error)
    }
}

// Category delete logic
const deleteStateById= async(req, res)=>{
    try {
        const id = req.params.id;
        await State.deleteOne({_id:id})
        res.status(200).json({message: "State Deleted Successfully"});
    } catch (error) {
        // next(error);
        console.error(error)
    }
}

const deleteCityById = async(req, res)=>{
    try {
        const id = req.params.id;
        await City.deleteOne({_id:id})
        res.status(200).json({message: "City Deleted Successfully"});
    } catch (error) {
        // next(error);
        console.error(error)
    }
}





module.exports = {
    getAllStates, 
    getAllWearhouses,
    getAllCities,
    getStateById,
    getWearhouseById,
    getCityById,
    addState,
    addCity,
    addWearhouse,
    deleteStateById,
    deleteWearhouseById, 
    deleteCityById,
    updateWearhouseById,
    updateStateById,
    updateCityById 
};