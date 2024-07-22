import React, { useState } from "react";
import "./Form.css";

// endpoint: "login" or "signup"
// OnSuccess: JSX element to display when form submitted successfully
// Header: JSX element
export default function AuthForm({ OnSuccess, Header, endpoint }) {

    const [userInfo, setUserInfo] = useState({
        username: "",
        password: ""
    });
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    // Update username and password when fields are changed
    function onInputChange(event) {
        setUserInfo({...userInfo, [event.target.name]: event.target.value});
    }

    // Send request to appropriate endpoint when form is submitted
    async function onSubmit(event) {

        event.preventDefault();
        const res = await fetch(`http://localhost:5000/api/auth/${endpoint}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(userInfo)
        });
        const data = await res.json();
        if (data.error) setError(data.error);
        else setSuccess(true);

    }

    return (
        success ? OnSuccess : 
        <div className="form">
            {Header}
            <div>{error && <p className="error">Error: {error}</p>}</div>
            
            <div className="form-body">
                <form>
                    <label htmlFor="username">Username</label><br/>
                    <input type="text" id="username" name="username" onChange={onInputChange}></input><br/><br/>
                    <label htmlFor="password">Password</label><br/>
                    <input type="password" id="password" name="password" onChange={onInputChange}></input><br/><br/>
                    <button type="submit" onClick={onSubmit} id="submit-button"><b>Log in</b></button>
                </form>
            </div>
        </div>
    )

}