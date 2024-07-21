import React, { useState } from "react";

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
        console.log(userInfo);
        const res = await fetch("http://localhost:5000/api/auth/signup", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userInfo)
        });
        const data = await res.json();
        if (data.error) setError(data.error);
        else setSuccess(true);

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
                    <input type="password" id="password" name="password" onChange={onInputChange}></input><br/><br/>
                    <button type="submit" onClick={onSubmit} id="submit-button"><b>Sign up</b></button>
                </form>
            </div>
        </div>
    );
};