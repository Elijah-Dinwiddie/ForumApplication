import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function NavBar() {
    const {accountInfo} = useAuth();
    let accountLink;
    const accountLinkName = accountInfo?.account_name ?? "Account";

    accountLink = accountInfo?.account_id ? "/account" : "/login";

    return (
        <div className="nav-bar">
            <div className="nav-left">
            <Link className="link" to='/home_page'>Homepage</Link>
            </div>
            <div className="nav-right">
            <Link className="forums-link link" to='/forums'>Forums</Link>
            <Link className="account-link link" to={accountLink}>{accountLinkName}</Link>
            </div>
        </div>
    );
}
