import React, { useState } from "react";
import "./Form.css";

// request: the login/signup API request to be sent on submission
// OnSuccess: JSX element to display when form submitted successfully
// Header/Footer: JSX element
export default function AuthForm({ OnSuccess, Header, Footer, request }) {

    // Form fields
    const [userInfo, setUserInfo] = useState({
        username: "",
        password: ""
    });

    const [error, setError] = useState(""); // For display
    const [success, setSuccess] = useState(false);

    // Update username and password when fields are changed
    function onInputChange(event) {
        setUserInfo({...userInfo, [event.target.name]: event.target.value});
    }

    // Send request when form is submitted
    async function onSubmit(event) {
        event.preventDefault();
        const data = await request(userInfo);
        if (data.error) setError(data.error);
        else setSuccess(true);
    }

    return (
        success ? OnSuccess : 
        <div className="form-background">
            <div className="form">
                {Header}

                <div className="form-error">{error && <p className="error">Error: {error}</p>}</div>
                
                <div className="form-body">
                    <form>
                        <label htmlFor="username">Username</label><br/>
                        <input type="text" id="username" name="username" onChange={onInputChange}></input><br/><br/>
                        <label htmlFor="password">Password</label><br/>
                        <input type="password" id="password" name="password" onChange={onInputChange}></input><br/><br/>
                    </form>
                    <button type="submit" onClick={onSubmit} id="submit-button"><b>Log in</b></button>
                </div>

                {Footer}
            </div>
        </div>
    )

}