import React, { useState, useEffect } from 'react';
import { Link, useNavigate,  } from 'react-router-dom';
import axios from 'axios';
import { Sidebar } from '../components/Sidebar';
import './SubCategory.css';
import { toast } from "react-toastify";
import { FaUserCircle, FaTrashAlt, FaEdit, FaList, FaCity } from 'react-icons/fa';
import LogoutModal from '../components/LogoutModal';
import { useAuth } from './store/Auth';



export const City = () => {
  const history = useNavigate();
  const { authorizationToken } = useAuth();
  const [subCategories, setSubCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const URL = "http://localhost:5000/"


  useEffect(()=>{
    getAllCities();
    },[]);

    useEffect(() => {
      if (searchQuery) {
        const filtered = subCategories.filter(city => 
          city.status.toLowerCase().includes(searchQuery.toLowerCase()) || 
          city.cityName.toLowerCase().includes(searchQuery.toLowerCase()) || 
          city.stateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          city.cityCode.toLowerCase().includes(searchQuery.toLowerCase())
        );

        setFilteredSubCategories(filtered);
      } else {
        setFilteredSubCategories(subCategories);
      }
    }, [searchQuery, subCategories]);

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
                setSubCategories(data);
                setFilteredSubCategories(data) 
              }
              setLoading(false) 
    }

  const toggleLogoutModal = () => {
    setShowLogoutModal(!showLogoutModal);
  };


  const deleteCity=async (id)=>{
    try {
      const response = await fetch(`http://localhost:5000/api/admin/city/delete/${id}`,{
            method:"DELETE",
            headers:{
                    "Content-Type":"application/json",
                    authorization:authorizationToken,
                    }
            });
            if(!response.success) {
                  toast.error(response.message);
                }
                getAllCities();
                toast.success("Deleted City Successfully");                                   
    } catch (error) {
        console.log(error);
    }
  }


  return (
    <>
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
          <div className="container">
          <div className="subcategory-page">
            <div className="container">
                <div className="row">
                <div className="col-md-3">
                <FaCity size={30} />
                  <span className='pl-3 ' style={{fontSize:"1.7rem", "fontWeight":"bold"}}>City</span>
                </div>
                  <div className="col-md-6">
                      <input
                        type="text"
                        name="searchQueries"
                        placeholder="Search here...."
                        className="form-control w-75 d-inline-block"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                  </div>

                    <div className="col-md-3 d-flex justify-content-end">
                        <Link to="/add-city" className="add-subcategory-button " style={{color:'white'}}>Add New</Link>
                    </div>
                </div>
            </div>
            <table className="subcategory-table table-hover table-active">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>City Name</th>
                  <th>City Code</th>
                  <th>State Name</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {
                loading ? (
                    <tr>
                      <td colSpan="6">Loading...</td>
                    </tr>
                  ) : (
                    filteredSubCategories.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{"textAlign":"center","padding":"10px 0px 50px 0px ", "fontWeight":"bold"}}>No Data Found</td>
                    </tr>
                    ) : (
                      filteredSubCategories.map((subCategory, index) => (
                  <tr key={index}>
                    <td>{index+1}</td>
                    <td>{subCategory.cityName}</td>
                    <td>{subCategory.cityCode}</td>
                    <td>{subCategory.stateName}</td>
                    <td className={subCategory.status === 'Active' ? 'status-active' : 'status-inactive'}>{subCategory.status}</td>
                    <td>
                        <button className="action-btn btn-success" onClick={() => history(`/edit-city/${subCategory._id}`)}>
                            <FaEdit />
                        </button>
                        <button className="btn btn-danger" 
                                    onClick={()=>{
                                        if(window.confirm("Are you sure you want to Delete")){
                                                  deleteCity(subCategory._id);    
                                    }
                              } }> <FaTrashAlt />
                        </button>
                    </td>
                  </tr>
                            )   )
                        )
                    )
                }
              </tbody>
            </table>
          </div>
        </div>
        </div>
      </div>

      {showLogoutModal && <LogoutModal toggleModal={toggleLogoutModal} />}
      
    </div>
    </>
  );
};
