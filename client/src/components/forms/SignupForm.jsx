import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { signup } from "../../connection/authentication";
import Loading from "../pages/Loading";
import "./Form.css";


/**
 * Signup form component. Contains username and password fields.
 * 
 */
export default function SignupForm() {

    // Input fields
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();

    // Possible error returned by signup request
    const [error, setError] = useState();

    // To check if signup was successful
    const [success, setSuccess] = useState(false);

    // To check if the loading screen should be shown
    const [loading, setLoading] = useState(false);

    // Send signup request when form is submitted
    async function onSubmit(event) {

        setLoading(true);

        try {

            event.preventDefault();

            if (!username || !password) {
                setError("Missing username or password");
                return;
            }

            // If the signup request is successful, redirect to homepage.
            await signup({ username, password });
            setSuccess(true);

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }

    }

    // Redirect to login if successful
    return loading ? <Loading /> : (

        success ? <Navigate to="/login" /> :

        <div className="form">

            <div className="form-header">
                <h1>Create an account</h1>
            </div>

            <div className="form-error-message">{error && <p className="error">Error: {error}</p>}</div>
            
            <div className="form-body">
                <form>
                    <label htmlFor="signup-username">Username</label><br/>
                    <input type="text" 
                           id="signup-username" 
                           name="username" 
                           onChange={event => setUsername(event.target.value)}></input>
                    <br/><br/>
                    <label htmlFor="signup-password">Password</label><br/>
                    <input type="password" 
                           id="signup-password" 
                           name="password" 
                           onChange={event => setPassword(event.target.value)}></input>
                    <br/><br/>
                </form>
                <button type="submit" onClick={onSubmit} className="submit-button"><b>Sign up</b></button>
            </div>

            <div className="form-footer">
                <p>Already have an account? <a href="/login">Log in</a></p>
            </div>

        </div>

    );

};