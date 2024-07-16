import React, { useState } from "react";
import axios from 'axios';
import { Navigate } from 'react-router-dom'; 

export default function Login() {

    const [userInfo, setUserInfo] = useState({
        username: "",
        password: ""
    });
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    function onInputChange(event) {
        setUserInfo({...userInfo, [event.target.name]: event.target.value});
    }

    async function onSubmit(event) {

        event.preventDefault();
        axios.post(
            "http://localhost:8000/api/login", 
            JSON.stringify(userInfo)
        ).then(
            res => {
                const data = res.data;
                if (!data.error) setSuccess(true);
                else setError(data.error);
            }
        ).catch();

    }

    return (
        success ? <Navigate to="/home" /> :
        <div className="form">
            <div className="form-header">
                <p>Don't have an account? <a href="/signup">Sign up</a></p>
                <h1>Log in</h1>
            </div>
            
            <div className="form-body">
                {error && <p className="error">Error: {error}</p>}
                {success && <p>Account created! Please <a href="/login">log in</a>.</p>}
                <form>
                    <label htmlFor="username">Username</label><br/>
                    <input type="text" id="username" name="username" onChange={onInputChange}></input><br/><br/>
                    <label htmlFor="password">Password</label><br/>
                    <input type="text" id="password" name="password" onChange={onInputChange}></input><br/><br/>
                    <button type="submit" onClick={onSubmit} id="submit-button"><b>Log in</b></button>
                </form>
            </div>
        </div>
    );
};