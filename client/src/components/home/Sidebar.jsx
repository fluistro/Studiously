import React from "react";
import { NavLink } from "react-router-dom";
import { logout } from "../../connection/authentication";

export default function Sidebar(props) {

    // Send request to delete user session
    async function handleLogout() {
        await logout();
        props.setUser(undefined);
    }

    return (
        <div className="sidebar">
            <h3 className="sidebar-title">Studiously</h3>
            <NavLink to="/home" className="sidebar-item">Dashboard</NavLink>
            <NavLink to="/home/courses" className="sidebar-item">Courses</NavLink>
            <p>Currently logged in as: {props.username}</p>
            <button onClick={handleLogout}>Log out</button>
        </div>
    );
}