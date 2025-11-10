import React from "react";
import {Outlet, Link} from "react-router-dom";
import {useAuth0} from "@auth0/auth0-react";
import "./Layout.css";

const Layout = () => {
  const {isAuthenticated, user, loginWithRedirect, logout} = useAuth0();

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
          {isAuthenticated && ( // <-- Only show if logged in
            <li>
              <Link to="/my-courses">My Courses</Link>
            </li>
          )}
        </ul>
        <div className="sidebar-footer">
          {isAuthenticated ? (
            <div className="user-profile">
              <img src={user.picture} alt={user.name} className="user-avatar" />
              <span className="user-name">{user.name}</span>
              <button
                onClick={() =>
                  logout({logoutParams: {returnTo: window.location.origin}})
                }
                className="auth-button"
              >
                Log Out
              </button>
            </div>
          ) : (
            <button onClick={() => loginWithRedirect()} className="auth-button">
              Log In
            </button>
          )}
        </div>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
