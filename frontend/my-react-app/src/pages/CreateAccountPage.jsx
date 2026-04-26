import Navbar from "../components/Navbar";
import InputButton from "../components/InputButton";
import InputArea from "../components/InputArea";
import { useState } from "react";

const BASE_URL = "http://localhost:3000";

export default function CreateAccountPage() {
    const [accountName, setAccountName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [checkPassword, setCheckPassword] = useState('')

    async function handleSubmit(e) {
        e.preventDefault();

        if(password != checkPassword) {
            console.log('Passwords do not match!');
            return;
        }

        try {
            const res = await fetch(`${BASE_URL}/accounts`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    accountName,
                    password,
                }),
            });

            const data = await res.json();
            console.log('Account created sucessfully');
        } catch (error) {
            console.log('Error creating account', error);
        }
    }

    return (
        <div className="full-page">
            <Navbar />
            <div className='form-prompt '>
                <div className='sign-in-title'><b>Create An Account</b></div>
                <form onSubmit={handleSubmit}>
                    <InputArea 
                        label='Username' 
                        placeholder='user123' 
                        type ='text' 
                        value={accountName} 
                        onChange={(e) => setAccountName(e.target.value)} 
                    />
                    <InputArea 
                        label='Email' 
                        placeholder='user@mail.com' 
                        type ='text' 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                    <InputArea 
                        label='Password' 
                        placeholder='Password' 
                        type ='password' 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                    <InputArea 
                        label='Confirm Password' 
                        placeholder='Password' 
                        type ='password' 
                        value={checkPassword} 
                        onChange={(e) => setCheckPassword(e.target.value)} 
                    />
                    <div className="button-gap" />
                    <div className="horizontal-buttons">
                        <button className="general-button" type="submit">Create Account</button>
                        <InputButton whereTo="/login" name="Cancel" />
                    </div>
                </form>
                <span className="end-gap" />
            </div>
        </div>
    );
}