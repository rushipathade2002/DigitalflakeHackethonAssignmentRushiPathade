const express = require("express");
const multer = require("multer");
const path = require("path");
const { 
        getAllStates,getAllCities, getAllWearhouses, addWearhouse, getWearhouseById, 
        getStateById, updateStateById, getCityById, deleteWearhouseById, 
        deleteStateById, deleteCityById, addState, addCity, 
        updateWearhouseById, updateCityById 
    } = require("../controllers/admin-controller");
const authMiddleware = require("../middlewares/auth-middleware");
const adminMiddleware = require("../middlewares/admin-middleware");

const router = express.Router();


// States API
router.route("/save-state").post(authMiddleware,adminMiddleware, addState);
router.route("/states").get(authMiddleware,adminMiddleware,  getAllStates);
router.route("/state/delete/:id").delete(authMiddleware,adminMiddleware, deleteStateById);
router.route("/state/:id").get(authMiddleware,adminMiddleware, getStateById);
router.route("/state/update/:id").patch(authMiddleware,adminMiddleware, updateStateById);



// // City API
router.route("/save-city").post(authMiddleware,adminMiddleware, addCity);
router.route("/cities").get(authMiddleware,adminMiddleware,  getAllCities);
router.route("/city/delete/:id").delete(authMiddleware, adminMiddleware, deleteCityById);
router.route("/city/:id").get(authMiddleware, adminMiddleware, getCityById );
router.route("/city/update/:id").patch(authMiddleware, adminMiddleware, updateCityById);



// // Wearhouse API
router.route("/save-wearhouse").post(authMiddleware,adminMiddleware, addWearhouse);
router.route("/wearhouses").get(authMiddleware,adminMiddleware,  getAllWearhouses);
router.route("/wearhouse/delete/:id").delete(authMiddleware, adminMiddleware, deleteWearhouseById);
router.route("/wearhouse/:id").get(authMiddleware, adminMiddleware, getWearhouseById);
router.route("/wearhouse/update/:id").patch(authMiddleware, adminMiddleware, updateWearhouseById);




module.exports = router;