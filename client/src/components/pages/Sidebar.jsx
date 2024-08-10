import React from "react";
import { NavLink } from "react-router-dom";
import { logout } from "../../connection/authentication";


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

            <h3 className="sidebar-title">Studiously</h3>

            <NavLink to="/home" className="sidebar-item">Dashboard</NavLink>
            <NavLink to="/home/courses" className="sidebar-item">Courses</NavLink>

            <p>Currently logged in as: {username}</p>
            <button onClick={handleLogout}>Log out</button>

        </div>
    );
}