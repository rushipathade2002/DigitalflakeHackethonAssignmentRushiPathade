import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrashAlt, FaUserCircle } from 'react-icons/fa';
import { FaMapLocationDot } from "react-icons/fa6";
import { Sidebar } from '../components/Sidebar';
import LogoutModal from '../components/LogoutModal';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { useAuth } from './store/Auth';

export const State = () => {
  const { authorizationToken } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCategories, setFilteredCategories] = useState([]);
  const URL = "http://localhost:5000/";

  const toggleLogoutModal = () => {
    setShowLogoutModal(!showLogoutModal);
  };

  useEffect(() => {
    getAllStates();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = categories.filter(state => 
        state.stateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        state.stateCode.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(categories);
    }
  }, [searchQuery, categories]);

  const getAllStates = async () => {
    setLoading(true);
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
        setFilteredCategories(data);
      } else {
        toast.error("Failed to fetch States");
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while fetching State");
      setLoading(false);
    }
  };

  const deleteStates = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/state/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: authorizationToken,
        }
      });
      const result = await response.json();
      if (!result) {
        toast.error(result.message);
      }
      toast.success("Deleted State Successfully");
      getAllStates();
    } catch (error) {
      console.log(error);
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
          <div className="category-page text-dark">
            <div className="container">
              <div className="row mb-3">
                <div className="col-md-3">
                <FaMapLocationDot size={30} />
                  <span className='pl-3 ' style={{fontSize:"2rem"}}>State</span>
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
                    {/* <button className="btn d-inline-block mr-5">
                      <IoSearchCircle size={30} className='' />
                    </button> */}
                </div>

                <div className="col-md-3">
                  <div className="header1">
                    <Link to="/add-state" className='add-category' style={{"border-radius":"10px"}}>Add New</Link>
                  </div>
                </div>
              </div>
            </div>
            <table className="category-table">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>State Name</th>
                  <th>State Code </th>
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
                  filteredCategories.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center", padding: "10px 0px 50px 0px", fontWeight: "bold" }}>No Data Found</td>
                    </tr>
                  ) : (
                    filteredCategories.map((states, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{states.stateName}</td>
                        <td>{states.stateCode}</td>
                        <td className={states.status === 'Active' ? 'status-active' : 'status-inactive'}>{states.status}</td>
                        <td>
                          <button className="action-btn" onClick={() => navigate(`/edit-state/${states._id}`)}>
                            <FaEdit />
                          </button>
                          <button className="btn btn-danger" onClick={() => {
                            if (window.confirm("Are you sure you want to Delete")) {
                              deleteStates(states._id);
                            }
                          }}><FaTrashAlt />
                          </button>
                        </td>
                      </tr>
                    ))
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {showLogoutModal && <LogoutModal toggleModal={toggleLogoutModal} />}
    </div>
  );
};
