import React from "react";
import { AuthContext } from "../AuthContext"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

export default function Login() {
    const { auth, setAuth } = React.useContext(AuthContext)
    const [loginError, setLoginError] = React.useState(null)
    const [loading, setLoading] = React.useState(null)
    const [loginForm, setLoginForm] = React.useState({
        username: 'sarah',
        password: 'sarah'
    })

    function handleChange(e) {
        setLoginForm((prev) => {
            return {
                ...prev,
                [e.target.name]: e.target.value
            }
        })
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const username = loginForm.username;
        const password = loginForm.password;
        setLoading(true);
        setLoginError(null);
        const response = await fetch('https://sync-social-f87ce6f5ca84.herokuapp.com/api/user/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })
        const data = await response.json()
        if (!response.ok) {
            setLoading(false);
            setLoginError(data.message);
        }
        if (response.ok) {
            localStorage.setItem('user', JSON.stringify(data))
            setAuth(data)
            setLoading(false)
            console.log(auth)
        }
    }

    return (
        <div className="login-form">
            {!loading && <form className="login" onSubmit={handleSubmit}>
            <h1>SyncSocial</h1>
                <input type="text"
                    placeholder="username"
                    id="username"
                    name="username"
                    value={loginForm.username}
                    onChange={handleChange}>
                </input>
                <input type="password"
                    placeholder="password"
                    id="password"
                    name="password"
                    value={loginForm.password}
                    onChange={handleChange}>
                </input>
                <button className="fa-button"><FontAwesomeIcon icon={faArrowRight} className="fa" /></button>
                {loginError && <div className="login-error">
                <p>{loginError}</p>
                </div>}
            </form>}
            {loading && <div>
                <p>Loading...</p>
                </div>}
        </div>
    )
}