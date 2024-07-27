import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./Home.css";

export default function Home() {

    // Username and user id of current user
    const [user, setUser] = useState();

    // Set current user on first render
    useEffect(() => {
        fetch("http://localhost:5000/api/auth/", { credentials: 'include' })
            .then(res => res.json())
            .then(data => setUser(data));
    }, []);

    return user ? (
        <div className="home-background">
            <Sidebar user={user.username} setUser={setUser} />
            <Outlet user_id={user.user_id}/>
        </div>
    ) : <p>Please <a href="/login">log in</a></p>;

};
