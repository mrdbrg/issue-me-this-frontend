import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../resources/SideBar.css';

const SideBar = (props) => {
  return (
    <div className={`ui vertical inverted overlay left animating sidebar menu ${props.toggleMenu ? 'visible' : 'hidden'}`}>
      {props.currentUser ? (
        <>
          <Link to="/login" className="item" onClick={props.handleLogout}>
            Logout
            <i className="large sign-out alternate icon"></i>
          </Link>  
          <Link to="/issues/new" className="item">
            New Issue
            <i className="large pen square icon"></i>
          </Link>     
        </>
        ) : (
        <>
          <Link to="/signup" className="item">
            Signup
            <i className="large write square icon"></i>
          </Link>
          <Link to="/login" className="item">
            Login
            <i className="large sign-in alternate icon"></i>
          </Link>
        </>
      )}

      <Link to="/issues" className="item">
        Issues
        <i className="large list alternate outline icon"></i>
      </Link>
      <Link to="/users" className="item">
        Users
        <i className="large users icon"></i>
      </Link>
    </div>
  );
}

export default SideBar;