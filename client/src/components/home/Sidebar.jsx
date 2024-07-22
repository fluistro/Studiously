import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar(props) {

    async function logout() {
        await fetch(`http://localhost:5000/api/auth/logout`, {
            method: "DELETE",
            credentials: 'include'
        });
        props.setUser(undefined);
    }

    return (
        <div className="sidebar">
            <h3 className="sidebar-title">Studiously</h3>
            <NavLink to="/home" className="sidebar-item">Dashboard</NavLink>
            <NavLink to="/home/courses" className="sidebar-item">Courses</NavLink>
            <p>Currently logged in as: {props.user}</p>
            <button onClick={logout}>Log out</button>
        </div>
    );
}