import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";


export default function Home() {

    const [user, setUser] = useState();

    // Get current user on first render
    useEffect(() => {
        console.log("useEffect");
        fetch("http://localhost:5000/api/auth/", { credentials: 'include' })
            .then(res => res.json())
            .then(data => { console.log(data); setUser(data.username) });
        /*
        async function getUser () {
            const res = await fetch("http://localhost:5000/api/auth/");
            const data = await res.json();
            setUser(data.user);
        };
        getUser();
        */
    }, []);

    console.log(user);

    return user ? (
        <div>
            <h1>Homepage</h1>
            <Outlet />
        </div>
    ) : <p>Please <a href="/login">log in</a></p>;
};