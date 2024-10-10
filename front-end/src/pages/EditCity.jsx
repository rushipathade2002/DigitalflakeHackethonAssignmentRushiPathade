import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Sidebar } from '../components/Sidebar';
import './EditCategory.css';
import { toast } from "react-toastify";
import { FaUserCircle } from 'react-icons/fa';
import LogoutModal from '../components/LogoutModal';
import { useAuth } from './store/Auth';

export const EditCity = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authorizationToken } = useAuth();
  const [categories, setCategories] = useState([]);
  const [subCategory, setSubCategory] = useState({
    cityName : "",
    cityCode : "",
    stateName: "",
    status: "Active"
  });
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const URL_BASE = "http://localhost:5000/";

  useEffect(() => {
    getAllStates();
    getCityById();
  }, []);

  const getAllStates = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/admin/states", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorizationToken
        },
      });
      const data = await response.json();
      if (response.ok) {
        setCategories(data);
      }      
    } catch (error) {
      console.error("There was an error fetching the State!", error);
    }
  };

  const getCityById = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/city/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorizationToken
        },
      });
      const data = await response.json();
      if (response.ok) {
        setSubCategory(data);
      }
    } catch (error) {
      console.error("There was an error fetching the City data!", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
      setSubCategory({ 
        ...subCategory, 
        [name]: value 
      });
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('cityName', subCategory.cityName);
    formData.append('cityCode', subCategory.cityCode);
    formData.append('stateName', subCategory.stateName);
    formData.append('status', subCategory.status);
  
    try {
      const response = await axios.patch(`http://localhost:5000/api/admin/city/update/${id}`, formData,{
        headers: {
          'Content-Type': 'application/json',
          Authorization: authorizationToken
      } 
    });
    const res_data = await response.data;            
      if (response.status == 200) {
        toast.success("City updated successfully");
        setSubCategory({
          cityName : "",
          cityCode : "",
          stateName: "",
          status: "Active"
        });
        navigate("/city");
      } else {
        toast.error(res_data.message || "Update failed");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while updating the City");
    }
  };

  const toggleLogoutModal = () => {
    setShowLogoutModal(!showLogoutModal);
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
          <div className="edit-category-page">
            <h2>Edit City</h2>
            <div className="container">
              <form onSubmit={handleSubmit} className="edit-category-form">
                <div className="row">
                  <div className="col-md-12"></div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>State</label>
                      <select
                        id="state"
                        name="stateName"
                        value={subCategory.stateName}
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

                  <div className="col-md-6">
                    <div className="form-group">
                      <label>City Name</label>
                      <input
                        type="text"
                        id="cityName"
                        name='cityName'
                        value={subCategory.cityName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>City Code</label>
                      <input
                        type="text"
                        id="cityCode"
                        name='cityCode'
                        value={subCategory.cityCode}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="status">Status</label>
                      <select
                        id="status"
                        name="status"
                        value={subCategory.status}
                        onChange={handleInputChange}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="form-buttons">
                      <button type="button" className="cancel-button" onClick={() => window.history.back()}>Cancel</button>
                      <button type="submit" className="save-button">Update</button>
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
