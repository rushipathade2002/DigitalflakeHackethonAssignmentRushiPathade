import React, { useState } from 'react';
import './AddCategory.css';
import axios from "axios";
import { toast } from "react-toastify";
import { FaUserCircle } from 'react-icons/fa';
import { Sidebar } from '../components/Sidebar';
import { useAuth } from './store/Auth';
import { useNavigate } from 'react-router-dom';


export const AddState = () => {

  const [category, setCategory] = useState({
    stateName:"",
    stateCode:"",
    status:"Active"
  });

  const { authorizationToken } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const toggleLogoutModal = () => {
    setShowLogoutModal(!showLogoutModal);
  };

  const handleInput= (e)=>(
    setCategory({
      ...category,
      [e.target.name]: e.target.value
    })
  )

  const handleSubmit = async (e) => {
    e.preventDefault();
    // API call to save the category    
        const response = await axios.post("http://localhost:5000/api/admin/save-state", category, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: authorizationToken
            }
        });
        const res_data = response.data;
        if( response.status == '201' ){
            toast.success("State Added successful");
            setCategory({
              stateName:"",
              stateCode:"",
              status:"Active"
            })
            navigate("/state")
        }else{
            toast.error(res_data.extraDetails ? res_data.extraDetails : res_data.message);
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
          <div className="add-category-page">
           <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <h2>Add State</h2>
                </div>
                
            </div>
           </div>
            <form onSubmit={handleSubmit} className="add-category-form">
              <div className="row">
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="categoryName">State Name</label>
                        <input
                            type="text"
                            id="stateName"
                            name='stateName'
                            value={category.stateName}
                            onChange={handleInput}
                            required
                        />
                    </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="categorySequence">State Code </label>
                    <input
                    type="text"
                    id="stateCode"
                    name='stateCode'
                    value={category.stateCode}
                    onChange={handleInput}
                    required
                    />
                  </div>
                </div>
              
              </div>
              
              <div className="form-buttons">
                <button type="button" className="cancel-button" onClick={() => window.history.back()}>Cancel</button>
                <button type="submit" className="save-button">Save</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {showLogoutModal && <LogoutModal toggleModal={toggleLogoutModal} />}
    </div>
  );
};

