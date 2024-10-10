// Sidebar.js
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IoHome } from "react-icons/io5";
import logo from "../assets/imges/logo1.png";
import './Sidebar.css';
import { FaMapLocationDot } from 'react-icons/fa6';
import { FaCity } from "react-icons/fa";
import { GiFamilyHouse } from "react-icons/gi";



export const Sidebar = () => {
  const location = useLocation();
  const [activeMenuItem, setActiveMenuItem] = useState(location.pathname);

  const handleMenuItemClick = (path) => {
    setActiveMenuItem(path);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-logo pt-3 mt-0 mb-4" style={{"color":"white","backgroundColor":"#630460"}}><img src={logo} alt="logo" className='p-0 mt-0' height={30} width={150} /></div>
      <ul className="sidebar-menu">
        <li className={`menu-item ${activeMenuItem === '/Home' ? 'active' : ''}`}>
          <Link to="/Home" onClick={() => handleMenuItemClick('/Home')}>
          <IoHome />
          <span>Home</span>
          </Link>
        </li>
        <li className={`menu-item ${activeMenuItem === '/state' ? 'active' : ''}`}>
          <Link to="/state" onClick={() => handleMenuItemClick('/state')}>
          <FaMapLocationDot size={20} />
            <span>State</span>
          </Link>
        </li>
        <li className={`menu-item ${activeMenuItem === '/city' ? 'active' : ''}`}>
          <Link to="/city" onClick={() => handleMenuItemClick('/city')}>
          <FaCity />
            <span>City</span>
          </Link>
        </li>
        <li className={`menu-item ${activeMenuItem === '/wearhouse' ? 'active' : ''}`}>
          <Link to="/wearhouse" onClick={() => handleMenuItemClick('/wearhouse')}>
          <GiFamilyHouse />
            <span>Wearhouse</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

