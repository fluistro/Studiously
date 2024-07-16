import React, { useState } from "react";
import axios from 'axios';

export default function Signup() {

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
            "http://localhost:8000/api/signup", 
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
        <div className="form">
            <div className="form-header">
                <p>Already have an account? <a href="/login">Log in</a></p>
                <h1>Create an account</h1>
            </div>
            
            <div className="form-body">
                {error && <p className="error">Error: {error}</p>}
                {success && <p>Account created! Please <a href="/login">log in</a>.</p>}
                <form>
                    <label htmlFor="username">Username</label><br/>
                    <input type="text" id="username" name="username" onChange={onInputChange}></input><br/><br/>
                    <label htmlFor="password">Password</label><br/>
                    <input type="text" id="password" name="password" onChange={onInputChange}></input><br/><br/>
                    <button type="submit" onClick={onSubmit} id="submit-button"><b>Sign up</b></button>
                </form>
            </div>
        </div>
    );
};