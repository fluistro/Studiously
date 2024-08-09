import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { login } from "../../connection/authentication";


/**
 * Login form component. Contains username and password fields.
 * 
 */
export default function LoginForm({}) {

    // Input fields
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();

    // Possible error returned by login request
    const [error, setError] = useState();

    // To check if login was successful
    const [success, setSuccess] = false;

    // Send login request when form is submitted
    async function onSubmit(event) {

        try {

            event.preventDefault();

            if (!username || !password) {
                setError("Missing username or password");
                return;
            }

            // If session already exists or the login request is successful, redirect to homepage.
            await login({ username, password }, () => { setSuccess(true) });
            setSuccess(true);

        } catch (error) {
            setError(error.message);
        }

    }

    // Redirect to homepage if successful
    return (

        success ? <Navigate to="/home" /> :

        <div className="form">

            <div className="form-header">
                <h1>Log in</h1>
            </div>

            <div className="form-error-message">{error && <p className="error">Error: {error}</p>}</div>
            
            <div className="form-body">
                <form>
                    <label htmlFor="login-username">Username</label><br/>
                    <input type="text" 
                           id="login-username" 
                           name="username" 
                           onChange={event => setUsername(event.target.value)}></input>
                    <br/><br/>
                    <label htmlFor="login-password">Password</label><br/>
                    <input type="password" 
                           id="login-password" 
                           name="password" 
                           onChange={event => setPassword(event.target.value)}></input>
                    <br/><br/>
                </form>
                <button type="submit" onClick={onSubmit} className="submit-button"><b>Log in</b></button>
            </div>

            <div className="form-footer">
                <p>Don't have an account? <a href="/signup">Sign up</a></p>
            </div>

        </div>

    );

};