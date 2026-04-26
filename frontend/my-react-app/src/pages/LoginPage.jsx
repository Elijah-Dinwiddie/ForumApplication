import Navbar from "../components/Navbar";
import InputButton from "../components/InputButton"
import { useState } from "react";
import { useAuth } from "../AuthContext";

const BASE_URL = "http://localhost:3000"

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { setAuth, setUserID } = useAuth();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const res = await fetch(`${BASE_URL}/accounts/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    email,
                    password
                }),
            });

            const data = await res.json();
            console.log("Response for log in: ", data);
            setAuth(data.accessToken);
            setUserID(data.id)


        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="full-page">
            <Navbar />
            <div className="form-prompt login">
                <div className='sign-in-title'>
                    <b>Sign-in</b>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="input-area">
                        <p className="input-label">Email</p>
                        <input 
                        required className="input-box" 
                        placeholder="user1234" 
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <span className="medium-gap" />
                    <div className="input-area">
                        <p className="input-label">Password</p>
                        <input 
                        required className="input-box" 
                        placeholder="Password" 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="buttons">
                        <span className="medium-gap" />
                        <button className="general-button" type="submit">Sign-in</button>
                        <span className="button-gap" />
                        <InputButton whereTo="/create_account" name="Create Account" />
                        <span className="button-gap" />
                        <InputButton whereTo="/home_page" name="Cancel" />
                    </div>
                </form>
                <span className="end-gap" />
            </div>
        </div>
    );
}