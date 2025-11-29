import React from "react";
import {Outlet, Link, useLocation} from "react-router-dom";
import {useAuth0} from "@auth0/auth0-react";
import {Home, BookOpen, LogOut, LogIn, User, Zap, Trophy} from "lucide-react";
import {useGamification} from "../context/GamificationContext";
import "./Layout.css";

const Layout = () => {
  const {isAuthenticated, user, loginWithRedirect, logout} = useAuth0();
  const location = useLocation();
  const {xp, streak, level} = useGamification();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="app-layout">
      <nav className="sidebar">
        <div className="sidebar-header">
          <h2>VidyAIaya</h2>
        </div>

        {isAuthenticated && (
          <div className="user-stats">
            <div className="stat-item" title="Daily Streak">
              <Zap size={20} color="var(--accent)" fill="var(--accent)" />
              <span>{streak}</span>
            </div>
            <div className="stat-item" title="Total XP">
              <Trophy size={20} color="var(--secondary)" />
              <span>{xp} XP</span>
            </div>
            <div className="stat-item" title="Current Level">
              <span style={{fontWeight: 800, color: "var(--primary)"}}>Lvl {level}</span>
            </div>
          </div>
        )}

        <ul className="sidebar-menu">
          <li>
            <Link 
              to="/" 
              className={isActive("/") ? "active" : ""}
              style={{ color: isActive("/") ? "var(--secondary)" : "var(--text-light)", borderColor: isActive("/") ? "var(--secondary)" : "transparent", backgroundColor: isActive("/") ? "var(--bg-offset)" : "transparent" }}
            >
              <Home size={24} style={{ marginRight: "12px" }} />
              New Course
            </Link>
          </li>
          {isAuthenticated && (
            <li>
              <Link 
                to="/my-courses"
                className={isActive("/my-courses") ? "active" : ""}
                style={{ color: isActive("/my-courses") ? "var(--secondary)" : "var(--text-light)", borderColor: isActive("/my-courses") ? "var(--secondary)" : "transparent", backgroundColor: isActive("/my-courses") ? "var(--bg-offset)" : "transparent" }}
              >
                <BookOpen size={24} style={{ marginRight: "12px" }} />
                My Courses
              </Link>
            </li>
          )}
        </ul>
        <div className="sidebar-footer">
          {isAuthenticated ? (
            <div className="user-profile">
              <img src={user.picture} alt={user.name} className="user-avatar" />
              <div style={{ flexGrow: 1 }}>
                <span className="user-name">{user.name}</span>
                <button
                  onClick={() =>
                    logout({logoutParams: {returnTo: window.location.origin}})
                  }
                  className="btn-text"
                  style={{ 
                    background: "none", 
                    border: "none", 
                    color: "var(--text-light)", 
                    cursor: "pointer", 
                    padding: 0,
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    marginTop: "4px"
                  }}
                >
                  <LogOut size={16} style={{ marginRight: "6px" }} />
                  Log Out
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => loginWithRedirect()} className="auth-button">
              <LogIn size={20} style={{ marginRight: "8px" }} />
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
