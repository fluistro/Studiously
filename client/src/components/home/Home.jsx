import React from "react";
import { Outlet } from "react-router-dom";

export default function Home() {

    // Use api endpoint to get session
    const user_id = "example-id";

    return user_id ? (
        <div>
            <h1>Homepage</h1>
            <Outlet />
        </div>
    ) : <p>Please <a href="/login">log in</a></p>;
};