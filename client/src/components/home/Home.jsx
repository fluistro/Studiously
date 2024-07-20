import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";


export default function Home() {

    const [user, setUser] = useState();

    // Use api endpoint to get session
    useEffect(() => {
        async function getUser () {
            const res = await fetch("http://localhost:5000/api/auth/");
            const data = await res.json();
            setUser(data.user);
        };
        getUser();
    }, []);

    console.log(user);

    return user ? (
        <div>
            <h1>Homepage</h1>
            <Outlet />
        </div>
    ) : <p>Please <a href="/login">log in</a></p>;
};