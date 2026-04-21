import Navbar from "../components/Navbar";
import InputButton from "../components/InputButton"

export default function LoginPage() {
    return (
        <div className="full-page">
            <Navbar />
            <div className="login-prompt">
                <div className='sign-in-title'>
                    <b>Sign-in</b>
                </div>
                <div className="input-area">
                    <p className="input-label">Username/Email</p>
                    <input className="input-box" placeholder="user1234" type="text"></input>
                </div>
                <span className="medium-gap" />
                <div className="input-area">
                    <p className="input-label">Password</p>
                    <input className="input-box" placeholder="Password" type="text"></input>
                </div>
                <div className="buttons">
                    <button></button>
                    <span className="button-gap" />
                    <InputButton whereTo="/create_account" name="Create Account" />
                    <span className="button-gap" />
                    <InputButton whereTo="/home_page" name="Cancel" />
                </div>
            </div>
        </div>
    );
}