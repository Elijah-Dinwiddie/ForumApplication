import { Link } from "react-router-dom";

export default function NavBar() {
    return (
        <div className="nav-bar">
            <div className="nav-left">
            <Link className="link" to='/home_page'>Homepage</Link>
            </div>
            <div className="nav-right">
            <Link className="forums-link link" to='/forums'>Forums</Link>
            <Link className="account-link link" to='/login'>Account</Link>
            </div>
        </div>
    );
}
