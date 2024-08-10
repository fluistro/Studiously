import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import { getCurrentUser } from "../../connection/authentication";
import "./Home.css";

export default function Home() {

    // Username and user id of current user
    const [user, setUser] = useState();

    // Function to reset user on client side
    const resetUser = () => setUser(undefined);

    // Set current user on first render
    useEffect(() => {
        getCurrentUser().then(data => setUser(data));
    }, []);

    return user ? (
        <div className="home-background">
            <Sidebar username={user.username} user_id={user.user_id} resetUser={resetUser} />
            <Outlet username={user.username} user_id={user.user_id} resetUser={resetUser} />
        </div>
    ) : <p>Please <a href="/login">log in</a></p>;

};
