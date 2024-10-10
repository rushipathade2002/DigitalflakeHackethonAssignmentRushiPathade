import React, { useEffect, useState } from 'react';
import './AddCity.css';
import { FaUserCircle } from 'react-icons/fa';
import { Sidebar } from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './store/Auth';
import LogoutModal from '../components/LogoutModal';
import { toast } from 'react-toastify';
import axios from 'axios';

export const AddCity = () => {
  const [subCategory, setSubCategory] = useState({
          cityName: "",
          cityCode: "",
          stateName: "",
          status: "Active"
      });
  const [states1, setStates1] = useState([]);
  const { authorizationToken } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    getAllStates();
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
        setStates1(data);
      }      
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (e) => (
    setSubCategory({
      ...subCategory,
      [e.target.name]: e.target.value
    })
  );


  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
      const response = await axios.post("http://localhost:5000/api/admin/save-city", subCategory, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: authorizationToken
        }
    });
    const res_data = await response.data;      
      if(res_data){
        toast.success("City Added Successfully");
        setSubCategory({
          cityName:"",
          cityCode:"",
          stateName:"",
          status:"Active"
        });
        navigate("/city");
      }else{
        toast.error(res_data.message || "Add failed");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while adding the City");
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
          <div className="add-sub-category-page">
            <div className="container">
              <form onSubmit={handleSubmit} className="add-sub-category-form" encType="multipart/form-data">
                <div className="row">
                  <div className="col-md-12 pb-4">
                    <h2>Add City</h2>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label>State Name</label>
                      <select
                        id="state"
                        name="stateName"
                        value={states1.stateName}
                        onChange={handleInputChange}
                      >
                        <option value="">Select State Name</option>
                        {
                          states1.length === 0 ? (
                            <option value="">State Not Found</option>
                          ) : (
                            states1.map((state, index) => (
                              <option value={state.stateName} key={index}>{state.stateName}</option>
                            ))
                          )
                        }
                      </select>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="cityName">City Name</label>
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

                  <div className="col-md-12">
                    <div className="form-actions">
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
