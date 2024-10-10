import React, { useEffect, useState } from 'react';
import './AddCity.css';
import { FaUserCircle } from 'react-icons/fa';
import { Sidebar } from '../components/Sidebar';
import LogoutModal from '../components/LogoutModal';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './store/Auth';
import axios from 'axios';



export const AddWearhouse = () => {
  const navigate = useNavigate();
  const { authorizationToken } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [ categories, setCategories ] = useState([]);  //store state
  const [ cities, setCities] = useState([]);  //store city
  const [product, setProduct] = useState({
    wearhouseName:"",
    cityName:"",
    stateName:"",
    status:"Active",
  });


  const toggleLogoutModal = () => {
    setShowLogoutModal(!showLogoutModal);
  };

  const handleInputChange = (e) => (
    setProduct({
      ...product,
      [e.target.name]: e.target.value
    })
  );

  useEffect(()=>{
        getAllCities();
        getAllStates();
    },[]);

    const getAllCities = async()=>{
        const response = await fetch("http://localhost:5000/api/admin/cities", {
                method:"GET",
                headers:{
                    "Content-Type":"application/json",
                    Authorization : authorizationToken
                },
            });
            const data = await response.json();
              if(response.ok){
                setCities(data); 
              }              
    }

    const getAllStates = async()=>{
      const response = await fetch("http://localhost:5000/api/admin/states", {
             method:"GET",
             headers:{
                 "Content-Type":"application/json",
                 Authorization : authorizationToken
             },
         });
         const data = await response.json();
           if(response.ok){
             setCategories(data); 
           }           
 }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(product);
    try {
      const response = await axios.post("http://localhost:5000/api/admin/save-wearhouse", product, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: authorizationToken
      }
      });
  
      const res_data = await response.data;
      if (res_data) {
        toast.success("Wearhouse added successfully");
        setProduct({
          wearhouseName:"",
          cityName:"",
          stateName:"",
          status:"Active",
        });
        navigate("/wearhouse");
      } else {
        toast.error(res_data.message || "Add failed");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while adding the Wearhouse");
    }

  };

  return (
    <div className="app">
      <Sidebar />
      <div className="main-content">
        <header className="header">
          <div className="logo"></div>
          <div className="user-icon" onClick={toggleLogoutModal}>
            <FaUserCircle size={40} style={{"backgroundColor":"white", border:"2px solid white","borderRadius":"50%"}} />
          </div>
        </header>
        <div className="content">
        <div className="add-sub-category-container">
            <div className="container">
                <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-12">
                        <h2> Add Wearhouse </h2>
                    </div>
                    <div className="col-md-12"></div>

                    <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="wearhouseName">Wearhouse Name</label>
                      <input
                        type="text"
                        placeholder="Enter Wearhouse Name"
                        id="wearhouseName"
                        name='wearhouseName'
                        value={product.wearhouseName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                    <div className="col-md-6">
                    <div className="form-group">
                      <label>City</label>
                      <select
                        id="cityName"
                        name="cityName"
                        value={product.cityName}
                        onChange={handleInputChange}
                      >
                        <option value="">Select City Name</option>
                        {
                          cities.length === 0 ? (
                            <option value="">City Not Found</option>
                          ) : (
                            cities.map((city, index) => (
                              <option value={city.cityName} key={index}>{city.cityName}</option>
                            ))
                          )
                        }
                      </select>
                    </div>
                  </div>


                  <div className="col-md-6">
                    <div className="form-group">
                      <label>State</label>
                      <select
                        id="stateName"
                        name="stateName"
                        value={product.stateName}
                        onChange={handleInputChange}
                      >
                        <option value="">Select State Name</option>
                        {
                          categories.length === 0 ? (
                            <option value="">State Not Found</option>
                          ) : (
                            categories.map((states, index) => (
                              <option value={states.stateName} key={index}>{states.stateName}</option>
                            ))
                          )
                        }
                      </select>
                    </div>
                  </div>

                  <div className="col-md-12">
                  <div className="form-buttons p-5">
                        <button type="button" className="cancel-button" onClick={() => window.history.back()}>Cancel</button>
                        <button type="submit" className="save-button">Save</button>
                    </div>
                  </div>

                  
                    </div>
                    </form>
                    </div>
                

            </div>
        </div>
        </div>
        {showLogoutModal && <LogoutModal toggleModal={toggleLogoutModal} />}
      </div>
    
    
  );
};


