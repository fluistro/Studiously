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

    /*
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
        const res = await fetch("http://localhost:5000/api/auth/login", {
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
        success ? <p>Login successful! Go to <a href="/home">your homepage</a>.</p> :
        <div className="form">
            <div className="form-header">
                <p>Don't have an account? <a href="/signup">Sign up</a></p>
                <h1>Log in</h1>
                {error && <p className="error">Error: {error}</p>}
            </div>
            
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
    );
    */
};