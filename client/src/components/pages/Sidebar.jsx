import React from "react";
import { NavLink } from "react-router-dom";
import { logout } from "../../connection/authentication";
import "./Sidebar.css";


/**
 * Sidebar component.
 * 
 * Expects username and a function to log out on the frontend (set state).
 */
export default function Sidebar({ username, resetUser }) {

    // Send request to delete user session
    async function handleLogout() {
        await logout();
        resetUser(); // Log out on client side as well
    }

    return (
        <div className="sidebar">

            <div className="sidebar-top">

                <h3 className="sidebar-title">Studiously</h3>

                <div><NavLink to="/home" className="sidebar-item">Dashboard</NavLink></div>
                <NavLink to="/home/courses" className="sidebar-item">Courses</NavLink>

            </div>

            <div className="sidebar-bottom">
                <p>Currently logged in as: {username}</p>
                <button className="red-button" onClick={handleLogout}>Log out</button>
            </div>

        </div>
    );
}