import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from "react-toastify";
import { Sidebar } from '../components/Sidebar';
import './EditCategory.css';
import { FaUserCircle } from 'react-icons/fa';
import LogoutModal from '../components/LogoutModal';
import { useAuth } from './store/Auth';

export const EditWearhouse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const { authorizationToken } = useAuth();
  const [product, setProduct] = useState({
    wearhouseName: "",
    cityName: "",
    stateName: "",
    status: "Active"
  });
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const URL_BASE = "http://localhost:5000/";

  useEffect(() => {
    getWearhouseById();
    getAllCities();
    getAllStates();
  }, []);

  const getAllCities = async () => {
    const response = await fetch("http://localhost:5000/api/admin/cities", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: authorizationToken
      },
    });
    const data = await response.json();
    if (response.ok) {
      setSubCategories(data);
    }
  };

  const getAllStates = async () => {
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
  };

  const getWearhouseById = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/wearhouse/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorizationToken
        },
      });
      const data = await response.json();
      if (response.ok) {
        setProduct(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (e) => (
    setProduct({
      ...product,
      [e.target.name]: e.target.value
    })
  );


  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('wearhouseName', product.wearhouseName);
    formData.append('cityName', product.cityName);
    formData.append('stateName', product.stateName);
    formData.append('status', product.status);

    try {
      const response = await axios.patch(`http://localhost:5000/api/admin/wearhouse/update/${id}`, formData,{
        headers: {
          'Content-Type': 'application/json',
          Authorization: authorizationToken
      } 
    });

    const res_data = await response.data;            
    if (response.status == 200) {
        toast.success("Wearhouse updated successfully");
        setProduct({
          wearhouseName: "",
          cityName: "",
          stateName: "",
          status: "Active"
        });
        navigate("/wearhouse");
      } else {
        toast.error(res_data.message || "Update failed");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while updating the Wearhouse");
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
            <h2>Edit Wearhouse </h2>
            <div className="container">
              <form onSubmit={handleSubmit} className="edit-category-form">
                <div className="row">
                  <div className="col-md-12"></div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="wearhouseName">Wearhouse Name</label>
                      <input
                        type="text"
                        placeholder="Enter wearhouse Name"
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
                          subCategories.length === 0 ? (
                            <option value="">City Not Found</option>
                          ) : (
                            subCategories.map((cities, index) => (
                              <option value={cities.cityName} key={index}>{cities.cityName}</option>
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
                        id="state"
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

                  

                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="status">Status</label>
                      <select
                        id="status"
                        name="status"
                        value={product.status}
                        onChange={handleInputChange}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-buttons">
                    <button type="button" className="cancel-button" onClick={() => window.history.back()}>Cancel</button>
                    <button type="submit" className="save-button">Update</button>
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
