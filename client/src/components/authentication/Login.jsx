import React from "react";
import { Navigate } from "react-router-dom";
import AuthForm from "./AuthForm";
import "./Form.css";

export default function Login() {

    const OnSuccessComponent = <Navigate to="/home" />;
    const HeaderComponent = (
        <div className="form-header">
            <p>Don't have an account? <a href="/signup">Sign up</a></p>
            <h1>Log in</h1>
        </div>
    );

    return <AuthForm endpoint="login" OnSuccess={OnSuccessComponent} Header={HeaderComponent} />;
    
};