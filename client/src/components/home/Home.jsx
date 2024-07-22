import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";


export default function Home() {

    // Username and user id of current user
    const [user, setUser] = useState();

    // Set current user on first render
    useEffect(() => {
        console.log("home useEffect");
        fetch("http://localhost:5000/api/auth/", { credentials: 'include' })
            .then(res => res.json())
            .then(data => setUser(data));
    }, []);

    return user ? (
        <div>
            <Sidebar user={user.username} setUser={setUser} />
            <Outlet />
        </div>
    ) : <p>Please <a href="/login">log in</a></p>;

};
