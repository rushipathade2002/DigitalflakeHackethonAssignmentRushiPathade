import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaBox, FaEdit, FaTrashAlt, FaUserCircle } from 'react-icons/fa';
import { Sidebar } from '../components/Sidebar';
import LogoutModal from '../components/LogoutModal';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { useAuth } from './store/Auth';
import { GiFamilyHouse } from 'react-icons/gi';


export const Wearhouse = () => {
  const {  authorizationToken } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProduct, setFilteredProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const URL = "http://localhost:5000/"


  const toggleLogoutModal = () => {
    setShowLogoutModal(!showLogoutModal);
  };

  useEffect(()=>{
    getAllWearhouses();
  },[]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = product.filter(Wearhouse => 
        Wearhouse.wearhouseName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        Wearhouse.stateName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        Wearhouse.cityName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProduct(filtered);
    } else {
      setFilteredProduct(product);
    }
  }, [searchQuery, product]);

const getAllWearhouses = async()=>{
     const response = await fetch("http://localhost:5000/api/admin/wearhouses",{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                Authorization : authorizationToken
            },
        });

        const data = await response.json();
          if(response.ok){
            setProduct(data);
            setFilteredProduct(data) 
          }
            setLoading(false)    
}


    const deleteWearhouse=async (id)=>{
      try {
        const response = await fetch(`http://localhost:5000/api/admin/wearhouse/delete/${id}`,{
              method:"DELETE",
              headers:{
                      "Content-Type":"application/json",
                      authorization:authorizationToken,
                      }
                  });
              if(!response.success) {
                    toast.error(response.message);
                  }
                  getAllWearhouses();
                  toast.success("Deleted Wearhouse Successfully");                                   
      } catch (error) {
          console.log(error);
      }
    }

  return (
    <div className="app">
      <Sidebar />
      <div className=" main-content">
        <header className="header">
          <div className="logo"></div>
          <div className="user-icon" onClick={toggleLogoutModal}>
            <FaUserCircle size={40} style={{"backgroundColor":"white", border:"2px solid white","borderRadius":"50%"}} />
          </div>
        </header>
        <div className="content">
          <div className="category-page">
            <div className="header1">
            <div className="container">
              <div className="row">
                <div className="col-md-3">
                <GiFamilyHouse size={30} />
                  <span className='pl-3 ' style={{fontSize:"2rem"}}>Wearhouse</span>
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
                <div className="col-md-3">
                  <Link to="/add-wearhouse" className='add-category' style={{"border-radius":"10px"}}>Add New</Link>
                </div>
              </div>
            </div>
              
            </div>
            <table className="category-table">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Wearhouse name</th>
                  <th>City</th>
                  <th>State</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6">Loading...</td>
                  </tr>
                ) : (
                  filteredProduct.length === 0 ? ( 
                  <tr>
                    <td colSpan="6" style={{"textAlign":"center","padding":"10px 0px 50px 0px ", "fontWeight":"bold"}}>No Data Found</td>
                  </tr>
                  ) : (
                    filteredProduct.map(( wearhouse,index ) => (
                    <tr key={ index }>
                      <td>{ index+1 }</td>
                      <td>{ wearhouse.wearhouseName }</td>
                      <td>{ wearhouse.cityName }</td>
                      <td>{ wearhouse.stateName }</td>
                      <td className={ wearhouse.status === 'Active' ? 'status-active' : 'status-inactive' }>{ wearhouse.status }</td>
                      <td>
                          <button className="btn btn-success ml-1" onClick={() => navigate(`/edit-wearhouse/${wearhouse._id}`)}>
                              <FaEdit />
                          </button>
                          <button className="btn btn-danger ml-3" 
                                      onClick={()=>{
                                          if(window.confirm("Are you sure you want to Delete")){
                                                    deleteWearhouse(wearhouse._id);    
                                      }
                                } }> <FaTrashAlt />
                          </button>
                      </td>
                      
                    </tr>
                  ))
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {showLogoutModal && <LogoutModal toggleModal={toggleLogoutModal} />}
    </div>
  );
};

