import React from "react";
import { Navigate } from "react-router-dom";
import AuthForm from "./AuthForm";
import "./Form.css";

export default function Signup() {

    const OnSuccessComponent = <Navigate to="/login" />;
    const HeaderComponent = (
        <div className="form-header">
            <p>Already have an account? <a href="/login">Log in</a></p>
            <h1>Create an account</h1>
        </div>
    );

    return <AuthForm endpoint="signup" OnSuccess={OnSuccessComponent} Header={HeaderComponent} />;

};