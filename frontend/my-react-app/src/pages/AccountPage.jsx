import Navbar from "../components/Navbar";
import { useAuth } from "../AuthContext";

export default function AccountPage() {
    const { accountInfo } = useAuth();
    return (
        <div className="full-page">
            <Navbar />
            <div>Username: {accountInfo?.account_name ?? "loading"}</div>
            <div>Email: {accountInfo?.email ?? "loading"}</div>
            <div>Created at: {accountInfo?.created_at ?? "loading"}</div>
            <div>ID: {accountInfo?.account_id ?? "loading"}</div>
            <img
          className="image"
          src={accountInfo?.profile_img ?? "https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg"}
        ></img>
        </div>
    );
}