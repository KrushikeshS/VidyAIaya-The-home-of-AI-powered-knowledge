import React from "react";
import {Outlet, Link} from "react-router-dom";

// You'll style this CSS file in a moment
import "./Layout.css";

const Layout = () => {
  return (
    <div className="app-layout">
      <nav className="sidebar">
        <div className="sidebar-header">
          <h2>VidyAIaya</h2>
        </div>
        <ul className="sidebar-menu">
          <li>
            <Link to="/">Home (New Course)</Link>
          </li>
          <li>
            <Link to="/my-courses">My Courses</Link>
          </li>
        </ul>
      </nav>
      <main className="main-content">
        <Outlet /> {/* This is where your pages will render */}
      </main>
    </div>
  );
};

export default Layout;
