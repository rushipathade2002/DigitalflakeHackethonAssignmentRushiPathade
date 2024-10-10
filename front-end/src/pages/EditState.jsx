import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import './EditCategory.css';
import { toast } from "react-toastify";
import { FaUserCircle } from 'react-icons/fa';
import LogoutModal from '../components/LogoutModal';
import { useAuth } from './store/Auth';
import axios from 'axios';

export const EditState = () => {
  const { id } = useParams();
  const { authorizationToken } = useAuth();
  const navigate = useNavigate();
  const [category, setCategory] = useState({
    stateName : '',
    stateCode : '',
    status : 'Active'
  });
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const URL_BASE = "http://localhost:5000/";

  useEffect(() => {
    getStateById();
  }, []);

  const getStateById = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/state/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorizationToken
        },
      });
      const data = await response.json();
      if (response.ok) {
        setCategory(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (e) => (
    setCategory({
      ...category,
      [e.target.name]: e.target.value
    })
  );


  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('stateName ', category.stateName );
    formData.append('stateCode ', category.stateCode );
    formData.append('status', category.status );
    try {
      const response = await axios.patch(`http://localhost:5000/api/admin/state/update/${id}`, formData,{
        headers: {
          'Content-Type': 'application/json',
          Authorization: authorizationToken
      } 
    });
      const res_data = await response.data;      
      if (response.status == 200) {
        toast.success("State updated successfully");
        setCategory({
          stateName : "",
          stateCode : "",
          status: "Active",
        });
        navigate("/state");
      } else {
        toast.error(res_data.message || "Update failed ");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while updating the State");
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
            <h2> Edit State </h2>
            <div className="container">
              <form onSubmit={ handleSubmit } className="edit-category-form" encType="multipart/form-data">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="name"> State Name </label>
                      <input
                        type="text"
                        id="name"
                        name="stateName"
                        value={category.stateName}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="stateCode">State Code</label>
                      <input 
                        type="text"
                        id="stateCode"
                        name="stateCode"
                        value={category.stateCode}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="status">Status</label>
                      <select
                        id="status"
                        name="status"
                        value={category.status}
                        onChange={handleInputChange}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="form-actions">
                      <button type="button" className="cancel-button" onClick={() => navigate('/state')}>Cancel</button>
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
